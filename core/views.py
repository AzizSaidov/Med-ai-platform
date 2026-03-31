from django.conf import settings
from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.models import Group
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse, reverse_lazy
from django.utils import timezone
from django.views.generic import CreateView, DeleteView, DetailView, ListView, UpdateView

from .ai import AIConfigurationError, AIServiceError, generate_ai_reply, get_available_ai_providers
from .filters import DoctorFilter
from .forms import (
    AIMessageForm,
    AppointmentForm,
    AppointmentUpdateForm,
    DoctorProfileForm,
    LoginForm,
    RegisterForm,
)
from .models import AIChatSession, Appointment, DoctorProfile, User


def get_doctor_profile_for_user(user):
    if not getattr(user, "is_authenticated", False):
        return None

    return DoctorProfile.objects.select_related("user").filter(user=user).first()


def get_user_appointments(user):
    if not getattr(user, "is_authenticated", False):
        return Appointment.objects.none()

    appointments = Appointment.objects.with_related().active().filter(patient=user)
    doctor_profile = get_doctor_profile_for_user(user)
    if doctor_profile:
        appointments = (appointments | Appointment.objects.with_related().active().filter(doctor=doctor_profile)).distinct()

    return appointments.order_by("-scheduled_at")


def user_can_access_doctor_management(user):
    return getattr(user, "is_authenticated", False) and (user.is_superuser or user.is_doctor)


def user_can_book_appointments(user):
    return getattr(user, "is_authenticated", False) and (user.is_superuser or user.is_patient)


def user_can_view_appointment(user, appointment):
    return (
        getattr(user, "is_authenticated", False)
        and (
            user.is_superuser
            or appointment.patient_id == user.id
            or appointment.doctor.user_id == user.id
        )
    )


def user_can_edit_appointment(user, appointment):
    return getattr(user, "is_authenticated", False) and (
        user.is_superuser or appointment.doctor.user_id == user.id
    )


def user_can_cancel_appointment(user, appointment):
    return user_can_view_appointment(user, appointment)


def user_can_manage_doctor_profile(user, doctor_profile):
    return getattr(user, "is_authenticated", False) and (
        user.is_superuser or doctor_profile.user_id == user.id
    )


