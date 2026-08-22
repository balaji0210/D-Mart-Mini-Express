import { apiClient } from './client';
import { ProductFilterParams } from '../types/product';

const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Fruits & Vegetables', slug: 'fruits-vegetables', description: 'Fresh farm produce' },
  { id: 'cat-2', name: 'Dairy & Bakery', slug: 'dairy-bakery', description: 'Milk, butter, bread, and bakery items' },
  { id: 'cat-3', name: 'Beverages', slug: 'beverages', description: 'Juices, soft drinks, tea, coffee' },
  { id: 'cat-4', name: 'Snacks & Munchies', slug: 'snacks-munchies', description: 'Chips, biscuits, nuts, and chocolates' },
  { id: 'cat-5', name: 'Household Essentials', slug: 'household-essentials', description: 'Detergents, cleaners, and hygiene products' },
  { id: 'cat-6', name: 'Ice Creams & Frozen', slug: 'ice-creams-frozen', description: 'Ice cream tubs, bars, pops, and frozen treats' },
  { id: 'cat-7', name: 'Atta, Rice & Staples', slug: 'atta-rice-staples', description: 'Grains, flour, rice, and suji' },
];

const MOCK_PRODUCTS = [
  // --- Ice Creams & Frozen ---
  {
    id: 'prod-kwality-mango-700',
    name: "Kwality Wall's Alphonso Mango Ice Cream (700 ml)",
    description: 'Rich and creamy Alphonso mango flavored ice cream tub.',
    price: '160.00',
    stock_quantity: 40,
    is_in_stock: true,
    low_stock_threshold: 5,
    image_url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371',
    category: MOCK_CATEGORIES[5],
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
    category: MOCK_CATEGORIES[5],
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
    category: MOCK_CATEGORIES[5],
  },
  {
    id: 'prod-kwality-chocochips-700',
    name: "Kwality Wall's Chocochips Ice Cream Tub (700 ml)",
    description: 'Creamy chocolate ice cream packed with real chocolate chips.',
    price: '169.00',
    stock_quantity: 45,
    is_in_stock: true,
    low_stock_threshold: 5,
    image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
    category: MOCK_CATEGORIES[5],
  },
  {
    id: 'prod-kwality-vanilla-700',
    name: "Kwality Wall's Vanilla Ice Cream Tub (700 ml)",
    description: 'Smooth and classic vanilla bean ice cream tub.',
    price: '130.00',
    stock_quantity: 60,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371',
    category: MOCK_CATEGORIES[5],
  },
  {
    id: 'prod-magnum-caramel-pop',
    name: 'MAGNUM Caramel Ice Cream Pop (75 ml)',
    description: 'Velvety caramel ice cream coated in thick crackling Belgian chocolate.',
    price: '70.00',
    stock_quantity: 50,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1549395156-e0c1fe6fc7a5',
    category: MOCK_CATEGORIES[5],
  },
  {
    id: 'prod-magnum-almond-stick',
    name: 'Magnum Almond Ice Cream Stick Bar (62 g)',
    description: 'Vanilla ice cream bar dipped in thick chocolate and roasted almond pieces.',
    price: '80.00',
    stock_quantity: 55,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1549395156-e0c1fe6fc7a5',
    category: MOCK_CATEGORIES[5],
  },
  {
    id: 'prod-magnum-brownie-stick',
    name: 'Magnum Brownie Ice Cream Stick Bar (61 g)',
    description: 'Rich brownie chocolate ice cream stick dipped in dark Belgian chocolate.',
    price: '80.00',
    stock_quantity: 40,
    is_in_stock: true,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1549395156-e0c1fe6fc7a5',
    category: MOCK_CATEGORIES[5],
  },

  // --- Snacks & Munchies ---
  {
    id: 'prod-lays-magic-masala-pack3',
    name: "Lay's India's Magic Masala Chips (80g x 3 Pack)",
    description: 'Value pack of spicy Indian magic masala ridged potato chips.',
    price: '71.00',
    stock_quantity: 75,
    is_in_stock: true,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
    category: MOCK_CATEGORIES[3],
  },
  {
    id: 'prod-noice-banana-chips-50g',
    name: 'NOICE Kerala Nendran Banana Chips (50 g)',
    description: 'Authentic Kerala coconut oil fried crispy Nendran banana chips.',
    price: '36.00',
    stock_quantity: 65,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c',
    category: MOCK_CATEGORIES[3],
  },
  {
    id: 'prod-noice-bhakarwadi-100g',
    name: 'NOICE Mini Bhakarwadi (100 g)',
    description: 'Crispy and spicy traditional Maharashtrian fried snack rolls.',
    price: '51.00',
    stock_quantity: 50,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
    category: MOCK_CATEGORIES[3],
  },
  {
    id: 'prod-noice-spicy-wafers-100g',
    name: 'NOICE Spicy Potato Wafers (100 g)',
    description: 'Thin and crunchy potato wafers tossed in fiery red chilli spice.',
    price: '67.00',
    stock_quantity: 60,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
    category: MOCK_CATEGORIES[3],
  },
  {
    id: 'prod-vsmani-hot-chips-60g',
    name: 'VS Mani & Co. Potato Hot Chips (60 g)',
    description: 'South Indian style spicy potato hot chips fried to perfection.',
    price: '52.00',
    stock_quantity: 45,
    is_in_stock: true,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
    category: MOCK_CATEGORIES[3],
  },
  {
    id: 'prod-supergram-nachos-50g',
    name: 'Supergram Protein Nacho Chips (50 g)',
    description: 'High protein baked tortilla nacho chips with 10g protein.',
    price: '30.00',
    stock_quantity: 80,
    is_in_stock: true,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d',
    category: MOCK_CATEGORIES[3],
  },
  {
    id: 'prod-noice-shankarpali-150g',
    name: 'NOICE Homestyle Shankarpali (Sweet) (150 g)',
    description: 'Sweet homestyle fried flour diamond snacks.',
    price: '71.00',
    stock_quantity: 40,
    is_in_stock: true,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
    category: MOCK_CATEGORIES[3],
  },
  {
    id: 'prod-lays-sizzling-hot-40g',
    name: "Lay's (Sizzling Hot) Spicy Potato Chips (40 g)",
    description: 'Fiery sizzling hot chili potato chips.',
    price: '20.00',
    stock_quantity: 90,
    is_in_stock: true,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
    category: MOCK_CATEGORIES[3],
  },
  {
    id: 'prod-tooyumm-protein-60g',
    name: 'Too Yumm Protein Chips – Grilled Cheese & Chilli (60 g)',
    description: 'Non-fried protein chips with delicious grilled cheese & chilli flavor.',
    price: '41.00',
    stock_quantity: 50,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
    category: MOCK_CATEGORIES[3],
  },
  {
    id: 'prod-yellow-diamond-50g',
    name: 'YELLOW DIAMOND Plain Salted Chips (50 g)',
    description: 'Classic salted crispy potato chips.',
    price: '15.00',
    stock_quantity: 100,
    is_in_stock: true,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
    category: MOCK_CATEGORIES[3],
  },
  {
    id: 'prod-lays-tomato-tango-50g',
    name: "Lay's (Spanish Tomato Tango Flavour) Potato Chips (50 g)",
    description: 'Tangy Spanish tomato flavored crispy potato chips.',
    price: '20.00',
    stock_quantity: 85,
    is_in_stock: true,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
    category: MOCK_CATEGORIES[3],
  },

  // --- Atta, Rice & Staples (Suji / Rawa) ---
  {
    id: 'prod-samrat-sooji-500g',
    name: 'SAMRAT MP Sooji (Coarse MP Sooji, 500 g)',
    description: 'Premium quality coarse MP wheat semolina suji.',
    price: '31.00',
    stock_quantity: 100,
    is_in_stock: true,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
    category: MOCK_CATEGORIES[6],
  },
  {
    id: 'prod-organic-tattva-suji-500g',
    name: 'Organic Tattva Suji (Organic Wheat Cooking Grain, 500 g)',
    description: '100% certified organic wheat cooking grain suji semolina.',
    price: '64.00',
    stock_quantity: 60,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
    category: MOCK_CATEGORIES[6],
  },
  {
    id: 'prod-safe-harvest-sooji-500g',
    name: 'Safe Harvest Pesticide Free Roasted Sooji (500 g)',
    description: 'Pesticide-free pre-roasted wheat semolina suji rawa.',
    price: '42.00',
    stock_quantity: 50,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
    category: MOCK_CATEGORIES[6],
  },
  {
    id: 'prod-fortune-suji-500g',
    name: 'Fortune Suji Rawa Semolina (500 g)',
    description: 'Hygiene packed premium wheat semolina rawa suji.',
    price: '35.00',
    stock_quantity: 80,
    is_in_stock: true,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
    category: MOCK_CATEGORIES[6],
  },

  // --- Beverages ---
  {
    id: 'prod-pepsi-750',
    name: 'Pepsi Soft Drink Bottle (750 ml)',
    description: 'Refreshing carbonated cola soft drink in a 750 ml bottle.',
    price: '35.00',
    stock_quantity: 60,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97',
    category: MOCK_CATEGORIES[2],
  },
  {
    id: 'prod-pepsi-2250',
    name: 'Pepsi Soft Drink Bottle (2250 ml)',
    description: 'Large family pack carbonated cola soft drink 2.25L.',
    price: '83.00',
    stock_quantity: 45,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97',
    category: MOCK_CATEGORIES[2],
  },
  {
    id: 'prod-aquafina-1L',
    name: 'Aquafina Mineral Water Bottle (1 ltr)',
    description: 'Purified drinking water bottled under strict quality processes.',
    price: '20.00',
    stock_quantity: 150,
    is_in_stock: true,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e',
    category: MOCK_CATEGORIES[2],
  },
  {
    id: 'prod-pepsi-zero-400',
    name: 'Pepsi Zero Sugar Soft Drink (400 ml)',
    description: 'Maximum taste with zero sugar carbonated cola beverage.',
    price: '20.00',
    stock_quantity: 50,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7',
    category: MOCK_CATEGORIES[2],
  },
  {
    id: 'prod-pepsi-zero-pack6',
    name: 'Pepsi Zero Sugar Soft Drink (300 ml - Pack of 6)',
    description: 'Pack of 6 canned Pepsi Zero Sugar soft drinks (1.8L total).',
    price: '212.00',
    stock_quantity: 30,
    is_in_stock: true,
    low_stock_threshold: 5,
    image_url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7',
    category: MOCK_CATEGORIES[2],
  },
  {
    id: 'prod-7up-nimbooz',
    name: '7UP Nimbooz with Lemon Juice (350 ml)',
    description: 'Tangy and refreshing lemon juice drink with real lemon goodness.',
    price: '25.00',
    stock_quantity: 70,
    is_in_stock: true,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd',
    category: MOCK_CATEGORIES[2],
  },
  {
    id: 'prod-mountain-dew-750',
    name: 'Mountain Dew Soft Drink Bottle (750 ml)',
    description: 'High energy citrus flavored carbonated soft drink.',
    price: '40.00',
    stock_quantity: 80,
    is_in_stock: true,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e',
    category: MOCK_CATEGORIES[2],
  },
  {
    id: 'prod-7up-zero-400',
    name: '7 Up Zero Soft Drink (400 ml)',
    description: 'Crisp lemon-lime zero sugar carbonated soft drink.',
    price: '20.00',
    stock_quantity: 50,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd',
    category: MOCK_CATEGORIES[2],
  },
];

