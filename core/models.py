import secrets
from datetime import timedelta

from django.contrib.auth.models import AbstractUser
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

    @property
    def display_name(self):
        return f"Dr. {self.user.display_name}"

    def can_be_managed_by(self, user):
        if not getattr(user, "is_authenticated", False):
            return False
        return user.is_superuser or self.user_id == user.id

    def __str__(self):
        return f"{self.display_name} - {self.specialization}"


class AppointmentQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_deleted=False)

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
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

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
