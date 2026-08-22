from datetime import datetime
from django.db import transaction
from django.core.exceptions import ValidationError
from cart.models import Cart, CartItem
from operations.models import PickupSlot
from audit.models import AuditLog
from .models import Order, OrderItem, FulfillmentType, OrderStatus

VALID_STATUS_TRANSITIONS = {
    OrderStatus.PENDING: [OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.COMPLETED, OrderStatus.CANCELLED],
    OrderStatus.CONFIRMED: [OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.COMPLETED, OrderStatus.CANCELLED],
    OrderStatus.PREPARING: [OrderStatus.READY_FOR_PICKUP, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.COMPLETED, OrderStatus.DELIVERED, OrderStatus.CANCELLED],
    OrderStatus.READY_FOR_PICKUP: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
    OrderStatus.OUT_FOR_DELIVERY: [OrderStatus.DELIVERED, OrderStatus.COMPLETED, OrderStatus.CANCELLED],
    OrderStatus.COMPLETED: [],
    OrderStatus.DELIVERED: [],
    OrderStatus.CANCELLED: [],
}

def generate_order_number():
    """Generates unique order number in format: ORD-YYYY-NNNNNN"""
    year_str = datetime.now().strftime('%Y')
    count = Order.objects.filter(order_number__startswith=f'ORD-{year_str}-').count()
    sequence = str(count + 1).zfill(6)
    return f'ORD-{year_str}-{sequence}'

def validate_status_transition(current_status, new_status):
    """Validates allowed order status transitions."""
    allowed = VALID_STATUS_TRANSITIONS.get(current_status, [])
    if new_status not in allowed:
        raise ValidationError(f"Invalid status transition from {current_status} to {new_status}")
    return True

class InsufficientStockException(Exception):
    def __init__(self, message, errors=None):
        super().__init__(message)
        self.errors = errors or {}

class PickupSlotFullException(Exception):
    pass

@transaction.atomic
def process_checkout(user, fulfillment_type, pickup_slot_id=None, delivery_address=None, payment_method='CASH'):
    """
    Executes atomic checkout transaction with row-level locking.
    Prevents race conditions and overselling.
    """
    # 1. Lock user's cart
    cart = Cart.objects.select_for_update().filter(user=user).first()
    if not cart:
        raise ValidationError("Cart not found")

    cart_items = cart.items.select_related('product').select_for_update().all()
    if not cart_items.exists():
        raise ValidationError("Cart is empty")

    # 2. Validate stock availability for all products
    stock_errors = {}
    for item in cart_items:
        if not item.product.is_active:
            stock_errors[item.product.name] = [f"Product '{item.product.name}' is no longer available."]
        elif item.quantity > item.product.stock_quantity:
            stock_errors[item.product.name] = [
                f"Insufficient stock for '{item.product.name}'. Requested: {item.quantity}, Available: {item.product.stock_quantity}"
            ]

    if stock_errors:
        raise InsufficientStockException("Insufficient stock available", errors=stock_errors)

    # 3. Validate pickup slot capacity if PICKUP fulfillment selected
    pickup_slot = None
    if fulfillment_type == FulfillmentType.PICKUP:
        if not pickup_slot_id:
            raise ValidationError("Pickup slot ID is required for store pickup fulfillment.")
        try:
            pickup_slot = PickupSlot.objects.select_for_update().get(id=pickup_slot_id, is_active=True)
        except PickupSlot.DoesNotExist:
            raise ValidationError("Invalid or inactive pickup slot selected.")

        if pickup_slot.is_past:
            raise ValidationError("The selected pickup time slot has already passed and is no longer available.")

        if pickup_slot.available_capacity <= 0:
            raise PickupSlotFullException("This pickup slot is currently full. Please select another available slot.")

    # 4. Validate delivery address if DELIVERY fulfillment selected
    if fulfillment_type == FulfillmentType.DELIVERY:
        if not delivery_address:
            raise ValidationError("Delivery address is required for home delivery fulfillment.")

    # 5. Calculate totals
    subtotal = sum(item.subtotal for item in cart_items)
    total_amount = subtotal

    # 6. Create Order record
    order_number = generate_order_number()
    order = Order.objects.create(
        user=user,
        order_number=order_number,
        fulfillment_type=fulfillment_type,
        status=OrderStatus.PENDING,
        payment_method=payment_method,
        subtotal=subtotal,
        total_amount=total_amount,
        delivery_address=delivery_address if fulfillment_type == FulfillmentType.DELIVERY else None,
        pickup_slot=pickup_slot if fulfillment_type == FulfillmentType.PICKUP else None
    )


    # 7. Create OrderItem snapshots & update product stock
    for cart_item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=cart_item.product,
            product_name=cart_item.product.name,
            unit_price=cart_item.product.price,
            quantity=cart_item.quantity,
            subtotal=cart_item.subtotal
        )
        # Deduct stock
        product = cart_item.product
        product.stock_quantity -= cart_item.quantity
        product.save(update_fields=['stock_quantity', 'updated_at'])

    # 8. Clear cart
    cart_items.delete()

    # 9. Log Audit Entry
    AuditLog.objects.create(
        user=user,
        action='ORDER_CREATED',
        entity_type='Order',
        entity_id=order.id,
        metadata={
            'order_number': order.order_number,
            'fulfillment_type': fulfillment_type,
            'total_amount': str(total_amount),
            'items_count': len(cart_items)
        }
    )

    return order

@transaction.atomic
def cancel_order(order, user):
    """
    Cancels an eligible order and restores deducted stock.
    """
    if order.status not in [OrderStatus.PENDING, OrderStatus.CONFIRMED]:
        raise ValidationError(f"Order cannot be cancelled in state '{order.status}'.")

    # Restore stock for each item
    for item in order.items.select_related('product').all():
        if item.product:
            item.product.stock_quantity += item.quantity
            item.product.save(update_fields=['stock_quantity', 'updated_at'])

    old_status = order.status
    order.status = OrderStatus.CANCELLED
    order.save(update_fields=['status', 'updated_at'])

    # Audit log
    AuditLog.objects.create(
        user=user,
        action='ORDER_CANCELLED',
        entity_type='Order',
        entity_id=order.id,
        metadata={
            'order_number': order.order_number,
            'old_status': old_status,
            'new_status': OrderStatus.CANCELLED
        }
    )

    return order