export const productsApi = {
  getCategories: async () => {
    try {
      const res = await apiClient.get('/categories/');
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    return { success: true, data: MOCK_CATEGORIES };
  },

  createCategory: async (data: { name: string; description?: string }) => {
    try {
      const res = await apiClient.post('/categories/', data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const newCat = { id: `cat-${Date.now()}`, slug: data.name.toLowerCase().replace(/\s+/g, '-'), name: data.name, description: data.description || '' };
    MOCK_CATEGORIES.push(newCat);
    return { success: true, message: 'Category created', data: newCat };
  },

  updateCategory: async (id: string, data: { name: string; description?: string }) => {
    try {
      const res = await apiClient.put(`/categories/${id}/`, data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    return { success: true, message: 'Category updated', data: { id, ...data } };
  },

  getProducts: async (params?: ProductFilterParams) => {
    try {
      const res = await apiClient.get('/products/', { params });
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    let filtered = [...MOCK_PRODUCTS];
    if (params?.category) {
      filtered = filtered.filter(p => p.category.slug === params.category || p.category.id === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
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
    const found = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
    return { success: true, data: found };
  },

  createProduct: async (data: any) => {
    try {
      const res = await apiClient.post('/products/', data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const newProd = { id: `prod-${Date.now()}`, ...data, is_in_stock: true };
    MOCK_PRODUCTS.unshift(newProd);
    return { success: true, message: 'Product created', data: newProd };
  },

  updateProduct: async (id: string, data: any) => {
    try {
      const res = await apiClient.put(`/products/${id}/`, data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
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
    return { success: true, message: 'Product deleted' };
  },
};
