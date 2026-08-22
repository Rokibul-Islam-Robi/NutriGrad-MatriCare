"""
NutriGrad-MatriCare - Authentication & Custom User Model with RBAC.
"""

from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'System Administrator'
        DOCTOR = 'DOCTOR', 'Doctor / Obstetrician'
        CLINICIAN = 'CLINICIAN', 'Clinician / Nurse'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CLINICIAN,
        help_text="Role-Based Access Control identifier."
    )
    department = models.CharField(max_length=100, blank=True, default='Maternal & Fetal Medicine')
    license_number = models.CharField(max_length=50, blank=True, default='')
    phone_number = models.CharField(max_length=25, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_admin_role(self) -> bool:
        return self.role == self.Role.ADMIN or self.is_superuser

    @property
    def is_doctor_role(self) -> bool:
        return self.role in [self.Role.DOCTOR, self.Role.ADMIN] or self.is_superuser

    @property
    def is_clinician_role(self) -> bool:
        return self.role in [self.Role.CLINICIAN, self.Role.DOCTOR, self.Role.ADMIN]

    def __str__(self):
        return f"{self.username} [{self.get_role_display()}]"
