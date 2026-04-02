from asgiref.sync import sync_to_async
from django.utils import timezone

from core.models import Appointment


ACTIVE_REMINDER_STATUSES = ("pending", "confirmed")


def get_today_reminder_queryset():
    now = timezone.localtime()
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = now.replace(hour=23, minute=59, second=59, microsecond=999999)

    return (
        Appointment.objects.with_related()
        .filter(
            is_deleted=False,
            is_archived=False,
            status__in=ACTIVE_REMINDER_STATUSES,
            scheduled_at__gte=start_of_day,
            scheduled_at__lte=end_of_day,
        )
        .select_related(
            "patient",
            "patient__telegram_profile",
            "doctor",
            "doctor__user",
            "doctor__user__telegram_profile",
        )
        .order_by("scheduled_at")
    )


def get_today_reminder_appointments():
    return list(get_today_reminder_queryset())


def build_patient_day_reminder_text(appointment):
    local_dt = timezone.localtime(appointment.scheduled_at)
    return (
        "🗓 <b>Напоминание о записи на сегодня</b>\n\n"
        f"Врач: <b>{appointment.doctor.display_name}</b>\n"
        f"Специализация: {appointment.doctor.specialization}\n"
        f"Время: {local_dt:%d %b %Y, %H:%M}\n"
        f"Адрес: {appointment.doctor.address or 'Уточните адрес в Med Tech'}\n"
        f"Заметки: {appointment.notes or 'Без дополнительных заметок'}\n\n"
        "Открой Med Tech, если хочешь быстро проверить детали визита."
    )


def build_doctor_day_reminder_text(appointment):
    local_dt = timezone.localtime(appointment.scheduled_at)
    return (
        "🩺 <b>Напоминание о приеме на сегодня</b>\n\n"
        f"Пациент: <b>{appointment.patient.display_name}</b>\n"
        f"Время: {local_dt:%d %b %Y, %H:%M}\n"
        f"Статус: {appointment.status}\n"
        f"Заметки: {appointment.notes or 'Без дополнительных заметок'}\n\n"
        "Проверь Med Tech, если нужно открыть полную карточку записи."
    )


async def send_due_day_reminders(bot):
    appointments = await sync_to_async(get_today_reminder_appointments)()
    now = timezone.now()
    sent_patient = 0
    sent_doctor = 0
    skipped = 0

    for appointment in appointments:
        targets = appointment.reminder_targets_for_today()
        if not targets:
            skipped += 1
            continue

        updated_fields = []

        for target_type, telegram_profile in targets:
            if target_type == "patient":
                await bot.send_message(
                    telegram_profile.chat_id,
                    build_patient_day_reminder_text(appointment),
                )
                appointment.patient_day_reminder_sent_at = now
                updated_fields.append("patient_day_reminder_sent_at")
                sent_patient += 1
            elif target_type == "doctor":
                await bot.send_message(
                    telegram_profile.chat_id,
                    build_doctor_day_reminder_text(appointment),
                )
                appointment.doctor_day_reminder_sent_at = now
                updated_fields.append("doctor_day_reminder_sent_at")
                sent_doctor += 1

        if updated_fields:
            await sync_to_async(appointment.save)(update_fields=updated_fields)

    return {
        "patients": sent_patient,
        "doctors": sent_doctor,
        "skipped": skipped,
    }