def send_confirmation_email(request, user):
    token = user.generate_email_verification_token()
    confirm_url = request.build_absolute_uri(reverse("confirm_email", args=[token]))

    send_mail(
        subject="Confirm your MedTech account",
        message=(
            f"Hello, {user.username}!\n\n"
            f"Please confirm your email by opening this link:\n{confirm_url}\n\n"
            f"This link is valid for 24 hours."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data["password"])
            user.is_active = False
            user.is_email_verified = False
            user.save()

            patient_group, _ = Group.objects.get_or_create(name="patient")
            user.groups.add(patient_group)

            send_confirmation_email(request, user)
            messages.success(request, "Check your email to verify your account.")
            return redirect("email_confirmation_sent")
    else:
        form = RegisterForm()

    return render(request, "register.html", {"form": form})


def login_view(request):
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data["user"]

            if not user.is_email_verified:
                messages.error(request, "Please verify your email before logging in.")
                return redirect("login")

            login(request, user)
            return redirect("dashboard")
    else:
        form = LoginForm()

    return render(request, "login.html", {"form": form})


def confirm_email(request, token):
    user = User.objects.filter(email_verification_token=token).first()

    if not user:
        messages.error(request, "Invalid verification link.")
        return redirect("login")

    if not user.email_verification_token_is_valid():
        messages.error(request, "Verification link expired. Please register again or request a new link.")
        return redirect("login")

    user.confirm_email()
    messages.success(request, "Email verified successfully. You can now log in.")
    return redirect("login")


def email_confirmation_sent(request):
    return render(request, "email_confirmation_sent.html")


def logout_view(request):
    logout(request)
    return redirect("login")


@login_required
def dashboard(request):
    appointment_queryset = get_user_appointments(request.user)
    appointments = list(appointment_queryset[:4])
    upcoming_count = sum(1 for appointment in appointment_queryset if appointment.is_upcoming)

    return render(
        request,
        "dashboard.html",
        {
            "appointments": appointments,
            "upcoming_count": upcoming_count,
            "doctor_profile": get_doctor_profile_for_user(request.user),
        },
    )


@login_required
def doctors_map(request):
    doctors = (
        DoctorProfile.objects.select_related("user")
        .exclude(latitude__isnull=True)
        .exclude(longitude__isnull=True)
    )

    doctor_filter = DoctorFilter(request.GET, queryset=doctors)
    filtered_doctors = doctor_filter.qs

    doctors_data = [
        {
            "id": doctor.id,
            "name": doctor.user.display_name,
            "email": doctor.user.email,
            "lat": float(doctor.latitude),
            "lng": float(doctor.longitude),
            "specialization": doctor.specialization,
            "address": doctor.address or "Address not specified",
            "rating": float(doctor.rating),
            "status": doctor.status,
            "experience": doctor.experience,
            "phone": doctor.phone or "",
            "bio": doctor.bio or "",
            "consultation_fee": float(doctor.consultation_fee) if doctor.consultation_fee else None,
            "photo": doctor.photo.url if doctor.photo else "",
            "book_url": reverse("book_appointment", args=[doctor.id]) if user_can_book_appointments(request.user) else "",
            "detail_url": reverse("doctor_detail", args=[doctor.id]) if user_can_manage_doctor_profile(request.user, doctor) else "",
            "is_owner": doctor.user_id == request.user.id,
        }
        for doctor in filtered_doctors
    ]

    return render(
        request,
        "doctors.html",
        {
            "doctors_json": doctors_data,
            "doctors_count": len(doctors_data),
            "doctor_profile": get_doctor_profile_for_user(request.user),
        },
    )


@login_required
def ai_chat(request):
    session = AIChatSession.objects.filter(user=request.user).order_by("started_at").first()
    if session is None:
        session = AIChatSession.objects.create(user=request.user)

    if request.method == "POST" and request.POST.get("action") == "clear":
        session.clear()
        messages.success(request, "AI conversation cleared.")
        return redirect("ai_chat")

    form = AIMessageForm(request.POST or None)

    if request.method == "POST" and form.is_valid():
        session.add_message("user", form.cleaned_data["message"])

        try:
            reply, provider_name = generate_ai_reply(session)
            provider_label = {
                "openai": "OpenAI",
                "xai": "Grok",
                "gemini": "Gemini",
            }.get(provider_name, provider_name)
            messages.success(request, f"Reply generated via {provider_label}.")
        except AIConfigurationError:
            reply = "AI assistant is temporarily unavailable. Please try again in a moment."
            messages.warning(request, reply)
        except AIServiceError:
            reply = "I can help only with health-related questions. Please ask about symptoms, wellness, appointments, or preparing for a doctor visit."
            messages.error(request, reply)

        session.add_message("assistant", reply)
        return redirect("ai_chat")

    return render(
        request,
        "ai_chat.html",
        {
            "form": form,
            "chat_messages": session.history,
            "session": session,
            "available_ai_providers": get_available_ai_providers(),
        },
    )


@login_required
def book_appointment(request, doctor_id):
    doctor = get_object_or_404(DoctorProfile.objects.select_related("user"), id=doctor_id)

    if not user_can_book_appointments(request.user):
        messages.error(request, "Only patients and administrators can book appointments.")
        return redirect("dashboard")

    if doctor.user_id == request.user.id and not request.user.is_superuser:
        messages.error(request, "You cannot book an appointment with your own doctor profile.")
        return redirect("doctors_map")

    if request.method == "POST":
        form = AppointmentForm(request.POST)
        if form.is_valid():
            appointment = form.save(commit=False)
            appointment.patient = request.user
            appointment.doctor = doctor
            appointment.save()

            messages.success(request, "Appointment booked successfully.")
            return redirect("appointments")
    else:
        form = AppointmentForm()

    return render(
        request,
        "book.html",
        {
            "doctor": doctor,
            "form": form,
        },
    )


@login_required
def my_doctor_profile(request):
    if not user_can_access_doctor_management(request.user):
        messages.error(request, "Doctor profile tools are available only for doctors and administrators.")
        return redirect("dashboard")

    doctor_profile = get_doctor_profile_for_user(request.user)
    if doctor_profile:
        return redirect("doctor_detail", pk=doctor_profile.pk)

    messages.info(request, "Create your doctor profile to start managing appointments and visibility.")
    return redirect("doctor_create")


class AccessRedirectMixin(LoginRequiredMixin, UserPassesTestMixin):
    permission_message = "You do not have access to this page."
    permission_redirect = "dashboard"

    def handle_no_permission(self):
        if not self.request.user.is_authenticated:
            return super().handle_no_permission()

        messages.error(self.request, self.permission_message)
        return redirect(self.permission_redirect)


class AppointmentObjectMixin:
    queryset = Appointment.objects.with_related().active()


class AppointmentViewAccessMixin(AccessRedirectMixin, AppointmentObjectMixin):
    permission_message = "You can only view appointments related to your account."
    permission_redirect = "appointments"

    def test_func(self):
        return user_can_view_appointment(self.request.user, self.get_object())


class AppointmentEditAccessMixin(AccessRedirectMixin, AppointmentObjectMixin):
    permission_message = "Only the assigned doctor or an administrator can edit this appointment."
    permission_redirect = "appointments"

    def test_func(self):
        return user_can_edit_appointment(self.request.user, self.get_object())


class AppointmentCancelAccessMixin(AccessRedirectMixin, AppointmentObjectMixin):
    permission_message = "You can only cancel appointments related to your account."
    permission_redirect = "appointments"

    def test_func(self):
        return user_can_cancel_appointment(self.request.user, self.get_object())


class DoctorManagementAccessMixin(AccessRedirectMixin):
    permission_message = "Doctor profile management is available only for doctors and administrators."
    permission_redirect = "dashboard"

    def test_func(self):
        return user_can_access_doctor_management(self.request.user)


class DoctorProfileAccessMixin(DoctorManagementAccessMixin):
    queryset = DoctorProfile.objects.select_related("user")
    permission_message = "You can only manage your own doctor profile unless you are an administrator."
    permission_redirect = "doctor_list"

    def test_func(self):
        return user_can_manage_doctor_profile(self.request.user, self.get_object())


class AppointmentListView(LoginRequiredMixin, ListView):
    model = Appointment
    template_name = "appointments.html"
    context_object_name = "appointments"

    def get_queryset(self):
        return get_user_appointments(self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        appointments = list(context["appointments"])
        context["total_appointments"] = len(appointments)
        context["upcoming_appointments"] = sum(1 for appointment in appointments if appointment.is_upcoming)
        context["doctor_profile"] = get_doctor_profile_for_user(self.request.user)
        return context


class AppointmentDetailView(AppointmentViewAccessMixin, DetailView):
    template_name = "appointment_detail.html"
    context_object_name = "appointment"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        appointment = context["appointment"]
        context["can_edit_appointment"] = user_can_edit_appointment(self.request.user, appointment)
        context["can_cancel_appointment"] = user_can_cancel_appointment(self.request.user, appointment)
        return context


class AppointmentUpdateView(AppointmentEditAccessMixin, UpdateView):
    form_class = AppointmentUpdateForm
    template_name = "appointment_form.html"

    def form_valid(self, form):
        messages.success(self.request, "Appointment updated successfully.")
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy("appointment_detail", kwargs={"pk": self.object.pk})


class AppointmentDeleteView(AppointmentCancelAccessMixin, DeleteView):
    template_name = "appointment_confirm_delete.html"
    success_url = reverse_lazy("appointments")

    def form_valid(self, form):
        appointment = self.get_object()
        appointment.is_deleted = True
        appointment.deleted_at = timezone.now()
        appointment.status = "cancelled"
        appointment.save(update_fields=["is_deleted", "deleted_at", "status"])

        messages.success(self.request, "Appointment cancelled successfully.")
        return redirect(self.success_url)


class DoctorListView(DoctorManagementAccessMixin, ListView):
    model = DoctorProfile
    template_name = "doctor_list.html"
    context_object_name = "doctors"

    def get_queryset(self):
        queryset = DoctorProfile.objects.select_related("user").order_by("user__first_name", "user__username")
        if self.request.user.is_superuser:
            return queryset
        return queryset.filter(user=self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        doctor_profile = get_doctor_profile_for_user(self.request.user)
        context["doctor_profile"] = doctor_profile
        context["can_create_doctor_profile"] = self.request.user.is_superuser or doctor_profile is None
        return context


class DoctorDetailView(DoctorProfileAccessMixin, DetailView):
    template_name = "doctor_detail.html"
    context_object_name = "doctor"


class DoctorCreateView(DoctorManagementAccessMixin, CreateView):
    model = DoctorProfile
    form_class = DoctorProfileForm
    template_name = "doctor_form.html"

    def dispatch(self, request, *args, **kwargs):
        existing_profile = get_doctor_profile_for_user(request.user)

        if existing_profile:
            messages.warning(request, "You already have a doctor profile.")
            return redirect("doctor_detail", pk=existing_profile.pk)

        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        form.instance.user = self.request.user
        messages.success(self.request, "Doctor profile created successfully.")
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy("doctor_detail", kwargs={"pk": self.object.pk})


class DoctorUpdateView(DoctorProfileAccessMixin, UpdateView):
    form_class = DoctorProfileForm
    template_name = "doctor_form.html"

    def form_valid(self, form):
        messages.success(self.request, "Doctor profile updated successfully.")
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy("doctor_detail", kwargs={"pk": self.object.pk})


class DoctorDeleteView(DoctorProfileAccessMixin, DeleteView):
    template_name = "doctor_confirm_delete.html"
    success_url = reverse_lazy("doctor_list")

    def form_valid(self, form):
        messages.success(self.request, "Doctor profile deleted successfully.")
        return super().form_valid(form)
