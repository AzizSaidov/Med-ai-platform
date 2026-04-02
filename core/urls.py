from django.urls import path
from django.contrib.auth import views as auth_views
from .views import (
    AppointmentDeleteView,
    AppointmentDetailView,
    AppointmentListView,
    AppointmentUpdateView,
    DoctorCreateView,
    DoctorDeleteView,
    DoctorDetailView,
    DoctorListView,
    DoctorUpdateView,
    ai_chat,
    about_page,
    book_appointment,
    confirm_email,
    dashboard,
    doctors_map,
    email_confirmation_sent,
    login_view,
    logout_view,
    my_doctor_profile,
    register,
    telegram_bot_redirect,
    telegram_connect,
)


urlpatterns = [
    path('', dashboard, name='dashboard'),

    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),

    path('confirm-email/<str:token>/', confirm_email, name='confirm_email'),
    path('email-confirmation-sent/', email_confirmation_sent, name='email_confirmation_sent'),

    path('doctors/', doctors_map, name='doctors_map'),
    path('about/', about_page, name='about'),
    path('chat/', ai_chat, name='ai_chat'),
    path('telegram/', telegram_bot_redirect, name='telegram_bot'),
    path('telegram/connect/', telegram_connect, name='telegram_connect'),
    path('book/<int:doctor_id>/', book_appointment, name='book_appointment'),
    path('doctor-profile/me/', my_doctor_profile, name='my_doctor_profile'),

    path('appointments/', AppointmentListView.as_view(), name='appointments'),
    path('appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointment_detail'),
    path('appointments/<int:pk>/edit/', AppointmentUpdateView.as_view(), name='appointment_edit'),
    path('appointments/<int:pk>/delete/', AppointmentDeleteView.as_view(), name='appointment_delete'),
    
    path('password-reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password-reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),


    path('doctor-profiles/', DoctorListView.as_view(), name='doctor_list'),
    path('doctor-profiles/<int:pk>/', DoctorDetailView.as_view(), name='doctor_detail'),
    path('doctor-profiles/create/', DoctorCreateView.as_view(), name='doctor_create'),
    path('doctor-profiles/<int:pk>/edit/', DoctorUpdateView.as_view(), name='doctor_edit'),
    path('doctor-profiles/<int:pk>/delete/', DoctorDeleteView.as_view(), name='doctor_delete'),
]
