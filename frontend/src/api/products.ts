import { apiClient } from './client';
import { ProductFilterParams } from '../types/product';

const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Fruits & Vegetables', slug: 'fruits-vegetables', description: 'Fresh farm produce' },
  { id: 'cat-2', name: 'Dairy & Bakery', slug: 'dairy-bakery', description: 'Milk, butter, bread, and bakery items' },
  { id: 'cat-3', name: 'Beverages', slug: 'beverages', description: 'Juices, soft drinks, tea, coffee' },
  { id: 'cat-4', name: 'Snacks & Munchies', slug: 'snacks-munchies', description: 'Chips, biscuits, nuts, and chocolates' },
  { id: 'cat-5', name: 'Household Essentials', slug: 'household-essentials', description: 'Detergents, cleaners, and hygiene products' },
  { id: 'cat-6', name: 'Ice Creams & Frozen', slug: 'ice-creams-frozen', description: 'Ice cream tubs, bars, pops, and frozen treats' },
  { id: 'cat-7', name: 'Atta, Rice & Staples', slug: 'atta-rice-staples', description: 'Grains, flour, rice, and suji' },
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod-kwality-mango-700',
    name: "Kwality Wall's Alphonso Mango Ice Cream (700 ml)",
    description: 'Rich and creamy Alphonso mango flavored ice cream tub.',
    price: '160.00',
    stock_quantity: 40,
    is_in_stock: true,
    low_stock_threshold: 5,
    image_url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371',
    category: INITIAL_CATEGORIES[5],
  },
  {
    id: 'prod-kwality-choco-brownie-700',
    name: "Kwality Wall's Choco Brownie Fudge Ice Cream (700 ml)",
    description: 'Decadent chocolate ice cream loaded with rich brownie fudge pieces.',
    price: '236.00',
    stock_quantity: 35,
    is_in_stock: true,
    low_stock_threshold: 5,
    image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
    category: INITIAL_CATEGORIES[5],
  },
  {
    id: 'prod-kwality-butterscotch-700',
    name: "Kwality Wall's Butterscotch Ice Cream (700 ml)",
    description: 'Classic butterscotch ice cream with crunchy caramelized cashew bits.',
    price: '144.00',
    stock_quantity: 50,
    is_in_stock: true,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1567206563064-6f60f4078b57',
    category: INITIAL_CATEGORIES[5],
  },
  {
    id: 'prod-kwality-chocochips-700',
    name: "Kwality Wall's Dark Chocochips Ice Cream (700 ml)",
    description: 'Creamy vanilla loaded with dark chocolate chips.',
    price: '190.00',
    stock_quantity: 28,
    is_in_stock: true,
    low_stock_threshold: 5,
    image_url: 'https://images.unsplash.com/photo-1576506295286-5cda482453a2',
    category: INITIAL_CATEGORIES[5],
  },
  {
    id: 'prod-kwality-cassatta-slice',
    name: "Kwality Wall's Cassatta Cake Ice Cream Slice",
    description: 'Multi-layered ice cream slice with sponge cake base and candied fruits.',
    price: '75.00',
    stock_quantity: 60,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a',
    category: INITIAL_CATEGORIES[5],
  },
  {
    id: 'prod-lays-magic-masala-3pack',
    name: "Lay's India's Magic Masala Chips (80g x 3 Pack)",
    description: 'Spicy and tangy Indian masala flavored crunchy potato chips combo.',
    price: '71.00',
    stock_quantity: 85,
    is_in_stock: true,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
    category: INITIAL_CATEGORIES[3],
  },
  {
    id: 'prod-lays-cream-onion-3pack',
    name: "Lay's American Style Cream & Onion Chips (80g x 3 Pack)",
    description: 'Smooth cream and onion flavored potato chips 3-pack.',
    price: '71.00',
    stock_quantity: 90,
    is_in_stock: true,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5',
    category: INITIAL_CATEGORIES[3],
  },
  {
    id: 'prod-lays-salted-3pack',
    name: "Lay's Classic Salted Potato Chips (80g x 3 Pack)",
    description: 'Crispy salted potato chips made with selected potatoes.',
    price: '71.00',
    stock_quantity: 110,
    is_in_stock: true,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
    category: INITIAL_CATEGORIES[3],
  },
  {
    id: 'prod-lays-spanish-tomato-3pack',
    name: "Lay's Spanish Tomato Tango Chips (80g x 3 Pack)",
    description: 'Sweet and tangy tomato flavored potato chips bundle.',
    price: '71.00',
    stock_quantity: 75,
    is_in_stock: true,
    low_stock_threshold: 12,
    image_url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5',
    category: INITIAL_CATEGORIES[3],
  },
  {
    id: 'prod-lays-sizzling-hot-3pack',
    name: "Lay's Sizzling Hot Potato Chips (80g x 3 Pack)",
    description: 'Extra fiery hot chili flavored potato chips combo pack.',
    price: '71.00',
    stock_quantity: 65,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
    category: INITIAL_CATEGORIES[3],
  },
  {
    id: 'prod-curd-500g',
    name: 'Amul Masti Dahi / Curd (500g Pouch)',
    description: 'Thick, creamy, and wholesome fermented curd pouch.',
    price: '35.00',
    stock_quantity: 80,
    is_in_stock: true,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    category: INITIAL_CATEGORIES[1],
  },
  {
    id: 'prod-amul-butter-500g',
    name: 'Amul Pasteurised Salted Butter (500g Pack)',
    description: 'Utterly butterly delicious salted pasteurised butter.',
    price: '275.00',
    stock_quantity: 50,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d',
    category: INITIAL_CATEGORIES[1],
  },
  {
    id: 'prod-amul-gold-milk-1l',
    name: 'Amul Gold Full Cream Milk (1 Litre Pouch)',
    description: 'Rich full cream pasteurised fresh milk pouch.',
    price: '66.00',
    stock_quantity: 120,
    is_in_stock: true,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
    category: INITIAL_CATEGORIES[1],
  },
  {
    id: 'prod-paneer-200g',
    name: 'Amul Fresh Paneer / Cottage Cheese (200g Pack)',
    description: 'Soft and fresh paneer ideal for curries and snacks.',
    price: '95.00',
    stock_quantity: 45,
    is_in_stock: true,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1559561853-08451507cbe7',
    category: INITIAL_CATEGORIES[1],
  },
  {
    id: 'prod-fresh-apples-1kg',
    name: 'Fresh Premium Shimla Apples (1 kg)',
    description: 'Crisp, juicy, and naturally sweet red Shimla apples.',
    price: '180.00',
    stock_quantity: 60,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
    category: INITIAL_CATEGORIES[0],
  },
  {
    id: 'prod-fresh-bananas-1dozen',
    name: 'Fresh Robusta Bananas (1 Dozen / ~1.2 kg)',
    description: 'Naturally ripened, rich source of potassium bananas.',
    price: '60.00',
    stock_quantity: 90,
    is_in_stock: true,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
    category: INITIAL_CATEGORIES[0],
  },
  {
    id: 'prod-fresh-tomatoes-1kg',
    name: 'Fresh Hybrid Red Tomatoes (1 kg)',
    description: 'Firm and tangy hybrid red cooking tomatoes.',
    price: '38.00',
    stock_quantity: 100,
    is_in_stock: true,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
    category: INITIAL_CATEGORIES[0],
  },
  {
    id: 'prod-fresh-onions-1kg',
    name: 'Fresh Nashik Red Onions (1 kg)',
    description: 'Quality Nashik red onions essential for cooking.',
    price: '32.00',
    stock_quantity: 150,
    is_in_stock: true,
    low_stock_threshold: 25,
    image_url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb',
    category: INITIAL_CATEGORIES[0],
  },
  {
    id: 'prod-coca-cola-2l',
    name: 'Coca-Cola Original Taste Soft Drink (2 Litre Bottle)',
    description: 'Refreshing sparkling cola soft drink large bottle.',
    price: '95.00',
    stock_quantity: 70,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97',
    category: INITIAL_CATEGORIES[2],
  },
  {
    id: 'prod-real-mango-juice-1l',
    name: 'Real Fruit Power Alphonso Mango Juice (1 Litre Tetra Pack)',
    description: 'Nourishing mango juice made from real fruit pulp.',
    price: '115.00',
    stock_quantity: 40,
    is_in_stock: true,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1546173159-315724a31696',
    category: INITIAL_CATEGORIES[2],
  },
  {
    id: 'prod-tropicana-orange-1l',
    name: 'Tropicana 100% Orange Juice (1 Litre Pack)',
    description: 'Pure 100% orange juice with no added sugar.',
    price: '145.00',
    stock_quantity: 35,
    is_in_stock: true,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba',
    category: INITIAL_CATEGORIES[2],
  },
  {
    id: 'prod-surf-excel-1kg',
    name: 'Surf Excel Easy Wash Detergent Powder (1 kg Pack)',
    description: 'Superior stain removal detergent powder for everyday laundry.',
    price: '140.00',
    stock_quantity: 60,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae',
    category: INITIAL_CATEGORIES[4],
  },
  {
    id: 'prod-dettol-handwash-750ml',
    name: 'Dettol Liquid Handwash Refill Pouch (750 ml)',
    description: 'Germ protection liquid handwash refill pouch.',
    price: '119.00',
    stock_quantity: 80,
    is_in_stock: true,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae',
    category: INITIAL_CATEGORIES[4],
  },
  {
    id: 'prod-fortune-sunflower-oil-1l',
    name: 'Fortune Sunlite Refined Sunflower Oil (1 Litre Pouch)',
    description: 'Light and healthy refined sunflower cooking oil.',
    price: '135.00',
    stock_quantity: 100,
    is_in_stock: true,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5',
    category: INITIAL_CATEGORIES[6],
  },
  {
    id: 'prod-aashirvaad-atta-5kg',
    name: 'Aashirvaad Whole Wheat Shudda Chakki Atta (5 kg Pack)',
    description: '100% pure whole wheat chakki atta for soft rotis.',
    price: '245.00',
    stock_quantity: 65,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    category: INITIAL_CATEGORIES[6],
  },
  {
    id: 'prod-daawat-basmati-5kg',
    name: 'Daawat Rozana Super Basmati Rice (5 kg Pack)',
    description: 'Aromatic long-grain basmati rice for daily meals.',
    price: '380.00',
    stock_quantity: 45,
    is_in_stock: true,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
    category: INITIAL_CATEGORIES[6],
  },
];

