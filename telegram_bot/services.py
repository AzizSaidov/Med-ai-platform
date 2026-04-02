from django.conf import settings
from django.utils import timezone

from core.models import Appointment, DoctorProfile, TelegramLinkCode, TelegramProfile


STATUS_LABELS = {
    "pending": "Ожидает",
    "confirmed": "Подтвержден",
    "completed": "Завершен",
    "cancelled": "Отменен",
}

ACTIVE_APPOINTMENT_STATUSES = ("pending", "confirmed")


def archive_elapsed_appointments_for_bot():
    elapsed_appointments = (
        Appointment.objects.with_related()
        .active()
        .filter(is_archived=False, scheduled_at__lt=timezone.now())
    )

    for appointment in elapsed_appointments:
        if appointment.should_be_archived:
            appointment.archive()


def get_site_urls():
    base_url = settings.SITE_URL.rstrip("/")
    return {
        "base": base_url,
        "register": f"{base_url}/register/",
        "login": f"{base_url}/login/",
        "dashboard": f"{base_url}/",
        "appointments": f"{base_url}/appointments/",
        "doctors": f"{base_url}/doctors/",
        "ai_chat": f"{base_url}/chat/",
        "telegram": f"{base_url}/telegram/",
        "telegram_connect": f"{base_url}/telegram/connect/",
    }


def get_telegram_profile(chat_id):
    return TelegramProfile.objects.select_related("user").filter(chat_id=chat_id).first()


def get_role_key(user, doctor_profile=None):
    if getattr(user, "is_superuser", False):
        return "admin"
    if doctor_profile is not None:
        return "doctor"
    return "patient"


def get_role_label(role_key):
    return {
        "admin": "Администратор",
        "doctor": "Доктор",
        "patient": "Пациент",
    }.get(role_key, "Пользователь")


def get_linked_account_context(chat_id):
    profile = get_telegram_profile(chat_id)
    if profile is None:
        return None

    doctor_profile = (
        DoctorProfile.objects.select_related("user").filter(user=profile.user).first()
    )
    role_key = get_role_key(profile.user, doctor_profile=doctor_profile)
    return {
        "telegram_profile": profile,
        "user": profile.user,
        "doctor_profile": doctor_profile,
        "role_key": role_key,
        "role_label": get_role_label(role_key),
    }


def build_bot_public_url():
    username = (settings.TELEGRAM_BOT_USERNAME or "").strip().lstrip("@")
    if not username:
        return None
    return f"https://t.me/{username}"


def build_bot_deep_link(code):
    bot_url = build_bot_public_url()
    if not bot_url:
        return None
    return f"{bot_url}?start=link_{code}"


def link_telegram_account(code, chat_id, telegram_username="", first_name="", language_code=""):
    link_code = (
        TelegramLinkCode.objects.select_related("user")
        .filter(code=code.upper())
        .order_by("-created_at")
        .first()
    )

    if link_code is None:
        return None, "Код не найден. Сгенерируй новый код на сайте и попробуй снова."

    if not link_code.is_active:
        return None, "Код уже использован или истек. Сгенерируй новый код и попробуй снова."

    TelegramProfile.objects.filter(chat_id=chat_id).exclude(user=link_code.user).delete()
    profile, _ = TelegramProfile.objects.update_or_create(
        user=link_code.user,
        defaults={
            "chat_id": chat_id,
            "telegram_username": telegram_username or "",
            "telegram_first_name": first_name or "",
            "language_code": language_code or "",
        },
    )
    link_code.mark_used()
    return profile, None


def disconnect_telegram_account(user):
    TelegramLinkCode.objects.filter(user=user, is_used=False).delete()
    TelegramProfile.objects.filter(user=user).delete()


def _get_upcoming_queryset():
    archive_elapsed_appointments_for_bot()
    return (
        Appointment.objects.with_related()
        .visible()
        .filter(
            scheduled_at__gte=timezone.now(),
            status__in=ACTIVE_APPOINTMENT_STATUSES,
        )
        .order_by("scheduled_at")
    )


