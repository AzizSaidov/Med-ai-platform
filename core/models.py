import secrets
import string
from datetime import time, timedelta

from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)

    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=120, blank=True, default="")
    email_verification_sent_at = models.DateTimeField(blank=True, null=True)

    @property
    def is_doctor(self):
        return self.groups.filter(name="doctor").exists()

    @property
    def is_patient(self):
        return self.groups.filter(name="patient").exists()

    @property
    def display_name(self):
        return self.get_full_name().strip() or self.username

    @property
    def has_doctor_profile(self):
        if not self.pk:
            return False

        return DoctorProfile.objects.filter(user=self).exists()

    def generate_email_verification_token(self):
        self.email_verification_token = secrets.token_urlsafe(32)
        self.email_verification_sent_at = timezone.now()
        self.save(update_fields=["email_verification_token", "email_verification_sent_at"])
        return self.email_verification_token

    def email_verification_token_is_valid(self):
        if not self.email_verification_token or not self.email_verification_sent_at:
            return False
        return timezone.now() <= self.email_verification_sent_at + timedelta(hours=24)

    def confirm_email(self):
        self.is_email_verified = True
        self.is_active = True
        self.email_verification_token = ""
        self.email_verification_sent_at = None
        self.save(
            update_fields=[
                "is_email_verified",
                "is_active",
                "email_verification_token",
                "email_verification_sent_at",
            ]
        )

    def __str__(self):
        return self.username


