from decimal import Decimal
from datetime import time

from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand

from core.models import DoctorProfile, User


CLINIC_DOCTORS = [
    {
        "username": "dr_safarzoda",
        "email": "safarzoda@medtech.demo",
        "first_name": "Faridun",
        "last_name": "Safarzoda",
        "specialization": "Cardiologist",
        "experience": 11,
        "rating": Decimal("4.9"),
        "status": DoctorProfile.Status.ONLINE,
        "latitude": Decimal("38.581235"),
        "longitude": Decimal("68.782653"),
        "address": "Avicenna International Clinic, Foteh Niyozi Street 34, Dushanbe",
        "phone": "+992 44 640 01 02",
        "bio": "Demo doctor profile placed at the real Avicenna International Clinic location in Dushanbe.",
        "consultation_fee": Decimal("220.00"),
        "available_days": "0,1,2,3,4,5",
        "workday_start": time(8, 30),
        "workday_end": time(16, 30),
        "slot_duration_minutes": 30,
    },
    {
        "username": "dr_nazarova",
        "email": "nazarova@medtech.demo",
        "first_name": "Madina",
        "last_name": "Nazarova",
        "specialization": "Dentist",
        "experience": 9,
        "rating": Decimal("4.8"),
        "status": DoctorProfile.Status.BUSY,
        "latitude": Decimal("38.578512"),
        "longitude": Decimal("68.792880"),
        "address": "Eurodent Center, 55 Shohtemur Street, Dushanbe",
        "phone": "+992 918 25 95 95",
        "bio": "Demo doctor profile placed at the real Eurodent Center address for the public doctors map.",
        "consultation_fee": Decimal("180.00"),
        "available_days": "0,1,2,3,4,5",
        "workday_start": time(8, 0),
        "workday_end": time(17, 15),
        "slot_duration_minutes": 30,
    },
    {
        "username": "dr_rahimov",
        "email": "rahimov@medtech.demo",
        "first_name": "Kamol",
        "last_name": "Rahimov",
        "specialization": "Dental Surgeon",
        "experience": 13,
        "rating": Decimal("4.7"),
        "status": DoctorProfile.Status.ONLINE,
        "latitude": Decimal("38.548327"),
        "longitude": Decimal("68.751078"),
        "address": "Akhmaddent, Bukhoro Street 55, Dushanbe",
        "phone": "+992 900 44 55 66",
        "bio": "Demo doctor profile placed at the real Akhmaddent clinic address in Dushanbe.",
        "consultation_fee": Decimal("200.00"),
        "available_days": "0,1,2,3,4",
        "workday_start": time(9, 0),
        "workday_end": time(17, 0),
        "slot_duration_minutes": 30,
    },
    {
        "username": "dr_qodirova",
        "email": "qodirova@medtech.demo",
        "first_name": "Nilufar",
        "last_name": "Qodirova",
        "specialization": "Pediatric Dentist",
        "experience": 8,
        "rating": Decimal("4.8"),
        "status": DoctorProfile.Status.OFFLINE,
        "latitude": Decimal("38.554321"),
        "longitude": Decimal("68.776945"),
        "address": "Sihat Dent, Dehi Bolo Street 194, Dushanbe",
        "phone": "+992 901 11 22 33",
        "bio": "Demo doctor profile placed at the real Sihat Dent location for map presentation on Open Day.",
        "consultation_fee": Decimal("170.00"),
        "available_days": "1,2,3,4,5",
        "workday_start": time(9, 0),
        "workday_end": time(18, 0),
        "slot_duration_minutes": 30,
    },
]


class Command(BaseCommand):
    help = "Create four demo doctor profiles based on real clinic addresses in Dushanbe."

    def handle(self, *args, **options):
        doctor_group, _ = Group.objects.get_or_create(name="doctor")
        password = "Doctor123!"

        for item in CLINIC_DOCTORS:
            user, user_created = User.objects.update_or_create(
                username=item["username"],
                defaults={
                    "email": item["email"],
                    "first_name": item["first_name"],
                    "last_name": item["last_name"],
                    "is_active": True,
                    "is_email_verified": True,
                },
            )
            user.set_password(password)
            user.save(update_fields=["password"])
            user.groups.add(doctor_group)

            profile_defaults = {
                "specialization": item["specialization"],
                "experience": item["experience"],
                "rating": item["rating"],
                "status": item["status"],
                "latitude": item["latitude"],
                "longitude": item["longitude"],
                "address": item["address"],
                "phone": item["phone"],
                "bio": item["bio"],
                "consultation_fee": item["consultation_fee"],
                "available_days": item["available_days"],
                "workday_start": item["workday_start"],
                "workday_end": item["workday_end"],
                "slot_duration_minutes": item["slot_duration_minutes"],
            }
            _, profile_created = DoctorProfile.objects.update_or_create(
                user=user,
                defaults=profile_defaults,
            )

            state = []
            state.append("user created" if user_created else "user updated")
            state.append("profile created" if profile_created else "profile updated")
            self.stdout.write(
                self.style.SUCCESS(f"{user.username}: {', '.join(state)}")
            )

        self.stdout.write(self.style.WARNING(f"Shared demo password for these doctors: {password}"))
