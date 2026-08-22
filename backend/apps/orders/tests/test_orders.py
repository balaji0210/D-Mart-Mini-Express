import pytest
from datetime import date, time, timedelta
from rest_framework.test import APIClient
from accounts.models import User, RoleChoices
from products.models import Category, Product
from operations.models import PickupSlot
from cart.models import Cart, CartItem

@pytest.mark.django_db
class TestOrdersApp:
    def setup_method(self):
        self.client = APIClient()
        self.category = Category.objects.create(name="Beverages", description="Soft drinks")
        self.product = Product.objects.create(
            category=self.category, name="Orange Juice 1L", description="Fresh juice", price=3.99, stock_quantity=15
        )
        self.customer = User.objects.create_user(
            email="ordercust@test.com", full_name="Order Customer", role=RoleChoices.CUSTOMER
        )
        self.staff = User.objects.create_user(
            email="orderstaff@test.com", full_name="Order Staff", role=RoleChoices.STAFF, is_staff=True
        )
        self.slot = PickupSlot.objects.create(
            date=date.today() + timedelta(days=1), start_time=time(10, 0), end_time=time(11, 0), capacity=10
        )


    def test_checkout_pickup_order(self):
        self.client.force_authenticate(user=self.customer)
        # Add item to cart
        cart, _ = Cart.objects.get_or_create(user=self.customer)
        CartItem.objects.create(cart=cart, product=self.product, quantity=3)

        # Checkout with Pickup slot
        response = self.client.post('/api/v1/orders/checkout/', {
            "fulfillment_type": "PICKUP",
            "pickup_slot_id": str(self.slot.id)
        }, format='json')

        assert response.status_code == 201
        assert response.data['success'] is True
        assert response.data['data']['order']['fulfillment_type'] == 'PICKUP'
        
        # Check stock reduced
        self.product.refresh_from_db()
        assert self.product.stock_quantity == 12

        # Check pickup slot capacity updated
        self.slot.refresh_from_db()
        assert self.slot.available_capacity == 9

    def test_order_status_transition_by_staff(self):
        self.client.force_authenticate(user=self.customer)
        cart, _ = Cart.objects.get_or_create(user=self.customer)
        CartItem.objects.create(cart=cart, product=self.product, quantity=1)
        res = self.client.post('/api/v1/orders/checkout/', {
            "fulfillment_type": "PICKUP",
            "pickup_slot_id": str(self.slot.id)
        }, format='json')
        order_id = res.data['data']['order']['id']

        # Staff updates status from PENDING to CONFIRMED
        self.client.force_authenticate(user=self.staff)
        status_res = self.client.patch(f'/api/v1/orders/{order_id}/status/', {
            "status": "CONFIRMED"
        }, format='json')
        assert status_res.status_code == 200
        assert status_res.data['data']['status'] == "CONFIRMED"