def get_upcoming_appointments_for_chat(chat_id, limit=5):
    context = get_linked_account_context(chat_id)
    if context is None:
        return None, []

    queryset = _get_upcoming_queryset()
    role_key = context["role_key"]

    if role_key == "doctor":
        appointments = queryset.filter(doctor=context["doctor_profile"])[:limit]
    elif role_key == "admin":
        appointments = queryset[:limit]
    else:
        appointments = queryset.filter(patient=context["user"])[:limit]

    return context, list(appointments)


def get_next_appointment_for_chat(chat_id):
    context, appointments = get_upcoming_appointments_for_chat(chat_id, limit=1)
    return context, appointments[0] if appointments else None


def get_doctor_directory(limit=12):
    return list(
        DoctorProfile.objects.select_related("user")
        .order_by("-rating", "user__first_name", "user__username")[:limit]
    )


def get_doctor_by_id(doctor_id):
    return DoctorProfile.objects.select_related("user").filter(pk=doctor_id).first()


def get_doctor_booking_url(doctor_id):
    return f"{settings.SITE_URL.rstrip('/')}/book/{doctor_id}/"


def get_doctor_profile_url(doctor_id):
    return f"{settings.SITE_URL.rstrip('/')}/doctor-profiles/{doctor_id}/"


def format_appointment_line(appointment, role_key="patient"):
    local_dt = timezone.localtime(appointment.scheduled_at)
    status_label = STATUS_LABELS.get(appointment.status, appointment.status)

    if role_key == "doctor":
        counterpart = f"Пациент: {appointment.patient.display_name}"
    elif role_key == "admin":
        counterpart = (
            f"Пациент: {appointment.patient.display_name} | "
            f"Врач: {appointment.doctor.display_name}"
        )
    else:
        counterpart = f"Врач: {appointment.doctor.display_name}"

    return (
        f"{local_dt:%d %b %Y, %H:%M}\n"
        f"{counterpart}\n"
        f"Специализация: {appointment.doctor.specialization}\n"
        f"Статус: {status_label}"
    )


def format_doctor_card(doctor):
    fee = f"${doctor.consultation_fee}" if doctor.consultation_fee else "По запросу"
    experience = f"{doctor.experience} лет опыта"
    address = doctor.address or "Адрес пока не указан"
    schedule = doctor.get_available_days_display()
    phone = doctor.phone or "Не указан"
    return (
        f"👨‍⚕️ <b>{doctor.display_name}</b>\n"
        f"Специализация: {doctor.specialization}\n"
        f"Рейтинг: {doctor.rating}\n"
        f"Опыт: {experience}\n"
        f"Статус: {doctor.get_status_display()}\n"
        f"График: {schedule}\n"
        f"Время: {doctor.workday_start:%H:%M} - {doctor.workday_end:%H:%M}\n"
        f"Телефон: {phone}\n"
        f"Стоимость: {fee}\n"
        f"Адрес: {address}"
    )


def format_linked_account_text(context):
    profile = context["telegram_profile"]
    user = context["user"]
    role_label = context["role_label"]
    doctor_profile = context["doctor_profile"]

    lines = [
        "🔐 <b>Подключенный аккаунт</b>",
        "",
        f"Сайт: <b>{user.username}</b>",
        f"Роль: {role_label}",
        f"Telegram: @{profile.telegram_username}" if profile.telegram_username else "Telegram username скрыт",
        f"Chat ID: <code>{profile.chat_id}</code>",
    ]

    if doctor_profile is not None:
        lines.append(f"Профиль врача: {doctor_profile.display_name}")

    lines.extend(
        [
            "",
            "Если хочешь переподключить Telegram, открой страницу Telegram на сайте и создай новый код.",
        ]
    )

    return "\n".join(lines)


def get_home_text(context):
    user = context["user"]
    role_label = context["role_label"]

    if context["role_key"] == "doctor":
        subtitle = "Следи за ближайшими пациентами, быстро открывай профиль врача и проверяй расписание."
    elif context["role_key"] == "admin":
        subtitle = "Открывай ближайшие записи, каталог врачей и переходы на сайт из одного меню."
    else:
        subtitle = "Проверяй свои записи, ближайший прием и каталог врачей прямо с телефона."

    return (
        "✨ <b>Med Tech Telegram Assistant</b>\n\n"
        f"Подключен аккаунт <b>{user.username}</b>.\n"
        f"Роль: {role_label}.\n"
        f"{subtitle}"
    )
