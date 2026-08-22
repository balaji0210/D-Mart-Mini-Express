import pytest
from datetime import date, time, timedelta
from rest_framework.test import APIClient
from accounts.models import User, RoleChoices
from products.models import Category, Product
from operations.models import PickupSlot
from cart.models import Cart, CartItem
from orders.models import Order

@pytest.mark.django_db
class TestReturnsApp:
    def setup_method(self):
        self.client = APIClient()
        self.category = Category.objects.create(name="Electronics", description="Gadgets")
        self.product = Product.objects.create(
            category=self.category, name="USB Cable", description="Type C", price=9.99, stock_quantity=10
        )
        self.customer = User.objects.create_user(
            email="retcust@test.com", full_name="Return Customer", role=RoleChoices.CUSTOMER
        )
        self.staff = User.objects.create_user(
            email="retstaff@test.com", full_name="Return Staff", role=RoleChoices.STAFF, is_staff=True
        )
        self.slot = PickupSlot.objects.create(
            date=date.today() + timedelta(days=1), start_time=time(12, 0), end_time=time(13, 0), capacity=5
        )

    def test_create_return_request(self):
        # Create completed order
        self.client.force_authenticate(user=self.customer)
        cart, _ = Cart.objects.get_or_create(user=self.customer)
        CartItem.objects.create(cart=cart, product=self.product, quantity=1)
        res = self.client.post('/api/v1/orders/checkout/', {
            "fulfillment_type": "PICKUP",
            "pickup_slot_id": str(self.slot.id)
        }, format='json')
        order_id = res.data['data']['order']['id']
        
        # Mark order completed
        order = Order.objects.get(id=order_id)
        order.status = 'COMPLETED'
        order.save()

        order_item = order.items.first()

        # Submit return request
        ret_res = self.client.post('/api/v1/returns/', {
            "order_item_id": str(order_item.id),
            "request_type": "RETURN",
            "reason": "Defective item"
        }, format='json')

        assert ret_res.status_code == 201
        assert ret_res.data['success'] is True
        assert ret_res.data['data']['status'] == 'REQUESTED'
