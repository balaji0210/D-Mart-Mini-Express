import pytest
from rest_framework.test import APIClient
from accounts.models import User, RoleChoices
from products.models import Category, Product
from cart.models import Cart

@pytest.mark.django_db
class TestCartApp:
    def setup_method(self):
        self.client = APIClient()
        self.category = Category.objects.create(name="Groceries", description="Daily items")
        self.product = Product.objects.create(
            category=self.category, name="Rice 5kg", description="Basmati Rice", price=15.99, stock_quantity=10
        )
        self.customer = User.objects.create_user(
            email="cartcust@test.com", full_name="Cart Customer", role=RoleChoices.CUSTOMER
        )
        Cart.objects.create(user=self.customer)
        self.client.force_authenticate(user=self.customer)

    def test_get_empty_cart(self):
        response = self.client.get('/api/v1/cart/')
        assert response.status_code == 200
        assert response.data['success'] is True
        assert len(response.data['data']['items']) == 0
        assert float(response.data['data']['subtotal']) == 0.0

    def test_add_item_to_cart(self):
        response = self.client.post('/api/v1/cart/items/', {
            "product_id": str(self.product.id),
            "quantity": 2
        })
        assert response.status_code == 201
        assert response.data['success'] is True

        cart_res = self.client.get('/api/v1/cart/')
        assert len(cart_res.data['data']['items']) == 1
        assert cart_res.data['data']['items'][0]['quantity'] == 2

    def test_add_exceeding_stock(self):
        response = self.client.post('/api/v1/cart/items/', {
            "product_id": str(self.product.id),
            "quantity": 50  # Only 10 in stock
        })
        assert response.status_code == 409
        assert response.data['success'] is False
