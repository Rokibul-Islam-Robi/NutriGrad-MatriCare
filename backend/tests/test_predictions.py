"""
NutriGrad-MatriCare - Clinical Assessment & Prediction Tests.
"""

import pytest
from unittest.mock import patch
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from patients.models import PatientProfile, AssessmentRecord

User = get_user_model()


@pytest.mark.django_db
class TestPredictionsAndAssessments:
    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='dr_chen',
            password='Password123!',
            role='DOCTOR'
        )
        self.client.force_authenticate(user=self.user)
        self.evaluate_url = reverse('assessment_evaluate')
        self.analytics_url = reverse('realtime_analytics')

    @patch('patients.ml_client.MLServiceClient.predict_and_analyze')
    def test_evaluate_assessment_success(self, mock_predict):
        mock_predict.return_value = {
            "prediction": "High Risk",
            "risk_level_code": 2,
            "confidence_score": 94.5,
            "distribution": {"low": 2.0, "mid": 3.5, "high": 94.5},
            "clinical_flags": ["Severe Maternal Anemia (Hb 8.2 g/dL < 9.0)"],
            "dietary_recommendations": ["Urgent iron therapy consultation."],
            "assessed_features": {}
        }

        payload = {
            "patient_id": "PAT-2026-901",
            "full_name": "Maria Garcia",
            "age": 28,
            "bmi": 24.0,
            "hemoglobin": 8.2,
            "blood_pressure": 135,
            "sugar_level": 95.0,
            "protein_intake": 45.0,
            "gestational_weeks": 16
        }

        response = self.client.post(self.evaluate_url, payload, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['prediction'] == 'High Risk'
        assert response.data['confidence_score'] == 94.5
        assert len(response.data['clinical_flags']) > 0

        # Check DB persistence
        assert PatientProfile.objects.filter(patient_id='PAT-2026-901').exists()
        assert AssessmentRecord.objects.filter(patient__patient_id='PAT-2026-901').exists()

    def test_evaluate_invalid_clinical_ranges(self):
        invalid_payload = {
            "patient_id": "PAT-ERR-001",
            "age": 5,  # Below minimum (12)
            "bmi": 5.0,  # Below minimum (12.0)
            "hemoglobin": 35.0,  # Above maximum (20.0)
            "blood_pressure": 300,  # Above maximum (240)
            "sugar_level": -10.0,  # Negative
            "protein_intake": 50.0
        }
        response = self.client.post(self.evaluate_url, invalid_payload, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'age' in response.data
        assert 'hemoglobin' in response.data

    def test_realtime_analytics_endpoint(self):
        # Create dummy patient and assessment
        patient = PatientProfile.objects.create(patient_id='PAT-ANALYTICS-01', full_name='Lisa Ray', age=30)
        AssessmentRecord.objects.create(
            patient=patient, assessed_by=self.user,
            age=30, bmi=25.0, hemoglobin=10.5, blood_pressure=125, sugar_level=100.0, protein_intake=60.0,
            predicted_risk='Mid Risk', confidence_score=80.0
        )

        response = self.client.get(self.analytics_url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['total_assessments'] >= 1
        assert 'risk_distribution' in response.data
        assert 'condition_alerts' in response.data
