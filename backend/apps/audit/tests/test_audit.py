import uuid
import pytest
from rest_framework.test import APIClient
from accounts.models import User, RoleChoices
from audit.models import AuditLog

@pytest.mark.django_db
class TestAuditApp:
    def setup_method(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            email="auditadmin@test.com", full_name="Audit Admin", role=RoleChoices.ADMIN, is_staff=True
        )
        self.customer = User.objects.create_user(
            email="auditcust@test.com", full_name="Audit Cust", role=RoleChoices.CUSTOMER
        )
        AuditLog.objects.create(
            user=self.admin,
            action="CREATE_PRODUCT",
            entity_type="PRODUCT",
            entity_id=uuid.uuid4(),
            metadata={"name": "Audit Product"}
        )

    def test_admin_can_view_audit_logs(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/v1/admin/audit-logs/')
        assert response.status_code == 200
        assert response.data['success'] is True
        assert len(response.data['data']['logs']) == 1

    def test_customer_cannot_view_audit_logs(self):
        self.client.force_authenticate(user=self.customer)
        response = self.client.get('/api/v1/admin/audit-logs/')
        assert response.status_code == 403
