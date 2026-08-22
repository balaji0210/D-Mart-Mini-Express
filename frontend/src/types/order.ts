import { Product } from './product';
import { User } from './auth';

export type FulfillmentType = 'PICKUP' | 'DELIVERY';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type PaymentMethod = 'CASH' | 'CARD' | 'UPI' | 'WALLET';

export interface PickupSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity?: number;
  max_capacity?: number;
  booked?: number;
  booked_count?: number;
  available?: number;
  is_active: boolean;
  is_past?: boolean;
  is_full?: boolean;
  is_disabled?: boolean;
  is_available?: boolean;
  status?: 'ACTIVE' | 'FULL' | 'EXPIRED' | 'DISABLED';
}

export interface OrderItem {
  id: string;
  product?: Product;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  contact_number: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer?: User;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  fulfillment_type: FulfillmentType;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  subtotal: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount: number;
  delivery_address?: DeliveryAddress;
  pickup_slot?: PickupSlot;
  items_count: number;
  items: OrderItem[];
  assigned_staff?: User;
  staff_notes?: string;
  cancellation_reason?: string;
  refund_reason?: string;
  refund_amount?: number;
  refunded_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user?: User;
  role?: string;
  action: string;
  action_type?: string;
  entity_type: string;
  entity_id?: string;
  affected_record?: string;
  metadata: Record<string, any>;
  summary?: string;
  ip_address?: string;
  created_at: string;
}

export interface PaymentTransaction {
  id: string;
  order_number: string;
  customer_name: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  timestamp: string;
  refund_notes?: string;
}

export type RequestType = 'RETURN' | 'EXCHANGE';
export type RequestStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface ReturnExchangeRequest {
  id: string;
  order_number?: string;
  order_id?: string;
  order_item: OrderItem;
  request_type: RequestType;
  reason: string;
  replacement_product?: Product;
  rejection_reason?: string | null;
  status: RequestStatus;
  requested_at: string;
  processed_at?: string;
  processed_by?: User;
}

export interface StoreSettings {
  store_name: string;
  logo_url?: string;
  email: string;
  phone: string;
  address: string;
  business_hours: string;
  timezone: string;
  currency_symbol: string;
  tax_rate: number;
  cancellation_window_minutes: number;
  auto_cancel_unclaimed_hours: number;
  enable_cash_payment: boolean;
  enable_card_payment: boolean;
  enable_upi_payment: boolean;
  enable_wallet_payment: boolean;
}


