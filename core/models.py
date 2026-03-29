from django.db import models
from django.contrib.auth.models import AbstractUser

from datetime import timedelta
import secrets
from django.utils import timezone



class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)

    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=120, blank=True, default='')
    email_verification_sent_at = models.DateTimeField(blank=True, null=True)

    @property
    def is_doctor(self):
        return self.groups.filter(name="doctor").exists()

    @property
    def is_patient(self):
        return self.groups.filter(name="patient").exists()

    def generate_email_verification_token(self):
        self.email_verification_token = secrets.token_urlsafe(32)
        self.email_verification_sent_at = timezone.now()
        self.save(update_fields=['email_verification_token', 'email_verification_sent_at'])
        return self.email_verification_token

    def email_verification_token_is_valid(self):
        if not self.email_verification_token or not self.email_verification_sent_at:
            return False
        return timezone.now() <= self.email_verification_sent_at + timedelta(hours=24)

    def confirm_email(self):
        self.is_email_verified = True
        self.is_active = True
        self.email_verification_token = ''
        self.email_verification_sent_at = None
        self.save(update_fields=[
            'is_email_verified',
            'is_active',
            'email_verification_token',
            'email_verification_sent_at',
        ])

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

    def __str__(self):
        full_name = self.user.get_full_name().strip()
        return f"Dr. {full_name or self.user.email} · {self.specialization}"






class Appointment(models.Model):
    class Status(models.TextChoices):
        SCHEDULED = "scheduled", "Scheduled"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="appointments")
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name="appointments")
    scheduled_at = models.DateTimeField(verbose_name="Date and Time")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["scheduled_at"]

    def __str__(self):
        return f"{self.patient} → {self.doctor} | {self.scheduled_at:%d.%m.%Y %H:%M}"





class AIChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ai_sessions")
    started_at = models.DateTimeField(auto_now_add=True)
    history = models.JSONField(default=list)

    def add_message(self, role: str, content: str):
        self.history.append({"role": role, "content": content})
        self.save(update_fields=["history"])

    def __str__(self):
        return f"{self.user.email} | {self.started_at:%d.%m.%Y}"
    