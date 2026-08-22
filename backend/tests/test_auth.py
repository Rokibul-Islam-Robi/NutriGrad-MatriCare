"""
NutriGrad-MatriCare - Authentication & JWT Tests.
"""

import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


@pytest.mark.django_db
class TestAuthentication:
    def setup_method(self):
        self.client = APIClient()
        self.register_url = reverse('user_register')
        self.token_url = reverse('token_obtain_pair')
        self.refresh_url = reverse('token_refresh')
        self.profile_url = reverse('user_profile')

    def test_user_registration_success(self):
        payload = {
            'username': 'dr_sarah',
            'email': 'sarah@hospital.org',
            'password': 'StrongPassword123!',
            'password_confirm': 'StrongPassword123!',
            'first_name': 'Sarah',
            'last_name': 'Connor',
            'role': 'DOCTOR',
            'department': 'Obstetrics'
        }
        response = self.client.post(self.register_url, payload, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['user']['username'] == 'dr_sarah'
        assert response.data['user']['role'] == 'DOCTOR'
        assert User.objects.filter(username='dr_sarah').exists()

    def test_user_registration_password_mismatch(self):
        payload = {
            'username': 'dr_mismatch',
            'email': 'mismatch@hospital.org',
            'password': 'Password123!',
            'password_confirm': 'DifferentPassword456!',
            'role': 'CLINICIAN'
        }
        response = self.client.post(self.register_url, payload, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data

    def test_jwt_token_obtain_and_refresh(self):
        user = User.objects.create_user(
            username='nurse_emma',
            email='emma@clinic.org',
            password='SecurePassword123!',
            role='CLINICIAN'
        )

        login_payload = {
            'username': 'nurse_emma',
            'password': 'SecurePassword123!'
        }
        response = self.client.post(self.token_url, login_payload, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert response.data['user']['role'] == 'CLINICIAN'

        access_token = response.data['access']
        refresh_token = response.data['refresh']

        # Test authenticated profile access
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        profile_res = self.client.get(self.profile_url)
        assert profile_res.status_code == status.HTTP_200_OK
        assert profile_res.data['username'] == 'nurse_emma'

        # Test Token Refresh
        refresh_res = self.client.post(self.refresh_url, {'refresh': refresh_token}, format='json')
        assert refresh_res.status_code == status.HTTP_200_OK
        assert 'access' in refresh_res.data

    def test_unauthenticated_request_rejected(self):
        response = self.client.get(self.profile_url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