class DoctorProfile(models.Model):
    WEEKDAY_CHOICES = [
        ("0", "Monday"),
        ("1", "Tuesday"),
        ("2", "Wednesday"),
        ("3", "Thursday"),
        ("4", "Friday"),
        ("5", "Saturday"),
        ("6", "Sunday"),
    ]
    WEEKDAY_LABELS = {int(value): label for value, label in WEEKDAY_CHOICES}

    class Status(models.TextChoices):
        ONLINE = "online", "Online"
        BUSY = "busy", "Busy"
        OFFLINE = "offline", "Offline"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="doctor_profile")
    specialization = models.CharField(max_length=100, default="Therapist")
    experience = models.PositiveIntegerField(default=0, verbose_name="Experience (years)")
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.OFFLINE)

    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    address = models.CharField(max_length=300, blank=True)

    phone = models.CharField(max_length=30, blank=True)
    bio = models.TextField(blank=True)
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    photo = models.ImageField(upload_to="doctors/", blank=True, null=True)
    available_days = models.CharField(max_length=32, default="0,1,2,3,4")
    workday_start = models.TimeField(default=time(9, 0))
    workday_end = models.TimeField(default=time(17, 0))
    slot_duration_minutes = models.PositiveSmallIntegerField(default=30)

    @property
    def display_name(self):
        return f"Dr. {self.user.display_name}"

    def get_available_day_indexes(self):
        indexes = []
        for value in (self.available_days or "").split(","):
            value = value.strip()
            if value.isdigit():
                day_index = int(value)
                if day_index in self.WEEKDAY_LABELS:
                    indexes.append(day_index)
        return sorted(set(indexes))

    def get_available_days_display(self):
        labels = [self.WEEKDAY_LABELS[index] for index in self.get_available_day_indexes()]
        return ", ".join(labels) if labels else "Schedule not set"

    def validate_schedule_settings(self):
        errors = {}

        if not self.get_available_day_indexes():
            errors["available_days"] = "Select at least one available day."

        if self.workday_start and self.workday_end and self.workday_start >= self.workday_end:
            errors["workday_end"] = "Working hours end must be later than the start time."

        if self.slot_duration_minutes < 5:
            errors["slot_duration_minutes"] = "Slot duration must be at least 5 minutes."

        if errors:
            raise ValidationError(errors)

    def build_daily_slots(self, duration_minutes=None):
        duration = duration_minutes or self.slot_duration_minutes
        slots = []
        current_minutes = self.workday_start.hour * 60 + self.workday_start.minute
        end_minutes = self.workday_end.hour * 60 + self.workday_end.minute

        while current_minutes + duration <= end_minutes:
            hour, minute = divmod(current_minutes, 60)
            slots.append(time(hour=hour, minute=minute))
            current_minutes += self.slot_duration_minutes

        return slots

    def validate_appointment_time(self, scheduled_at, duration_minutes=None, appointment_id=None):
        if not scheduled_at:
            return

        if timezone.is_naive(scheduled_at):
            scheduled_at = timezone.make_aware(scheduled_at, timezone.get_current_timezone())

        duration_minutes = duration_minutes or self.slot_duration_minutes
        local_dt = timezone.localtime(scheduled_at, timezone.get_current_timezone())
        weekday = local_dt.weekday()
        current_minutes = local_dt.hour * 60 + local_dt.minute
        start_minutes = self.workday_start.hour * 60 + self.workday_start.minute
        end_minutes = self.workday_end.hour * 60 + self.workday_end.minute

        if weekday not in self.get_available_day_indexes():
            raise ValidationError(
                {"scheduled_at": "This doctor is not available on the selected day."}
            )

        if current_minutes < start_minutes or current_minutes >= end_minutes:
            raise ValidationError(
                {"scheduled_at": "Choose a time inside the doctor's working hours."}
            )

        if current_minutes + duration_minutes > end_minutes:
            raise ValidationError(
                {"scheduled_at": "The selected appointment would end after the doctor's working hours."}
            )

        if (current_minutes - start_minutes) % self.slot_duration_minutes != 0:
            raise ValidationError(
                {"scheduled_at": f"Appointments must match {self.slot_duration_minutes}-minute time slots."}
            )

        appointment_start = scheduled_at
        appointment_end = appointment_start + timedelta(minutes=duration_minutes)

        related_appointments = (
            Appointment.objects.active()
            .filter(doctor=self)
            .exclude(pk=appointment_id)
            .only("scheduled_at", "duration_minutes")
        )

        for existing in related_appointments:
            existing_start = existing.scheduled_at
            if timezone.is_naive(existing_start):
                existing_start = timezone.make_aware(existing_start, timezone.get_current_timezone())

            existing_duration = existing.duration_minutes or self.slot_duration_minutes
            existing_end = existing_start + timedelta(minutes=existing_duration)

            if appointment_start < existing_end and appointment_end > existing_start:
                raise ValidationError(
                    {"scheduled_at": "This time slot overlaps with another appointment. Please choose another one."}
                )

    def clean(self):
        super().clean()
        self.validate_schedule_settings()

    def can_be_managed_by(self, user):
        if not getattr(user, "is_authenticated", False):
            return False
        return user.is_superuser or self.user_id == user.id

    def __str__(self):
        return f"{self.display_name} - {self.specialization}"


class AppointmentQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_deleted=False)

    def visible(self):
        return self.active().filter(is_archived=False)

    def with_related(self):
        return self.select_related("patient", "doctor", "doctor__user")