const SHARED_CATEGORIES_KEY = 'dmart_shared_categories_v2';
const SHARED_PRODUCTS_KEY = 'dmart_shared_products_v2';

export const getSharedCategories = (): any[] => {
  try {
    const raw = localStorage.getItem(SHARED_CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  saveSharedCategories(INITIAL_CATEGORIES);
  return INITIAL_CATEGORIES;
};

export const saveSharedCategories = (categories: any[]) => {
  try {
    localStorage.setItem(SHARED_CATEGORIES_KEY, JSON.stringify(categories));
  } catch (e) {}
};

export const getSharedProducts = (): any[] => {
  try {
    const raw = localStorage.getItem(SHARED_PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  saveSharedProducts(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
};

export const saveSharedProducts = (products: any[]) => {
  try {
    localStorage.setItem(SHARED_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {}
};

export const productsApi = {
  getCategories: async () => {
    try {
      const res = await apiClient.get('/categories/');
      if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) return res.data;
    } catch (err: any) {
      // Fallback
    }
    return { success: true, data: getSharedCategories() };
  },

  createCategory: async (data: { name: string; description?: string }) => {
    try {
      const res = await apiClient.post('/categories/', data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const categories = getSharedCategories();
    const newCat = {
      id: `cat-${Date.now()}`,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      name: data.name,
      description: data.description || '',
    };
    categories.unshift(newCat);
    saveSharedCategories(categories);
    return { success: true, message: 'Category created', data: newCat };
  },

  updateCategory: async (id: string, data: { name: string; description?: string }) => {
    try {
      const res = await apiClient.put(`/categories/${id}/`, data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const categories = getSharedCategories();
    const cat = categories.find((c: any) => c.id === id || c.slug === id);
    if (cat) {
      cat.name = data.name;
      if (data.description !== undefined) cat.description = data.description;
      cat.slug = data.name.toLowerCase().replace(/\s+/g, '-');
      saveSharedCategories(categories);
    }
    return { success: true, message: 'Category updated', data: { id, ...data } };
  },

  getProducts: async (params?: ProductFilterParams) => {
    try {
      const res = await apiClient.get('/products/', { params });
      if (res.data && res.data.success && Array.isArray(res.data.data?.products) && res.data.data.products.length > 0) return res.data;
    } catch (err: any) {
      // Fallback
    }
    let filtered = getSharedProducts();
    if (params?.category) {
      filtered = filtered.filter(
        p => p.category?.slug === params.category || p.category?.id === params.category || p.category_id === params.category
      );
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return {
      success: true,
      data: {
        products: filtered,
        total: filtered.length,
        page: 1,
        pages: 1,
      },
    };
  },

  getProductDetail: async (id: string) => {
    try {
      const res = await apiClient.get(`/products/${id}/`);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const products = getSharedProducts();
    const found = products.find(p => p.id === id) || products[0];
    return { success: true, data: found };
  },

  createProduct: async (data: any) => {
    try {
      const res = await apiClient.post('/products/', data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const categories = getSharedCategories();
    const selectedCat = categories.find((c: any) => c.id === data.category_id || c.id === data.category?.id) || categories[0];
    const products = getSharedProducts();
    const newProd = {
      id: `prod-${Date.now()}`,
      name: data.name,
      description: data.description || '',
      price: String(data.price),
      stock_quantity: Number(data.stock_quantity) || 50,
      is_in_stock: (Number(data.stock_quantity) || 50) > 0,
      low_stock_threshold: Number(data.low_stock_threshold) || 10,
      image_url: data.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e',
      category: selectedCat,
    };
    products.unshift(newProd);
    saveSharedProducts(products);
    return { success: true, message: 'Product created', data: newProd };
  },

  updateProduct: async (id: string, data: any) => {
    try {
      const res = await apiClient.put(`/products/${id}/`, data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const categories = getSharedCategories();
    const products = getSharedProducts();
    const prod = products.find((p: any) => p.id === id);
    if (prod) {
      if (data.name) prod.name = data.name;
      if (data.description !== undefined) prod.description = data.description;
      if (data.price !== undefined) prod.price = String(data.price);
      if (data.stock_quantity !== undefined) prod.stock_quantity = Number(data.stock_quantity);
      if (data.low_stock_threshold !== undefined) prod.low_stock_threshold = Number(data.low_stock_threshold);
      if (data.image_url) prod.image_url = data.image_url;
      if (data.category_id) {
        const selectedCat = categories.find((c: any) => c.id === data.category_id) || prod.category;
        prod.category = selectedCat;
      }
      saveSharedProducts(products);
    }
    return { success: true, message: 'Product updated', data: { id, ...data } };
  },

  deleteProduct: async (id: string) => {
    try {
      const res = await apiClient.delete(`/products/${id}/`);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const products = getSharedProducts().filter((p: any) => p.id !== id);
    saveSharedProducts(products);
    return { success: true, message: 'Product deleted' };
  },
};

export const findProductById = (id: string) => {
  if (!id) return getSharedProducts()[0];
  const clean = String(id).trim().toLowerCase();
  const products = getSharedProducts();
  return (
    products.find(
      (p: any) =>
        p.id.toLowerCase() === clean ||
        p.name.toLowerCase().includes(clean) ||
        clean.includes(p.id.toLowerCase())
    ) || products[0]
  );
};
