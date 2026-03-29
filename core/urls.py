from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),

    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    path('confirm-email/<str:token>/', views.confirm_email, name='confirm_email'),
    path('email-confirmation-sent/', views.email_confirmation_sent, name='email_confirmation_sent'),

    path('doctors/', views.doctors_map, name='doctors_map'),
    path('chat/', views.ai_chat, name='ai_chat'),
    path('book/<int:doctor_id>/', views.book_appointment, name='book_appointment'),
]
