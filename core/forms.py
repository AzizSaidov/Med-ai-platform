from django import forms
from django.contrib.auth import authenticate
from django.utils import timezone

from .models import Appointment, DoctorProfile, User


class FutureAppointmentMixin:
    def clean_scheduled_at(self):
        scheduled_at = self.cleaned_data["scheduled_at"]
        if timezone.is_naive(scheduled_at):
            scheduled_at = timezone.make_aware(scheduled_at, timezone.get_current_timezone())

        if scheduled_at <= timezone.now():
            raise forms.ValidationError("Please choose a future date and time.")

        return scheduled_at


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


class AppointmentForm(FutureAppointmentMixin, forms.ModelForm):
    scheduled_at = forms.DateTimeField(
        widget=forms.DateTimeInput(
            attrs={
                "type": "datetime-local",
                "class": "form-control",
            }
        ),
        input_formats=["%Y-%m-%dT%H:%M"],
    )

    class Meta:
        model = Appointment
        fields = ["scheduled_at", "notes"]
        widgets = {
            "notes": forms.Textarea(
                attrs={
                    "rows": 4,
                    "class": "form-control",
                    "placeholder": "Describe symptoms, goals for the visit, or any extra details...",
                }
            ),
        }


class AppointmentUpdateForm(FutureAppointmentMixin, forms.ModelForm):
    scheduled_at = forms.DateTimeField(
        widget=forms.DateTimeInput(
            attrs={
                "type": "datetime-local",
                "class": "form-control",
            }
        ),
        input_formats=["%Y-%m-%dT%H:%M"],
    )

    class Meta:
        model = Appointment
        fields = ["scheduled_at", "notes", "status"]
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
            "bio": forms.Textarea(attrs={"class": "form-control", "rows": 4}),
        }

    def clean(self):
        cleaned_data = super().clean()
        latitude = cleaned_data.get("latitude")
        longitude = cleaned_data.get("longitude")
        rating = cleaned_data.get("rating")
        consultation_fee = cleaned_data.get("consultation_fee")

        if (latitude is None) ^ (longitude is None):
            raise forms.ValidationError("Please provide both latitude and longitude for map placement.")

        if rating is not None and not 0 <= rating <= 5:
            self.add_error("rating", "Rating must be between 0 and 5.")

        if consultation_fee is not None and consultation_fee < 0:
            self.add_error("consultation_fee", "Consultation fee cannot be negative.")

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
