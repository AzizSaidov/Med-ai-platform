from asgiref.sync import async_to_sync
from aiogram import Bot
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from django.conf import settings
from django.core.mail import send_mail
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone

from .models import AIChatSession, Appointment, User


def _safe_appointment_time(appointment):
    return timezone.localtime(appointment.scheduled_at).strftime("%d %b %Y, %H:%M")


def _safe_doctor_name(appointment):
    return appointment.doctor.user.get_full_name() or appointment.doctor.user.username


def _safe_patient_name(appointment):
    return appointment.patient.get_full_name() or appointment.patient.username


def _send_email_notification(subject, message, recipient):
    if not recipient:
        return False

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[recipient],
        fail_silently=True,
    )
    return True


def _send_telegram_notification(chat_id, text):
    token = getattr(settings, "TELEGRAM_BOT_TOKEN", "")
    if not token or not chat_id:
        return False

    bot = Bot(
        token=token,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML),
    )
    try:
        async_to_sync(bot.send_message)(chat_id, text)
        return True
    except Exception:
        return False
    finally:
        async_to_sync(bot.session.close)()


def _notify_user_about_cancellation(user, telegram_profile, subject, email_message, telegram_message):
    if telegram_profile and telegram_profile.notifications_enabled:
        if _send_telegram_notification(telegram_profile.chat_id, telegram_message):
            return

    _send_email_notification(subject, email_message, user.email)


def _build_patient_cancellation_messages(appointment):
    doctor_name = _safe_doctor_name(appointment)
    scheduled_at = _safe_appointment_time(appointment)
    subject = "Med Tech: запись отменена | appointment cancelled"
    email_message = (
        f"Здравствуйте, {appointment.patient.username}!\n\n"
        f"Ваша запись к Dr. {doctor_name} была отменена.\n"
        f"Дата и время: {scheduled_at}\n"
        f"Статус: cancelled\n\n"
        "Проверьте Med Tech, если хотите выбрать другое время.\n\n"
        f"Hello, {appointment.patient.username}!\n\n"
        f"Your appointment with Dr. {doctor_name} has been cancelled.\n"
        f"Date and time: {scheduled_at}\n"
        "Status: cancelled\n\n"
        "Open Med Tech if you want to book another slot."
    )
    telegram_message = (
        "❌ <b>Запись отменена</b>\n\n"
        f"Врач: <b>{appointment.doctor.display_name}</b>\n"
        f"Дата и время: {scheduled_at}\n"
        f"Специализация: {appointment.doctor.specialization}\n\n"
        "Открой Med Tech, если хочешь выбрать новую дату."
    )
    return subject, email_message, telegram_message


def _build_doctor_cancellation_messages(appointment):
    doctor_name = _safe_doctor_name(appointment)
    patient_name = _safe_patient_name(appointment)
    scheduled_at = _safe_appointment_time(appointment)
    subject = "Med Tech: запись отменена пациентом | appointment cancelled"
    email_message = (
        f"Здравствуйте, Dr. {doctor_name}!\n\n"
        "Одна из записей была отменена.\n"
        f"Пациент: {patient_name}\n"
        f"Дата и время: {scheduled_at}\n"
        f"Заметки: {appointment.notes or 'Без дополнительных заметок'}\n\n"
        "Проверьте Med Tech, если нужно обновить расписание.\n\n"
        f"Hello, Dr. {doctor_name}!\n\n"
        "One of your appointments has been cancelled.\n"
        f"Patient: {patient_name}\n"
        f"Date and time: {scheduled_at}\n"
        f"Notes: {appointment.notes or 'No additional notes'}\n\n"
        "Open Med Tech if you need to review your schedule."
    )
    telegram_message = (
        "❌ <b>Приём отменён</b>\n\n"
        f"Пациент: <b>{appointment.patient.display_name}</b>\n"
        f"Дата и время: {scheduled_at}\n"
        f"Заметки: {appointment.notes or 'Без дополнительных заметок'}\n\n"
        "Проверь Med Tech, если нужно открыть расписание."
    )
    return subject, email_message, telegram_message


