from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings

from .models import User, AIChatSession, Appointment


@receiver(post_save, sender=User)
def create_ai_chat_session(sender, instance, created, **kwargs):
    if created and not AIChatSession.objects.filter(user=instance).exists():
        AIChatSession.objects.create(user=instance)


@receiver(post_save, sender=Appointment)
def send_appointment_created_email(sender, instance, created, **kwargs):
    if created and instance.patient.email:
        doctor_name = instance.doctor.user.get_full_name() or instance.doctor.user.username

        send_mail(
            subject='Your MedTech appointment is confirmed',
            message=(
                f'Hello, {instance.patient.username}!\n\n'
                f'Your appointment with Dr. {doctor_name} has been created successfully.\n'
                f'Date and time: {instance.scheduled_at}\n'
                f'Status: {instance.status}\n\n'
                f'Thank you for using MedTech.'
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[instance.patient.email],
            fail_silently=True,
        )
