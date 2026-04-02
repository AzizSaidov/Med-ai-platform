from datetime import datetime, timedelta

from django import forms
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.utils import timezone

from .models import Appointment, DoctorProfile, User


class AppointmentScheduleMixin:
    def __init__(self, *args, doctor=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.doctor = doctor or getattr(self.instance, "doctor", None)

        self.fields["appointment_date"] = forms.DateField(
            label="Appointment date",
            widget=forms.DateInput(
                attrs={
                    "type": "date",
                    "class": "form-control",
                }
            ),
        )
        self.fields["appointment_time"] = forms.ChoiceField(
            label="Time slot",
            choices=[],
            widget=forms.Select(attrs={"class": "form-select booking-time-select"}),
        )

        self.order_fields(["appointment_date", "appointment_time", "notes", "status"])

        self.fields["appointment_time"].choices = self.get_time_choices()

        if self.doctor:
            self.fields["appointment_date"].widget.attrs["min"] = timezone.localdate().isoformat()
            self.fields["appointment_date"].help_text = "Pick a day first, then choose one of the available time slots."
            self.fields["appointment_time"].help_text = (
                f"Available {self.doctor.get_available_days_display()} | "
                f"{self.doctor.workday_start:%H:%M} - {self.doctor.workday_end:%H:%M} | "
                f"{self.doctor.slot_duration_minutes}-minute slots."
            )

        if getattr(self.instance, "scheduled_at", None):
            local_dt = timezone.localtime(self.instance.scheduled_at, timezone.get_current_timezone())
            self.initial.setdefault("appointment_date", local_dt.date())
            self.initial.setdefault("appointment_time", local_dt.strftime("%H:%M"))

    def get_time_choices(self):
        if not self.doctor:
            return [("", "Select a time slot")]

        choices = [("", "Select a time slot")]
        for slot in self.doctor.build_daily_slots():
            slot_end = datetime.combine(timezone.localdate(), slot) + timedelta(minutes=self.doctor.slot_duration_minutes)
            choices.append((slot.strftime("%H:%M"), f"{slot.strftime('%H:%M')} - {slot_end.strftime('%H:%M')}"))
        return choices

    def clean(self):
        cleaned_data = super().clean()
        appointment_date = cleaned_data.get("appointment_date")
        appointment_time = cleaned_data.get("appointment_time")

        if not appointment_date or not appointment_time:
            return cleaned_data

        try:
            selected_time = datetime.strptime(appointment_time, "%H:%M").time()
        except ValueError:
            self.add_error("appointment_time", "Choose a valid appointment time.")
            return cleaned_data

        scheduled_at = timezone.make_aware(
            datetime.combine(appointment_date, selected_time),
            timezone.get_current_timezone(),
        )
        duration_minutes = self.doctor.slot_duration_minutes if self.doctor else getattr(self.instance, "duration_minutes", 30)

        cleaned_data["scheduled_at"] = scheduled_at
        cleaned_data["duration_minutes"] = duration_minutes

        if scheduled_at <= timezone.now():
            self.add_error("appointment_time", "Please choose a future time slot.")
            return cleaned_data

        if scheduled_at and self.doctor:
            try:
                self.doctor.validate_appointment_time(
                    scheduled_at,
                    duration_minutes=duration_minutes,
                    appointment_id=getattr(self.instance, "pk", None),
                )
            except ValidationError as exc:
                for message in exc.messages:
                    self.add_error("appointment_time", message)

        return cleaned_data

    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.scheduled_at = self.cleaned_data["scheduled_at"]
        instance.duration_minutes = self.cleaned_data["duration_minutes"]
        if commit:
            instance.save()
        return instance


class RegisterForm(forms.ModelForm):
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={"placeholder": "Enter password"}),
        label="Password",
    )
    password_confirm = forms.CharField(
        widget=forms.PasswordInput(attrs={"placeholder": "Confirm password"}),
        label="Confirm Password",
    )

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "username",
            "email",
            "phone",
            "avatar",
            "password",
        ]
        labels = {
            "first_name": "First name",
            "last_name": "Last name",
            "username": "Username",
            "email": "Email",
            "phone": "Phone",
            "avatar": "Avatar",
        }
        widgets = {
            "first_name": forms.TextInput(attrs={"placeholder": "Enter your first name"}),
            "last_name": forms.TextInput(attrs={"placeholder": "Enter your last name"}),
            "username": forms.TextInput(attrs={"placeholder": "Enter your username"}),
            "email": forms.EmailInput(attrs={"placeholder": "Enter your email"}),
            "phone": forms.TextInput(attrs={"placeholder": "Enter your phone number"}),
        }

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        password_confirm = cleaned_data.get("password_confirm")

        if password and password_confirm and password != password_confirm:
            raise forms.ValidationError("Passwords do not match.")

        return cleaned_data

    def clean_email(self):
        email = (self.cleaned_data.get("email") or "").strip()
        if not email:
            raise forms.ValidationError("Email is required.")
        return email


