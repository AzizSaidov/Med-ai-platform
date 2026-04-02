from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html

from .models import AIChatSession, Appointment, DoctorProfile, TelegramLinkCode, TelegramProfile, User


admin.site.site_header = "Панель управления Med Tech"
admin.site.site_title = "Med Tech Админка"
admin.site.index_title = "Управление платформой"


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ["username"]
    list_display = [
        "username",
        "email",
        "display_name_admin",
        "role_summary",
        "is_email_verified",
        "is_staff",
        "is_active",
    ]
    list_filter = ["is_staff", "is_superuser", "is_active", "is_email_verified", "groups"]
    search_fields = ["username", "email", "first_name", "last_name", "phone"]

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Личная информация", {"fields": ("first_name", "last_name", "email", "phone", "avatar")}),
        (
            "Подтверждение",
            {
                "fields": (
                    "is_email_verified",
                    "email_verification_token",
                    "email_verification_sent_at",
                )
            },
        ),
        (
            "Права доступа",
            {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")},
        ),
        ("Важные даты", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "email", "first_name", "last_name", "password1", "password2", "groups"),
            },
        ),
    )

    @admin.display(description="Отображаемое имя")
    def display_name_admin(self, obj):
        return obj.display_name

    @admin.display(description="Роли")
    def role_summary(self, obj):
        role_names = list(obj.groups.values_list("name", flat=True))
        if obj.is_superuser:
            role_names.insert(0, "admin")
        labels = {"admin": "админ", "doctor": "врач", "patient": "пациент"}
        role_names = [labels.get(name, name) for name in role_names]
        return ", ".join(dict.fromkeys(role_names)) if role_names else "пользователь"


@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = [
        "display_name",
        "specialization",
        "status_badge",
        "rating",
        "experience",
        "address",
        "schedule_overview",
    ]
    list_filter = ["status", "specialization"]
    search_fields = ["user__username", "user__first_name", "user__last_name", "specialization", "address"]
    autocomplete_fields = ["user"]

    fieldsets = (
        (
            "Профиль врача",
            {
                "fields": (
                    "user",
                    "specialization",
                    "status",
                    "experience",
                    "rating",
                    "consultation_fee",
                )
            },
        ),
        ("Публичный профиль", {"fields": ("bio", "photo", "phone", "address")}),
        ("Карта", {"fields": ("latitude", "longitude")}),
        ("График", {"fields": ("available_days", "workday_start", "workday_end", "slot_duration_minutes")}),
    )

    @admin.display(description="Статус")
    def status_badge(self, obj):
        palette = {
            "online": ("#d1fae5", "#065f46"),
            "busy": ("#fef3c7", "#92400e"),
            "offline": ("#e5eef7", "#3b4f63"),
        }
        bg, color = palette.get(obj.status, ("#e5eef7", "#3b4f63"))
        return format_html(
            '<span style="display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;'
            'background:{};color:{};font-weight:700;font-size:12px;">{}</span>',
            bg,
            color,
            obj.get_status_display(),
        )

    @admin.display(description="График")
    def schedule_overview(self, obj):
        return f"{obj.get_available_days_display()} | {obj.workday_start:%H:%M}-{obj.workday_end:%H:%M}"


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = [
        "patient_name",
        "doctor_name",
        "scheduled_at",
        "duration_minutes",
        "status",
        "is_deleted",
        "is_archived",
    ]
    list_filter = ["status", "is_deleted", "is_archived", "doctor__specialization"]
    search_fields = [
        "patient__username",
        "patient__first_name",
        "patient__last_name",
        "doctor__user__username",
        "doctor__user__first_name",
        "doctor__user__last_name",
        "doctor__specialization",
        "notes",
    ]
    autocomplete_fields = ["patient", "doctor"]
    date_hierarchy = "scheduled_at"
    readonly_fields = ["created_at", "deleted_at", "archived_at", "patient_day_reminder_sent_at", "doctor_day_reminder_sent_at"]

    fieldsets = (
        ("Детали приёма", {"fields": ("patient", "doctor", "scheduled_at", "duration_minutes", "status", "notes")}),
        ("Жизненный цикл", {"fields": ("is_deleted", "deleted_at", "is_archived", "archived_at", "created_at")}),
        ("Напоминания", {"fields": ("patient_day_reminder_sent_at", "doctor_day_reminder_sent_at")}),
    )

    @admin.display(description="Пациент")
    def patient_name(self, obj):
        return obj.patient.display_name

    @admin.display(description="Врач")
    def doctor_name(self, obj):
        return obj.doctor.display_name


@admin.register(AIChatSession)
class AIChatSessionAdmin(admin.ModelAdmin):
    list_display = ["user", "started_at", "message_count"]
    search_fields = ["user__username", "user__email", "user__first_name", "user__last_name"]
    readonly_fields = ["started_at", "history_preview"]

    fieldsets = (
        ("Сессия", {"fields": ("user", "started_at")}),
        ("Диалог", {"fields": ("history_preview",)}),
    )

    @admin.display(description="Сообщений")
    def message_count(self, obj):
        return len(obj.history or [])

    @admin.display(description="История")
    def history_preview(self, obj):
        if not obj.history:
            return "Сообщений пока нет."
        preview_lines = [
            f"{item.get('role', 'unknown')}: {item.get('content', '')[:160]}"
            for item in obj.history[-12:]
        ]
        return "\n\n".join(preview_lines)


@admin.register(TelegramProfile)
class TelegramProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "chat_id", "telegram_username", "notifications_enabled", "linked_at"]
    list_filter = ["notifications_enabled", "language_code"]
    search_fields = ["user__username", "telegram_username", "telegram_first_name", "chat_id"]
    readonly_fields = ["linked_at", "updated_at"]


@admin.register(TelegramLinkCode)
class TelegramLinkCodeAdmin(admin.ModelAdmin):
    list_display = ["user", "code", "created_at", "expires_at", "is_used", "is_active_now"]
    list_filter = ["is_used"]
    search_fields = ["user__username", "code"]
    readonly_fields = ["created_at", "used_at"]

    @admin.display(description="Активен")
    def is_active_now(self, obj):
        return obj.is_active
