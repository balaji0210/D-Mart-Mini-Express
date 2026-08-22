export interface Category {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  image_url?: string;
  display_order?: number;
  is_active: boolean;
  products_count?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price: string | number;
  discount_price?: string | number;
  stock_quantity: number;
  unit?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  sku?: string;
  barcode?: string;
  stock_quantity: number;
  low_stock_threshold: number;
  unit?: string;
  weight_size?: string;
  category: Category | string;
  category_name?: string;
  image_url: string;
  is_active: boolean;
  is_featured?: boolean;
  is_in_stock: boolean;
  is_low_stock: boolean;
  rating?: number;
  variants?: ProductVariant[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductFilterParams {
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  is_featured?: boolean;
  sort_by?: string;
  page?: number;
  page_size?: number;
}