class Appointment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="appointments")
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name="appointments")
    scheduled_at = models.DateTimeField()
    duration_minutes = models.PositiveSmallIntegerField(default=30)
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    is_archived = models.BooleanField(default=False)
    archived_at = models.DateTimeField(null=True, blank=True)
    patient_day_reminder_sent_at = models.DateTimeField(null=True, blank=True)
    doctor_day_reminder_sent_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    objects = AppointmentQuerySet.as_manager()

    @property
    def doctor_name(self):
        return self.doctor.display_name

    @property
    def patient_name(self):
        return self.patient.display_name

    @property
    def is_upcoming(self):
        return (
            not self.is_deleted
            and self.status in {"pending", "confirmed"}
            and self.scheduled_at >= timezone.now()
        )

    def is_patient_owner(self, user):
        return getattr(user, "is_authenticated", False) and self.patient_id == user.id

    def is_doctor_owner(self, user):
        return getattr(user, "is_authenticated", False) and self.doctor.user_id == user.id

    @property
    def scheduled_until(self):
        return self.scheduled_at + timedelta(minutes=self.duration_minutes or self.doctor.slot_duration_minutes)

    @property
    def should_be_archived(self):
        return (
            not self.is_deleted
            and not self.is_archived
            and self.scheduled_until <= timezone.now()
        )

    def archive(self):
        self.is_archived = True
        self.archived_at = timezone.now()
        self.save(update_fields=["is_archived", "archived_at"])

    def reminder_targets_for_today(self):
        reminder_targets = []

        patient_profile = getattr(self.patient, "telegram_profile", None)
        if patient_profile and patient_profile.notifications_enabled and not self.patient_day_reminder_sent_at:
            reminder_targets.append(("patient", patient_profile))

        doctor_user = getattr(self.doctor, "user", None)
        doctor_profile = getattr(doctor_user, "telegram_profile", None) if doctor_user else None
        if doctor_profile and doctor_profile.notifications_enabled and not self.doctor_day_reminder_sent_at:
            reminder_targets.append(("doctor", doctor_profile))

        return reminder_targets

    def clear_day_reminder_marks(self):
        self.patient_day_reminder_sent_at = None
        self.doctor_day_reminder_sent_at = None

    def save(self, *args, **kwargs):
        if self.pk:
            previous = Appointment.objects.filter(pk=self.pk).only(
                "scheduled_at",
                "patient_id",
                "doctor_id",
                "status",
                "is_deleted",
                "is_archived",
            ).first()

            if previous and (
                previous.scheduled_at != self.scheduled_at
                or previous.patient_id != self.patient_id
                or previous.doctor_id != self.doctor_id
                or previous.status != self.status
                or previous.is_deleted != self.is_deleted
                or previous.is_archived != self.is_archived
            ):
                self.clear_day_reminder_marks()

        super().save(*args, **kwargs)

    def clean(self):
        super().clean()

        if self.scheduled_at and self.doctor_id:
            duration_minutes = self.duration_minutes or self.doctor.slot_duration_minutes
            self.doctor.validate_appointment_time(
                self.scheduled_at,
                duration_minutes=duration_minutes,
                appointment_id=self.pk,
            )

    def __str__(self):
        return f"{self.patient.username} -> {self.doctor.user.username} at {self.scheduled_at}"


class AIChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ai_sessions")
    started_at = models.DateTimeField(auto_now_add=True)
    history = models.JSONField(default=list)

    def add_message(self, role: str, content: str):
        self.history = (self.history or []) + [{"role": role, "content": content}]
        self.history = self.history[-40:]
        self.save(update_fields=["history"])

    def clear(self):
        self.history = []
        self.save(update_fields=["history"])

    def __str__(self):
        return f"{self.user.email} | {self.started_at:%d.%m.%Y}"


class TelegramProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="telegram_profile")
    chat_id = models.BigIntegerField(unique=True)
    telegram_username = models.CharField(max_length=150, blank=True)
    telegram_first_name = models.CharField(max_length=150, blank=True)
    language_code = models.CharField(max_length=16, blank=True)
    notifications_enabled = models.BooleanField(default=True)
    linked_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} -> {self.chat_id}"


class TelegramLinkCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="telegram_link_codes")
    code = models.CharField(max_length=12, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    used_at = models.DateTimeField(blank=True, null=True)

    @classmethod
    def create_for_user(cls, user, lifetime_minutes=15):
        cls.objects.filter(user=user, is_used=False).delete()

        alphabet = string.ascii_uppercase + string.digits
        code = "".join(secrets.choice(alphabet) for _ in range(8))

        while cls.objects.filter(code=code).exists():
            code = "".join(secrets.choice(alphabet) for _ in range(8))

        return cls.objects.create(
            user=user,
            code=code,
            expires_at=timezone.now() + timedelta(minutes=lifetime_minutes),
        )

    @property
    def is_active(self):
        return not self.is_used and timezone.now() <= self.expires_at

    def mark_used(self):
        self.is_used = True
        self.used_at = timezone.now()
        self.save(update_fields=["is_used", "used_at"])

    def __str__(self):
        return f"{self.user.username} | {self.code}"