class LoginForm(forms.Form):
    username = forms.CharField(
        label="Username",
        widget=forms.TextInput(attrs={"placeholder": "Enter your username"}),
    )
    password = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(attrs={"placeholder": "Enter your password"}),
    )

    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get("username")
        password = cleaned_data.get("password")

        if username and password:
            user = authenticate(username=username, password=password)

            if not user:
                raise forms.ValidationError("Invalid username or password.")

            cleaned_data["user"] = user

        return cleaned_data


class AppointmentForm(AppointmentScheduleMixin, forms.ModelForm):
    class Meta:
        model = Appointment
        fields = ["notes"]
        widgets = {
            "notes": forms.Textarea(
                attrs={
                    "rows": 4,
                    "class": "form-control",
                    "placeholder": "Describe symptoms, goals for the visit, or any extra details...",
                }
            ),
        }


class AppointmentUpdateForm(AppointmentScheduleMixin, forms.ModelForm):
    class Meta:
        model = Appointment
        fields = ["notes", "status"]
        widgets = {
            "notes": forms.Textarea(
                attrs={
                    "rows": 4,
                    "class": "form-control",
                    "placeholder": "Update appointment notes...",
                }
            ),
            "status": forms.Select(
                attrs={
                    "class": "form-select",
                }
            ),
        }


class DoctorProfileForm(forms.ModelForm):
    available_days = forms.MultipleChoiceField(
        choices=DoctorProfile.WEEKDAY_CHOICES,
        widget=forms.CheckboxSelectMultiple,
        required=True,
        label="Available days",
    )

    class Meta:
        model = DoctorProfile
        fields = [
            "specialization",
            "experience",
            "consultation_fee",
            "rating",
            "status",
            "phone",
            "address",
            "latitude",
            "longitude",
            "available_days",
            "workday_start",
            "workday_end",
            "slot_duration_minutes",
            "bio",
            "photo",
        ]
        widgets = {
            "specialization": forms.TextInput(attrs={"class": "form-control"}),
            "experience": forms.NumberInput(attrs={"class": "form-control"}),
            "consultation_fee": forms.NumberInput(attrs={"class": "form-control"}),
            "rating": forms.NumberInput(attrs={"class": "form-control", "step": "0.1"}),
            "status": forms.Select(attrs={"class": "form-select"}),
            "phone": forms.TextInput(attrs={"class": "form-control"}),
            "address": forms.TextInput(attrs={"class": "form-control"}),
            "latitude": forms.NumberInput(attrs={"class": "form-control", "step": "any"}),
            "longitude": forms.NumberInput(attrs={"class": "form-control", "step": "any"}),
            "workday_start": forms.TimeInput(attrs={"class": "form-control", "type": "time"}),
            "workday_end": forms.TimeInput(attrs={"class": "form-control", "type": "time"}),
            "slot_duration_minutes": forms.NumberInput(attrs={"class": "form-control", "min": 5, "step": 5}),
            "bio": forms.Textarea(attrs={"class": "form-control", "rows": 4}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        available_days = self.instance.get_available_day_indexes() if self.instance and self.instance.pk else [0, 1, 2, 3, 4]
        self.initial["available_days"] = [str(day) for day in available_days]
        self.fields["available_days"].help_text = "Choose the weekdays when patients can book appointments."
        self.fields["slot_duration_minutes"].help_text = "Examples: 15, 20, 30, or 60 minutes."

    def clean(self):
        cleaned_data = super().clean()
        latitude = cleaned_data.get("latitude")
        longitude = cleaned_data.get("longitude")
        rating = cleaned_data.get("rating")
        consultation_fee = cleaned_data.get("consultation_fee")
        available_days = cleaned_data.get("available_days") or []
        workday_start = cleaned_data.get("workday_start")
        workday_end = cleaned_data.get("workday_end")
        slot_duration_minutes = cleaned_data.get("slot_duration_minutes")

        if (latitude is None) ^ (longitude is None):
            raise forms.ValidationError("Please provide both latitude and longitude for map placement.")

        if rating is not None and not 0 <= rating <= 5:
            self.add_error("rating", "Rating must be between 0 and 5.")

        if consultation_fee is not None and consultation_fee < 0:
            self.add_error("consultation_fee", "Consultation fee cannot be negative.")

        if not available_days:
            self.add_error("available_days", "Select at least one available day.")

        if workday_start and workday_end and workday_start >= workday_end:
            self.add_error("workday_end", "Working hours end must be later than the start time.")

        if slot_duration_minutes is not None and slot_duration_minutes < 5:
            self.add_error("slot_duration_minutes", "Slot duration must be at least 5 minutes.")

        cleaned_data["available_days"] = ",".join(available_days)

        return cleaned_data


class AIMessageForm(forms.Form):
    message = forms.CharField(
        label="Message",
        max_length=2000,
        widget=forms.Textarea(
            attrs={
                "rows": 4,
                "class": "form-control",
                "placeholder": "Ask about symptoms, preparing for a visit, or general care guidance...",
            }
        ),
    )
