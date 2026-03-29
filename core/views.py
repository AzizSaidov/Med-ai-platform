from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
from django.contrib import messages
from django.conf import settings
from django.core.mail import send_mail
from django.urls import reverse

from .forms import RegisterForm, LoginForm
from .models import DoctorProfile, Appointment, AIChatSession, User




def send_confirmation_email(request, user):
    token = user.generate_email_verification_token()
    confirm_url = request.build_absolute_uri(
        reverse('confirm_email', args=[token])
    )

    send_mail(
        subject='Confirm your MedTech account',
        message=(
            f'Hello, {user.username}!\n\n'
            f'Please confirm your email by opening this link:\n{confirm_url}\n\n'
            f'This link is valid for 24 hours.'
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.is_active = False
            user.is_email_verified = False
            user.save()

            patient_group = Group.objects.get(name='patient')
            user.groups.add(patient_group)

            send_confirmation_email(request, user)
            messages.success(request, 'Check your email to verify your account.')
            return redirect('email_confirmation_sent')
    else:
        form = RegisterForm()

    return render(request, 'register.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data['user']

            if not user.is_email_verified:
                messages.error(request, 'Please verify your email before logging in.')
                return redirect('login')

            login(request, user)
            return redirect('dashboard')
    else:
        form = LoginForm()

    return render(request, 'login.html', {'form': form})


def confirm_email(request, token):
    user = User.objects.filter(email_verification_token=token).first()

    if not user:
        messages.error(request, 'Invalid verification link.')
        return redirect('login')

    if not user.email_verification_token_is_valid():
        messages.error(request, 'Verification link expired. Please register again or request a new link.')
        return redirect('login')

    user.confirm_email()
    messages.success(request, 'Email verified successfully. You can now log in.')
    return redirect('login')


def email_confirmation_sent(request):
    return render(request, 'email_confirmation_sent.html')


def logout_view(request):
    logout(request)
    return redirect('login')


@login_required
def dashboard(request):
    user = request.user

    if user.is_doctor:
        profile = getattr(user, 'doctor_profile', None)

        if profile:
            appointments = Appointment.objects.filter(doctor=profile)
        else:
            appointments = Appointment.objects.none()
            messages.warning(request, 'Doctor profile has not been created yet.')
    else:
        appointments = Appointment.objects.filter(patient=user)

    return render(request, 'dashboard.html', {
        'appointments': appointments
    })

@login_required
def doctors_map(request):
    doctors = DoctorProfile.objects.all()

    doctors_data = [
        {
            "id": d.id,
            "name": d.user.email,
            "lat": d.latitude,
            "lng": d.longitude,
            "specialization": d.specialization,
        }
        for d in doctors
    ]

    return render(request, 'doctors.html', {
        'doctors': doctors,
        'doctors_json': doctors_data,
        'GOOGLE_MAPS_API_KEY': settings.GOOGLE_MAPS_API_KEY
    })


@login_required
def ai_chat(request):
    session, _ = AIChatSession.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        message = request.POST.get('message')

        session.add_message('user', message)
        ai_response = "AI response placeholder"
        session.add_message('assistant', ai_response)

        return render(request, 'ai_chat.html', {
            'messages': session.history
        })

    return render(request, 'ai_chat.html', {
        'messages': session.history
    })


@login_required
def book_appointment(request, doctor_id):
    doctor = get_object_or_404(DoctorProfile, id=doctor_id)

    if request.method == 'POST':
        Appointment.objects.create(
            patient=request.user,
            doctor=doctor,
            scheduled_at=request.POST.get('scheduled_at'),
            notes=request.POST.get('notes')
        )
        return redirect('dashboard')

    return render(request, 'book.html', {
        'doctor': doctor
    })