import pytest
from rest_framework.test import APIClient
from accounts.models import User, RoleChoices
from products.models import Category, Product

@pytest.mark.django_db
class TestProductsApp:
    def setup_method(self):
        self.client = APIClient()
        self.category = Category.objects.create(name="Dairy", description="Fresh dairy products")
        self.product = Product.objects.create(
            category=self.category,
            name="Milk",
            description="1 Gallon Milk",
            price=4.99,
            stock_quantity=20,
            low_stock_threshold=5
        )
        self.admin = User.objects.create_user(
            email="admin@test.com", full_name="Admin User", role=RoleChoices.ADMIN, is_staff=True
        )
        self.customer = User.objects.create_user(
            email="cust@test.com", full_name="Customer User", role=RoleChoices.CUSTOMER
        )

    def test_list_products_public(self):
        response = self.client.get('/api/v1/products/')
        assert response.status_code == 200
        assert response.data['success'] is True
        assert len(response.data['data']['products']) == 1

    def test_create_product_admin_only(self):
        # Customer fails
        self.client.force_authenticate(user=self.customer)
        res_cust = self.client.post('/api/v1/products/', {
            "name": "Cheese", "category_id": str(self.category.id), "description": "Cheddar", "price": 3.50, "stock_quantity": 10
        })
        assert res_cust.status_code == 403

        # Admin succeeds
        self.client.force_authenticate(user=self.admin)
        res_admin = self.client.post('/api/v1/products/', {
            "name": "Cheese", "category_id": str(self.category.id), "description": "Cheddar", "price": 3.50, "stock_quantity": 10
        })
        assert res_admin.status_code == 201
        assert res_admin.data['success'] is True
