import pytest
from rest_framework.test import APIClient
from accounts.models import User, RoleChoices

@pytest.mark.django_db
class TestAuthentication:
    def setup_method(self):
        self.client = APIClient()

    def test_register_user_success(self):
        data = {
            "full_name": "Test Customer",
            "email": "customer@test.com",
            "password": "SecureP@ssw0rd123",
            "confirm_password": "SecureP@ssw0rd123"
        }
        response = self.client.post('/api/v1/auth/register/', data, format='json')
        assert response.status_code == 201
        assert response.data['success'] is True
        assert response.data['data']['user']['email'] == "customer@test.com"
        assert 'tokens' in response.data['data']

    def test_register_invalid_password(self):
        data = {
            "full_name": "Test Customer",
            "email": "customer@test.com",
            "password": "simple",
            "confirm_password": "simple"
        }
        response = self.client.post('/api/v1/auth/register/', data, format='json')
        assert response.status_code == 400
        assert response.data['success'] is False

    def test_login_success(self):
        user = User.objects.create_user(
            email="customer@test.com",
            full_name="Test Customer",
            password="SecureP@ssw0rd123",
            role=RoleChoices.CUSTOMER
        )
        data = {
            "email": "customer@test.com",
            "password": "SecureP@ssw0rd123"
        }
        response = self.client.post('/api/v1/auth/login/', data, format='json')
        assert response.status_code == 200
        assert response.data['success'] is True
        assert 'access' in response.data['data']['tokens']

    def test_login_invalid_credentials(self):
        data = {
            "email": "nonexistent@test.com",
            "password": "WrongPassword123!"
        }
        response = self.client.post('/api/v1/auth/login/', data, format='json')
        assert response.status_code == 400
        assert response.data['success'] is False