def _send_cancellation_notifications(appointment):
    patient_subject, patient_email, patient_telegram = _build_patient_cancellation_messages(appointment)
    patient_profile = getattr(appointment.patient, "telegram_profile", None)
    _notify_user_about_cancellation(
        appointment.patient,
        patient_profile,
        patient_subject,
        patient_email,
        patient_telegram,
    )

    doctor_user = appointment.doctor.user
    doctor_profile = getattr(doctor_user, "telegram_profile", None)
    doctor_subject, doctor_email, doctor_telegram = _build_doctor_cancellation_messages(appointment)
    _notify_user_about_cancellation(
        doctor_user,
        doctor_profile,
        doctor_subject,
        doctor_email,
        doctor_telegram,
    )


@receiver(post_save, sender=User)
def create_ai_chat_session(sender, instance, created, **kwargs):
    if created and not AIChatSession.objects.filter(user=instance).exists():
        AIChatSession.objects.create(user=instance)


@receiver(pre_save, sender=Appointment)
def store_previous_appointment_state(sender, instance, **kwargs):
    if not instance.pk:
        instance._previous_cancelled_state = False
        return

    previous = (
        Appointment.objects.filter(pk=instance.pk)
        .only("status", "is_deleted")
        .first()
    )
    instance._previous_cancelled_state = bool(
        previous and (previous.status == "cancelled" or previous.is_deleted)
    )


@receiver(post_save, sender=Appointment)
def send_appointment_created_email(sender, instance, created, **kwargs):
    if not created:
        return

    doctor_name = _safe_doctor_name(instance)
    patient_name = _safe_patient_name(instance)
    scheduled_at = _safe_appointment_time(instance)

    if instance.patient.email:
        _send_email_notification(
            subject="Med Tech: запись подтверждена | appointment confirmed",
            message=(
                f"Здравствуйте, {instance.patient.username}!\n\n"
                f"Ваша запись к Dr. {doctor_name} успешно создана.\n"
                f"Дата и время: {scheduled_at}\n"
                f"Статус: {instance.status}\n\n"
                f"Hello, {instance.patient.username}!\n\n"
                f"Your appointment with Dr. {doctor_name} has been created successfully.\n"
                f"Date and time: {scheduled_at}\n"
                f"Status: {instance.status}\n\n"
                "Спасибо, что пользуетесь Med Tech.\n"
                "Thank you for using Med Tech."
            ),
            recipient=instance.patient.email,
        )

    if instance.doctor.user.email:
        _send_email_notification(
            subject="Med Tech: новая запись пациента | new appointment booked",
            message=(
                f"Здравствуйте, Dr. {doctor_name}!\n\n"
                "В вашем расписании появилась новая запись.\n"
                f"Пациент: {patient_name}\n"
                f"Дата и время: {scheduled_at}\n"
                f"Статус: {instance.status}\n"
                f"Заметки: {instance.notes or 'Без дополнительных заметок'}\n\n"
                f"Hello, Dr. {doctor_name}!\n\n"
                "A new appointment has been booked in your schedule.\n"
                f"Patient: {patient_name}\n"
                f"Date and time: {scheduled_at}\n"
                f"Status: {instance.status}\n"
                f"Notes: {instance.notes or 'No additional notes'}\n\n"
                "Проверьте детали в панели Med Tech.\n"
                "Please review it in your Med Tech dashboard."
            ),
            recipient=instance.doctor.user.email,
        )


@receiver(post_save, sender=Appointment)
def send_appointment_cancelled_notifications(sender, instance, created, **kwargs):
    if created:
        return

    previous_cancelled_state = getattr(instance, "_previous_cancelled_state", False)
    current_cancelled_state = instance.status == "cancelled" or instance.is_deleted

    if current_cancelled_state and not previous_cancelled_state:
        _send_cancellation_notifications(instance)
