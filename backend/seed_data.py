"""
NutriGrad-MatriCare - Database Seeding Script.
Populates standard clinical demo roles and representative maternal records.
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from patients.models import PatientProfile, AssessmentRecord
from patients.ml_client import ml_client

User = get_user_model()

def seed_database():
    print("[*] Seeding NutriGrad-MatriCare Database with Clinical Providers and Patient Records...")

    # 1. Create Demo Users
    users_data = [
        {
            "username": "patient_sarah",
            "password": "MotherPass123!",
            "email": "sarah.rahman@gmail.com",
            "first_name": "Sarah",
            "last_name": "Rahman",
            "role": "CLINICIAN",
            "department": "Expecting Mother (Week 16)",
            "license_number": "PAT-001"
        },
        {
            "username": "clinician_emma",
            "password": "NursePass123!",
            "email": "emma.watson@hospital.org",
            "first_name": "Emma",
            "last_name": "Watson",
            "role": "CLINICIAN",
            "department": "Antenatal Triage",
            "license_number": "RN-99421"
        },
        {
            "username": "dr_sarah",
            "password": "DoctorPass123!",
            "email": "sarah.connor@hospital.org",
            "first_name": "Sarah",
            "last_name": "Connor",
            "role": "DOCTOR",
            "department": "Maternal-Fetal Medicine",
            "license_number": "MD-44820"
        },
        {
            "username": "admin_sys",
            "password": "AdminPass123!",
            "email": "chief.admin@hospital.org",
            "first_name": "Chief",
            "last_name": "Administrator",
            "role": "ADMIN",
            "department": "Hospital Informatics",
            "license_number": "ADM-001"
        }
    ]

    created_users = {}
    for u in users_data:
        user, created = User.objects.get_or_create(
            username=u["username"],
            defaults={
                "email": u["email"],
                "first_name": u["first_name"],
                "last_name": u["last_name"],
                "role": u["role"],
                "department": u["department"],
                "license_number": u["license_number"],
                "is_staff": u["role"] == "ADMIN",
                "is_superuser": u["role"] == "ADMIN"
            }
        )
        if created:
            user.set_password(u["password"])
            user.save()
            print(f"[+] Created user: {user.username} ({user.role})")
        else:
            print(f"[*] Existing user: {user.username}")
        created_users[u["role"]] = user

    # 2. Seed Diverse Patient Profiles & Clinical Assessments
    sample_patients = [
        {
            "patient_id": "PAT-2026-101",
            "full_name": "Elena Rostova",
            "age": 25,
            "gestational_weeks": 16,
            "blood_group": "A+",
            "vitals": {"bmi": 22.1, "hemoglobin": 12.8, "blood_pressure": 114, "sugar_level": 88.0, "protein_intake": 68.0}
        },
        {
            "patient_id": "PAT-2026-102",
            "full_name": "Fatima Zahra",
            "age": 28,
            "gestational_weeks": 24,
            "blood_group": "O+",
            "vitals": {"bmi": 20.4, "hemoglobin": 8.6, "blood_pressure": 118, "sugar_level": 94.0, "protein_intake": 36.0}
        },
        {
            "patient_id": "PAT-2026-103",
            "full_name": "Victoria Chang",
            "age": 36,
            "gestational_weeks": 30,
            "blood_group": "B+",
            "vitals": {"bmi": 31.5, "hemoglobin": 10.2, "blood_pressure": 146, "sugar_level": 142.0, "protein_intake": 42.0}
        },
        {
            "patient_id": "PAT-2026-104",
            "full_name": "Sophia Martinez",
            "age": 22,
            "gestational_weeks": 12,
            "blood_group": "AB+",
            "vitals": {"bmi": 24.0, "hemoglobin": 11.5, "blood_pressure": 122, "sugar_level": 92.0, "protein_intake": 62.0}
        },
        {
            "patient_id": "PAT-2026-105",
            "full_name": "Hannah Abbott",
            "age": 39,
            "gestational_weeks": 28,
            "blood_group": "O-",
            "vitals": {"bmi": 28.5, "hemoglobin": 9.0, "blood_pressure": 152, "sugar_level": 158.0, "protein_intake": 38.0}
        }
    ]

    for p in sample_patients:
        patient, _ = PatientProfile.objects.get_or_create(
            patient_id=p["patient_id"],
            defaults={
                "full_name": p["full_name"],
                "age": p["age"],
                "gestational_weeks": p["gestational_weeks"],
                "blood_group": p["blood_group"],
                "created_by": created_users["DOCTOR"]
            }
        )

        v = p["vitals"]
        ml_eval = ml_client.predict_and_analyze({
            "age": p["age"],
            "bmi": v["bmi"],
            "hemoglobin": v["hemoglobin"],
            "blood_pressure": v["blood_pressure"],
            "sugar_level": v["sugar_level"],
            "protein_intake": v["protein_intake"]
        })

        record, _ = AssessmentRecord.objects.get_or_create(
            patient=patient,
            age=p["age"],
            bmi=v["bmi"],
            hemoglobin=v["hemoglobin"],
            blood_pressure=v["blood_pressure"],
            sugar_level=v["sugar_level"],
            protein_intake=v["protein_intake"],
            defaults={
                "assessed_by": created_users["CLINICIAN"],
                "predicted_risk": ml_eval.get("prediction", "Low Risk"),
                "risk_level_code": ml_eval.get("risk_level_code", 0),
                "confidence_score": ml_eval.get("confidence_score", 90.0),
                "risk_distribution": ml_eval.get("distribution", {}),
                "clinical_flags": ml_eval.get("clinical_flags", []),
                "dietary_recommendations": ml_eval.get("dietary_recommendations", []),
            }
        )
        print(f"[+] Evaluated patient {patient.patient_id} ({patient.full_name}) -> {record.predicted_risk}")

    print("\n[OK] Seeding complete! Providers and assessments are live in the database.")

if __name__ == "__main__":
    seed_database()
