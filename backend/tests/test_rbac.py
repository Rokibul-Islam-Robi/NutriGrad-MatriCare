"""
NutriGrad-MatriCare - Role-Based Access Control (RBAC) Tests.
"""

import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from patients.models import PatientProfile, AssessmentRecord

User = get_user_model()


@pytest.mark.django_db
class TestRBACPermissions:
    def setup_method(self):
        self.client = APIClient()

        # Create test users for each role tier
        self.admin_user = User.objects.create_user(
            username='admin_user', password='AdminPassword123!', role='ADMIN'
        )
        self.doctor_user = User.objects.create_user(
            username='doctor_user', password='DocPassword123!', role='DOCTOR'
        )
        self.clinician_user = User.objects.create_user(
            username='clinician_user', password='NursePassword123!', role='CLINICIAN'
        )

        # Create a sample patient and assessment
        self.patient = PatientProfile.objects.create(
            patient_id='PAT-RBAC-001',
            full_name='Jane Doe',
            age=26
        )
        self.assessment = AssessmentRecord.objects.create(
            patient=self.patient,
            assessed_by=self.clinician_user,
            age=26, bmi=22.5, hemoglobin=12.0, blood_pressure=115,
            sugar_level=90.0, protein_intake=65.0,
            predicted_risk='Low Risk', confidence_score=92.0
        )

        self.users_list_url = reverse('user_list')
        self.patient_detail_url = reverse('patient-detail', kwargs={'pk': self.patient.pk})
        self.assessment_detail_url = reverse('assessment_detail', kwargs={'pk': self.assessment.pk})

    def test_clinician_cannot_access_user_list(self):
        self.client.force_authenticate(user=self.clinician_user)
        response = self.client.get(self.users_list_url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_admin_can_access_user_list(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.users_list_url)
        assert response.status_code == status.HTTP_200_OK

    def test_clinician_cannot_delete_patient_or_assessment(self):
        self.client.force_authenticate(user=self.clinician_user)
        # Attempt to delete assessment
        del_assessment_res = self.client.delete(self.assessment_detail_url)
        assert del_assessment_res.status_code == status.HTTP_403_FORBIDDEN

        # Attempt to delete patient
        del_patient_res = self.client.delete(self.patient_detail_url)
        assert del_patient_res.status_code == status.HTTP_403_FORBIDDEN

    def test_doctor_can_delete_assessment(self):
        self.client.force_authenticate(user=self.doctor_user)
        del_res = self.client.delete(self.assessment_detail_url)
        assert del_res.status_code == status.HTTP_204_NO_CONTENT
        assert not AssessmentRecord.objects.filter(pk=self.assessment.pk).exists()
