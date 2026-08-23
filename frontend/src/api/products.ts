import { apiClient } from './client';
import { ProductFilterParams } from '../types/product';
import { broadcastDataChange } from './cloudSync';

export const INITIAL_CATEGORIES = [
  { id: 'cat-breakfast', name: 'Breakfast & Cereals', slug: 'breakfast-cereals', icon: '🥣', description: 'Cornflakes, oats, muesli, biscuits and instant breakfast' },
  { id: 'cat-cooking', name: 'Cooking Essentials', slug: 'cooking-essentials', icon: '🍳', description: 'Oils, ghee, spices, salt, jam, and cooking pastes' },
  { id: 'cat-dairy', name: 'Dairy, Bread & Eggs', slug: 'dairy-bakery', icon: '🥛', description: 'Fresh milk, eggs, brown bread, curd, butter and cheese' },
  { id: 'cat-drinks', name: 'Cold Drinks & Juices', slug: 'cold-drinks-juices', icon: '🥤', description: 'Soft drinks, fruit juices, packaged water, iced teas, energy drinks' },
  { id: 'cat-snacks', name: 'Snacks & Munchies', slug: 'snacks-munchies', icon: '🍟', description: 'Potato chips, namkeen, nachos, popcorn, bhujia, roasted nuts' },
  { id: 'cat-fruits-veg', name: 'Fruits & Vegetables', slug: 'fruits-vegetables', icon: '🥦', description: 'Fresh farm fruits, exotic veggies, greens and herbs' },
  { id: 'cat-sweet', name: 'Sweet Tooth', slug: 'sweet-tooth', icon: '🍫', description: 'Chocolates, ice creams, mithai, dessert tubs, hazelnut spreads' },
  { id: 'cat-bakery', name: 'Bakery & Biscuits', slug: 'bakery-biscuits', icon: '🍞', description: 'Cookies, cream biscuits, rusks, cakes, and croissants' },
  { id: 'cat-tea-coffee', name: 'Tea, Coffee & Drinks', slug: 'tea-coffee-milk-drinks', icon: '☕', description: 'Premium teas, instant coffee, health drinks like Bournvita' },
  { id: 'cat-staples', name: 'Atta, Rice & Dal', slug: 'atta-rice-dal', icon: '🌾', description: 'Whole wheat flour, basmati rice, toor dal, pulses' },
  { id: 'cat-dryfruits', name: 'Dry Fruits & Nuts', slug: 'dry-fruits-nuts', icon: '🥜', description: 'Almonds, cashews, raisins, walnuts, and trail mix' },
  { id: 'cat-pharmacy', name: 'Pharmacy & Wellness', slug: 'pharmacy-wellness', icon: '💊', description: 'Antacids, pain sprays, band-aids, health supplements' },
  { id: 'cat-pet', name: 'Pet Care Supplies', slug: 'pet-care-supplies', icon: '🐶', description: 'Dog food, cat food, pet grooming, and treats' },
  { id: 'cat-baby', name: 'Baby Care', slug: 'baby-care', icon: '👶', description: 'Diapers, baby wipes, bath and baby cereal food' },
  { id: 'cat-candies', name: 'Candies & Gums', slug: 'candies-gums', icon: '🍬', description: 'Chewing gums, mints, lollipops, fruit candies' },
  { id: 'cat-tobacco', name: 'Rolling paper & tobacco', slug: 'rolling-paper-tobacco', icon: '🚬', description: 'Rolling papers, cones, filters and accessories' },
];

export const INITIAL_PRODUCTS = [
  // ==========================================
  // 1. BREAKFAST & CEREALS
  // ==========================================
  {
    id: 'prod-mcvities-digestive-250g',
    name: 'Digestive Biscuits (McVities)',
    description: 'High-fibre wholesome wheat digestive biscuits.',
    price: 67.0,
    discount_price: 81.0,
    weight_size: '250 g',
    unit: '250 g',
    stock_quantity: 80,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=350',
    category: 'cat-breakfast',
  },
  {
    id: 'prod-saffola-muesli-400g',
    name: 'Muesli (Saffola FITTIFY)',
    description: 'Crunchy multigrain muesli with almonds and raisins.',
    price: 119.0,
    discount_price: 145.0,
    weight_size: '400 g',
    unit: '400 g',
    stock_quantity: 65,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1517093707577-49527ee1ef21?w=350',
    category: 'cat-breakfast',
  },
  {
    id: 'prod-sundrop-peanut-butter-200g',
    name: 'Peanut Butter (Sundrop)',
    description: 'Creamy roasted peanut spread rich in natural protein.',
    price: 112.0,
    discount_price: 136.0,
    weight_size: '200 g',
    unit: '200 g',
    stock_quantity: 50,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1588710929895-60e1d0f507cb?w=350',
    category: 'cat-breakfast',
  },
  {
    id: 'prod-yogabar-granola-300g',
    name: 'Granola (Yoga Bar)',
    description: 'Dark chocolate and cranberry baked whole-grain granola.',
    price: 146.0,
    discount_price: 178.0,
    weight_size: '300 g',
    unit: '300 g',
    stock_quantity: 45,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1517093707577-49527ee1ef21?w=350',
    category: 'cat-breakfast',
  },
  {
    id: 'prod-kelloggs-corn-flakes-500g',
    name: "Kellogg's Corn Flakes with Real Almond & Honey",
    description: 'Crispy sun-ripened corn flakes with crunchy roasted almonds and pure honey.',
    price: 185.0,
    discount_price: 220.0,
    weight_size: '500 g',
    unit: '500 g',
    stock_quantity: 60,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 12,
    image_url: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=350',
    category: 'cat-breakfast',
  },
  {
    id: 'prod-quaker-oats-1kg',
    name: 'Quaker Rolled Oats 100% Whole Grain',
    description: 'Nutritious breakfast oats rich in beta-glucan fiber and energy.',
    price: 99.0,
    discount_price: 120.0,
    weight_size: '1 kg',
    unit: '1 kg',
    stock_quantity: 75,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=350',
    category: 'cat-breakfast',
  },
  {
    id: 'prod-dabur-honey-400g',
    name: 'Dabur 100% Pure Honey Squeezy',
    description: 'Pure and natural honey packed with antioxidants and natural immunity boosters.',
    price: 165.0,
    discount_price: 199.0,
    weight_size: '400 g',
    unit: '400 g',
    stock_quantity: 55,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=350',
    category: 'cat-breakfast',
  },

  // ==========================================
  // 2. COOKING ESSENTIALS
  // ==========================================
  {
    id: 'prod-kissan-mixed-fruit-jam-200g',
    name: 'Kissan Mixed Fruit Jam',
    description: 'Sweet and tangy delicious 8-fruit real pulp jam spread.',
    price: 52.0,
    discount_price: 63.0,
    weight_size: '200 g',
    unit: '200 g',
    stock_quantity: 60,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1589135233689-d586111a473b?w=350',
    category: 'cat-cooking',
  },
  {
    id: 'prod-fortune-sunflower-oil-1l',
    name: 'Fortune Sunlite Refined Sunflower Oil',
    description: 'Light, healthy cooking oil enriched with vitamins A & D.',
    price: 145.0,
    discount_price: 170.0,
    weight_size: '1 L',
    unit: '1 L',
    stock_quantity: 90,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=350',
    category: 'cat-cooking',
  },
  {
    id: 'prod-amul-pure-ghee-500ml',
    name: 'Amul Pure Cow Ghee Pouch',
    description: 'Traditional aroma and pure goodness of rich cow ghee.',
    price: 310.0,
    discount_price: 345.0,
    weight_size: '500 ml',
    unit: '500 ml',
    stock_quantity: 45,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=350',
    category: 'cat-cooking',
  },
  {
    id: 'prod-tata-salt-1kg',
    name: 'Tata Salt Vacuum Evaporated Iodized Salt',
    description: 'Desh Ka Namak - pure vacuum evaporated iodized cooking salt.',
    price: 28.0,
    discount_price: 30.0,
    weight_size: '1 kg',
    unit: '1 kg',
    stock_quantity: 150,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 30,
    image_url: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=350',
    category: 'cat-cooking',
  },
  {
    id: 'prod-maggi-masala-pack-12',
    name: 'Maggi 2-Minute Masala Instant Noodles (Pack of 12)',
    description: 'Classic favorite noodle pack with signature Indian spice tastemaker.',
    price: 168.0,
    discount_price: 192.0,
    weight_size: '840 g',
    unit: '840 g',
    stock_quantity: 110,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 25,
    image_url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=350',
    category: 'cat-cooking',
  },
  {
    id: 'prod-kissan-tomato-ketchup-950g',
    name: 'Kissan Fresh Tomato Ketchup Bottle',
    description: 'Rich, thick red tomato ketchup made from 100% real ripe tomatoes.',
    price: 120.0,
    discount_price: 145.0,
    weight_size: '950 g',
    unit: '950 g',
    stock_quantity: 65,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 12,
    image_url: 'https://images.unsplash.com/photo-1589135233689-d586111a473b?w=350',
    category: 'cat-cooking',
  },

  // ==========================================
  // 3. DAIRY, BREAD & EGGS
  // ==========================================
  {
    id: 'prod-amul-taaza-1l',
    name: 'Amul Taaza Homogenised Toned Milk',
    description: 'Fresh toned milk processed and packed with vitamins and calcium.',
    price: 54.0,
    discount_price: 56.0,
    weight_size: '1 L',
    unit: '1 L',
    stock_quantity: 100,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=350',
    category: 'cat-dairy',
  },
  {
    id: 'prod-amul-salted-butter-100g',
    name: 'Amul Salted Butter - Utterly Butterly Delicious',
    description: 'Golden creamy pasteurized table butter made from fresh cream.',
    price: 58.0,
    discount_price: 60.0,
    weight_size: '100 g',
    unit: '100 g',
    stock_quantity: 120,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=350',
    category: 'cat-dairy',
  },
  {
    id: 'prod-amul-malai-paneer-200g',
    name: 'Amul Fresh Malai Paneer Block',
    description: 'Soft, creamy, protein-packed fresh cottage cheese cube.',
    price: 92.0,
    discount_price: 105.0,
    weight_size: '200 g',
    unit: '200 g',
    stock_quantity: 70,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=350',
    category: 'cat-dairy',
  },
  {
    id: 'prod-britannia-brown-bread-400g',
    name: 'Britannia 100% Whole Wheat Brown Bread',
    description: 'Healthy and soft baked whole grain brown bread loaf.',
    price: 48.0,
    discount_price: 55.0,
    weight_size: '400 g',
    unit: '400 g',
    stock_quantity: 60,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 12,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=350',
    category: 'cat-dairy',
  },
  {
    id: 'prod-farm-white-eggs-6pcs',
    name: 'Farm Fresh White Eggs (Pack of 6)',
    description: 'Hygienically sorted and sanitized high-protein farm eggs.',
    price: 49.0,
    discount_price: 60.0,
    weight_size: '6 pcs',
    unit: '6 pcs',
    stock_quantity: 80,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=350',
    category: 'cat-dairy',
  },
  {
    id: 'prod-mother-dairy-curd-400g',
    name: 'Mother Dairy Classic Fresh Dahi / Curd',
    description: 'Thick, creamy, probiotic-rich set curd for daily meals.',
    price: 35.0,
    discount_price: 40.0,
    weight_size: '400 g',
    unit: '400 g',
    stock_quantity: 90,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=350',
    category: 'cat-dairy',
  },

  // ==========================================
  // 4. COLD DRINKS & JUICES
  // ==========================================
  {
    id: 'prod-coca-cola-750ml',
    name: 'Coca-Cola Original Taste Carbonated Drink',
    description: 'Iconic refreshing cola beverage served ice-cold.',
    price: 40.0,
    discount_price: 45.0,
    weight_size: '750 ml',
    unit: '750 ml',
    stock_quantity: 110,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=350',
    category: 'cat-drinks',
  },
  {
    id: 'prod-thums-up-750ml',
    name: 'Thums Up Charged Soft Drink',
    description: 'Strong, fizzy cola taste that delivers a spicy kick.',
    price: 40.0,
    discount_price: 45.0,
    weight_size: '750 ml',
    unit: '750 ml',
    stock_quantity: 95,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=350',
    category: 'cat-drinks',
  },
  {
    id: 'prod-sprite-750ml',
    name: 'Sprite Lemon-Lime Soft Drink',
    description: 'Clear, refreshing, crisp lemon and lime flavoured carbonated soda.',
    price: 40.0,
    discount_price: 45.0,
    weight_size: '750 ml',
    unit: '750 ml',
    stock_quantity: 85,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=350',
    category: 'cat-drinks',
  },
  {
    id: 'prod-red-bull-250ml',
    name: 'Red Bull Energy Drink',
    description: 'Vitalizes body and mind with high-quality taurine and caffeine.',
    price: 125.0,
    discount_price: 130.0,
    weight_size: '250 ml',
    unit: '250 ml',
    stock_quantity: 60,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=350',
    category: 'cat-drinks',
  },
  {
    id: 'prod-tropicana-orange-1l',
    name: 'Tropicana 100% Orange Delight Fruit Juice',
    description: 'Pure, refreshing orange fruit juice bursting with natural Vitamin C.',
    price: 120.0,
    discount_price: 140.0,
    weight_size: '1 L',
    unit: '1 L',
    stock_quantity: 50,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=350',
    category: 'cat-drinks',
  },
  {
    id: 'prod-bisleri-1l',
    name: 'Bisleri Packaged Drinking Water',
    description: '10-step purified mineral packaged drinking water with added minerals.',
    price: 20.0,
    discount_price: 20.0,
    weight_size: '1 L',
    unit: '1 L',
    stock_quantity: 200,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 40,
    image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=350',
    category: 'cat-drinks',
  },

  // ==========================================
  // 5. SNACKS & MUNCHIES
  // ==========================================
  {
    id: 'prod-lays-magic-masala-50g',
    name: "Lay's India's Magic Masala Potato Chips",
    description: 'Crispy sliced potato chips tossed in authentic Indian spicy masala blend.',
    price: 20.0,
    discount_price: 20.0,
    weight_size: '50 g',
    unit: '50 g',
    stock_quantity: 130,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 25,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=350',
    category: 'cat-snacks',
  },
  {
    id: 'prod-lays-spanish-tomato-50g',
    name: "Lay's Spanish Tomato Tango Potato Chips",
    description: 'Tangy and sweet tomato flavored crispy potato wafer chips.',
    price: 20.0,
    discount_price: 20.0,
    weight_size: '50 g',
    unit: '50 g',
    stock_quantity: 120,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=350',
    category: 'cat-snacks',
  },
  {
    id: 'prod-kurkure-masala-munch-85g',
    name: 'Kurkure Masala Munch Crispy Snack',
    description: 'Tedha hai par mera hai - crunchy puffed corn and rice curls with spicy masala.',
    price: 20.0,
    discount_price: 20.0,
    weight_size: '85 g',
    unit: '85 g',
    stock_quantity: 110,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=350',
    category: 'cat-snacks',
  },
  {
    id: 'prod-doritos-cheese-nachos-60g',
    name: 'Doritos Cheese Supreme Crunchy Tortilla Nachos',
    description: 'Bold, cheesy crunchy triangular corn chips packed with flavor.',
    price: 35.0,
    discount_price: 40.0,
    weight_size: '60 g',
    unit: '60 g',
    stock_quantity: 85,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=350',
    category: 'cat-snacks',
  },
  {
    id: 'prod-haldiram-aloo-bhujia-400g',
    name: "Haldiram's Nagpur Spicy Aloo Bhujia",
    description: 'Classic crunchy crispy mint and potato noodle namkeen.',
    price: 95.0,
    discount_price: 115.0,
    weight_size: '400 g',
    unit: '400 g',
    stock_quantity: 90,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=350',
    category: 'cat-snacks',
  },
  {
    id: 'prod-pringles-sour-cream-107g',
    name: 'Pringles Sour Cream & Onion Potato Crisps',
    description: 'Stackable crisp potato wafers seasoned with savory sour cream and sweet onion.',
    price: 110.0,
    discount_price: 125.0,
    weight_size: '107 g',
    unit: '107 g',
    stock_quantity: 65,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=350',
    category: 'cat-snacks',
  },

  // ==========================================
  // 6. FRUITS & VEGETABLES
  // ==========================================
  {
    id: 'prod-fresh-bananas-1kg',
    name: 'Fresh Robusta Golden Bananas',
    description: 'Naturally ripened, sweet and energy-rich fresh yellow bananas.',
    price: 38.0,
    discount_price: 48.0,
    weight_size: '1 kg',
    unit: '1 kg',
    stock_quantity: 80,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=350',
    category: 'cat-fruits-veg',
  },
  {
    id: 'prod-shimla-apples-600g',
    name: 'Premium Shimla Royal Gala Apples',
    description: 'Crisp, juicy and sweet mountain-grown red apples.',
    price: 145.0,
    discount_price: 180.0,
    weight_size: '4 pcs (600 g)',
    unit: '600 g',
    stock_quantity: 50,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=350',
    category: 'cat-fruits-veg',
  },
  {
    id: 'prod-alphonso-mangoes-6pcs',
    name: 'Ratnagiri Alphonso Mangoes (GI Tagged)',
    description: 'The King of Fruits - fragrant, rich golden pulp table mangoes.',
    price: 399.0,
    discount_price: 499.0,
    weight_size: '6 pcs',
    unit: '6 pcs',
    stock_quantity: 35,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=350',
    category: 'cat-fruits-veg',
  },
  {
    id: 'prod-fresh-tomatoes-1kg',
    name: 'Farm Fresh Hybrid Red Tomatoes',
    description: 'Plump, firm and juicy farm red tomatoes perfect for curries and salads.',
    price: 32.0,
    discount_price: 42.0,
    weight_size: '1 kg',
    unit: '1 kg',
    stock_quantity: 110,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=350',
    category: 'cat-fruits-veg',
  },
  {
    id: 'prod-fresh-onions-1kg',
    name: 'Fresh Red Onions (Nashik Best)',
    description: 'Pungent, flavorful and firm red onions for authentic Indian tadka.',
    price: 36.0,
    discount_price: 45.0,
    weight_size: '1 kg',
    unit: '1 kg',
    stock_quantity: 120,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 25,
    image_url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=350',
    category: 'cat-fruits-veg',
  },
  {
    id: 'prod-fresh-potatoes-1kg',
    name: 'Fresh Premium Jyoti Potatoes / Aloo',
    description: 'Smooth-skinned, versatile potatoes ideal for baking, boiling and frying.',
    price: 28.0,
    discount_price: 35.0,
    weight_size: '1 kg',
    unit: '1 kg',
    stock_quantity: 130,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 30,
    image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=350',
    category: 'cat-fruits-veg',
  },

  // ==========================================
  // 7. SWEET TOOTH & CHOCOLATES
  // ==========================================
  {
    id: 'prod-dairy-milk-silk-60g',
    name: 'Cadbury Dairy Milk Silk Chocolate Bar',
    description: 'Smoother, silkier, and creamier melt-in-mouth milk chocolate bar.',
    price: 85.0,
    discount_price: 95.0,
    weight_size: '60 g',
    unit: '60 g',
    stock_quantity: 90,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=350',
    category: 'cat-sweet',
  },
  {
    id: 'prod-ferrero-rocher-8pcs',
    name: 'Ferrero Rocher Premium Hazelnut Pralines',
    description: 'Crispy wafer shell enveloped in milk chocolate and finely chopped hazelnuts.',
    price: 299.0,
    discount_price: 350.0,
    weight_size: 'Box of 8 (100 g)',
    unit: '100 g',
    stock_quantity: 45,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=350',
    category: 'cat-sweet',
  },
  {
    id: 'prod-kwality-walls-mango-700ml',
    name: "Kwality Wall's Alphonso Mango Ice Cream Tub",
    description: 'Creamy dessert tub infused with real, lush Alphonso mango pulp swirls.',
    price: 160.0,
    discount_price: 199.0,
    weight_size: '700 ml',
    unit: '700 ml',
    stock_quantity: 40,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=350',
    category: 'cat-sweet',
  },
  {
    id: 'prod-nutella-spread-350g',
    name: 'Nutella Hazelnut Spread with Cocoa',
    description: 'Irresistible creamy spread loaded with roasted hazelnuts and rich cocoa.',
    price: 240.0,
    discount_price: 275.0,
    weight_size: '350 g',
    unit: '350 g',
    stock_quantity: 50,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1589135233689-d586111a473b?w=350',
    category: 'cat-sweet',
  },

  // ==========================================
  // 8. BAKERY & BISCUITS
  // ==========================================
  {
    id: 'prod-oreo-vanilla-120g',
    name: 'Cadbury Oreo Original Vanilla Cream Biscuits',
    description: 'Twist, lick and dunk delicious rich chocolate cookies with sweet vanilla cream.',
    price: 35.0,
    discount_price: 40.0,
    weight_size: '120 g',
    unit: '120 g',
    stock_quantity: 110,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=350',
    category: 'cat-bakery',
  },
  {
    id: 'prod-britannia-good-day-120g',
    name: 'Britannia Good Day Butter Cookies',
    description: 'Crispy golden baked cookies loaded with rich churned butter and a smiling face.',
    price: 35.0,
    discount_price: 40.0,
    weight_size: '120 g',
    unit: '120 g',
    stock_quantity: 100,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=350',
    category: 'cat-bakery',
  },
  {
    id: 'prod-dark-fantasy-150g',
    name: 'Sunfeast Dark Fantasy Choco Fills Biscuits',
    description: 'Molten liquid chocolate lava encapsulated in crisp baked chocolate biscuit crust.',
    price: 75.0,
    discount_price: 90.0,
    weight_size: '150 g',
    unit: '150 g',
    stock_quantity: 75,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=350',
    category: 'cat-bakery',
  },
  {
    id: 'prod-britannia-rusk-200g',
    name: 'Britannia Toastea Premium Wheat Rusk',
    description: 'Crisp twice-baked tea companion biscuits infused with fragrant elaichi cardamom.',
    price: 45.0,
    discount_price: 55.0,
    weight_size: '200 g',
    unit: '200 g',
    stock_quantity: 80,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=350',
    category: 'cat-bakery',
  },

  // ==========================================
  // 9. TEA, COFFEE & DRINKS
  // ==========================================
  {
    id: 'prod-tata-tea-gold-250g',
    name: 'Tata Tea Gold Premium Assam Blend Tea',
    description: 'Rich blend of delicate CTC tea granules with gently rolled fragrant long leaves.',
    price: 155.0,
    discount_price: 185.0,
    weight_size: '250 g',
    unit: '250 g',
    stock_quantity: 70,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=350',
    category: 'cat-tea-coffee',
  },
  {
    id: 'prod-nescafe-classic-100g',
    name: 'Nescafe Classic Pure Instant Coffee Jar',
    description: '100% pure roasted coffee beans providing bold, refreshing morning aroma.',
    price: 195.0,
    discount_price: 225.0,
    weight_size: '100 g',
    unit: '100 g',
    stock_quantity: 65,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 12,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=350',
    category: 'cat-tea-coffee',
  },
  {
    id: 'prod-bournvita-500g',
    name: 'Cadbury Bournvita Chocolate Health Drink Jar',
    description: 'Nutrition drink enriched with Vitamin D, Iron, and Zinc for growing minds.',
    price: 245.0,
    discount_price: 285.0,
    weight_size: '500 g',
    unit: '500 g',
    stock_quantity: 50,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=350',
    category: 'cat-tea-coffee',
  },

  // ==========================================
  // 10. ATTA, RICE & DAL (STAPLES)
  // ==========================================
  {
    id: 'prod-aashirvaad-atta-5kg',
    name: 'Aashirvaad Superior MP Shudh Chakki Atta',
    description: '100% pure whole wheat grain ground slowly to lock in natural fiber and soft rotis.',
    price: 265.0,
    discount_price: 310.0,
    weight_size: '5 kg',
    unit: '5 kg',
    stock_quantity: 75,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=350',
    category: 'cat-staples',
  },
  {
    id: 'prod-fortune-basmati-rice-5kg',
    name: 'Fortune Rozana Daily Long Grain Basmati Rice',
    description: 'Fluffy, aromatic and non-sticky long slender grain basmati rice.',
    price: 240.0,
    discount_price: 290.0,
    weight_size: '5 kg',
    unit: '5 kg',
    stock_quantity: 60,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 12,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=350',
    category: 'cat-staples',
  },
  {
    id: 'prod-tata-toor-dal-1kg',
    name: 'Tata Sampann Unpolished Toor Dal / Arhar Dal',
    description: 'Rich in natural protein, unpolished without water, oil or stone powder polishing.',
    price: 165.0,
    discount_price: 195.0,
    weight_size: '1 kg',
    unit: '1 kg',
    stock_quantity: 85,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=350',
    category: 'cat-staples',
  },

  // ==========================================
  // 11. DRY FRUITS & NUTS
  // ==========================================
  {
    id: 'prod-happilo-almonds-250g',
    name: 'Happilo Premium California Whole Almonds',
    description: 'Crunchy raw California badam high in Vitamin E and heart-healthy dietary fiber.',
    price: 240.0,
    discount_price: 299.0,
    weight_size: '250 g',
    unit: '250 g',
    stock_quantity: 55,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=350',
    category: 'cat-dryfruits',
  },
  {
    id: 'prod-happilo-cashews-250g',
    name: 'Happilo Premium King Whole Cashews / Kaju',
    description: 'Whole jumbo cashew nuts with a smooth, buttery natural flavor.',
    price: 280.0,
    discount_price: 350.0,
    weight_size: '250 g',
    unit: '250 g',
    stock_quantity: 50,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=350',
    category: 'cat-dryfruits',
  },

  // ==========================================
  // 12. PHARMACY & WELLNESS
  // ==========================================
  {
    id: 'prod-dettol-liquid-250ml',
    name: 'Dettol Antiseptic Liquid Disinfectant',
    description: 'Trusted personal and first-aid germ protection against infections and cuts.',
    price: 95.0,
    discount_price: 110.0,
    weight_size: '250 ml',
    unit: '250 ml',
    stock_quantity: 80,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=350',
    category: 'cat-pharmacy',
  },
  {
    id: 'prod-moov-spray-80g',
    name: 'Moov Instant Pain Relief Spray',
    description: 'Fast acting Ayurvedic formula for backache, joint pain and muscle stiffness.',
    price: 165.0,
    discount_price: 195.0,
    weight_size: '80 g',
    unit: '80 g',
    stock_quantity: 60,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=350',
    category: 'cat-pharmacy',
  },
  {
    id: 'prod-eno-lemon-6sachets',
    name: 'ENO Lemon Fast Action Antacid (Pack of 6)',
    description: 'Gets to work in 6 seconds to provide quick relief from acidity and heartburn.',
    price: 48.0,
    discount_price: 54.0,
    weight_size: '6 sachets',
    unit: '6 sachets',
    stock_quantity: 100,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=350',
    category: 'cat-pharmacy',
  },

  // ==========================================
  // 13. PET CARE SUPPLIES
  // ==========================================
  {
    id: 'prod-pedigree-dog-food-1-2kg',
    name: 'Pedigree Adult Dry Dog Food Meat & Rice',
    description: 'Complete and balanced nutrition with protein and dietary fiber for strong muscles.',
    price: 399.0,
    discount_price: 465.0,
    weight_size: '1.2 kg',
    unit: '1.2 kg',
    stock_quantity: 45,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=350',
    category: 'cat-pet',
  },
  {
    id: 'prod-whiskas-cat-food-1-2kg',
    name: 'Whiskas Ocean Fish Adult Dry Cat Food',
    description: 'Delicious real fish meal formulation packed with essential fatty acids.',
    price: 375.0,
    discount_price: 435.0,
    weight_size: '1.2 kg',
    unit: '1.2 kg',
    stock_quantity: 40,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=350',
    category: 'cat-pet',
  },

  // ==========================================
  // 14. BABY CARE
  // ==========================================
  {
    id: 'prod-pampers-diapers-m-22',
    name: 'Pampers All Round Protection Pants Diapers (M)',
    description: 'Anti-rash lotion layer and 12-hour leak lock technology for baby comfort.',
    price: 349.0,
    discount_price: 410.0,
    weight_size: '22 pcs',
    unit: '22 pcs',
    stock_quantity: 50,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=350',
    category: 'cat-baby',
  },
  {
    id: 'prod-himalaya-baby-wipes-72',
    name: 'Himalaya Gentle Baby Wet Wipes (Pack of 72)',
    description: 'Enriched with Aloe Vera and Indian Lotus to keep delicate skin soft and clean.',
    price: 135.0,
    discount_price: 160.0,
    weight_size: '72 wipes',
    unit: '72 wipes',
    stock_quantity: 75,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=350',
    category: 'cat-baby',
  },

  // ==========================================
  // 15. CANDIES & GUMS
  // ==========================================
  {
    id: 'prod-orbit-spearmint-22g',
    name: 'Orbit Spearmint Flavour Sugar Free Chewing Gum',
    description: 'Refreshing spearmint flavored sugar-free dental gum.',
    price: 50.0,
    discount_price: 50.0,
    weight_size: '22 g',
    unit: '22 g',
    stock_quantity: 85,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=350',
    category: 'cat-candies',
  },
  {
    id: 'prod-chupa-chups-sour-bites-56g',
    name: 'Chupa Chups Sour Bites Mixed Fruit Sour Candy',
    description: 'Multi-colored chewy sour fruit bites with tangy burst.',
    price: 35.0,
    discount_price: 35.0,
    weight_size: '56 g',
    unit: '56 g',
    stock_quantity: 70,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=350',
    category: 'cat-candies',
  },
];

const SHARED_PRODUCTS_KEY = 'dmart_shared_products_v5';
const SHARED_CATEGORIES_KEY = 'dmart_shared_categories_v3';

export const getSharedCategories = (): any[] => {
  try {
    const raw = localStorage.getItem(SHARED_CATEGORIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= INITIAL_CATEGORIES.length) return parsed;
    }
  } catch (e) {}
  saveSharedCategories(INITIAL_CATEGORIES);
  return INITIAL_CATEGORIES;
};

export const saveSharedCategories = (categories: any[]) => {
  try {
    localStorage.setItem(SHARED_CATEGORIES_KEY, JSON.stringify(categories));
    broadcastDataChange(SHARED_CATEGORIES_KEY, categories);
  } catch (e) {}
};

export const getSharedProducts = (): any[] => {
  try {
    const raw = localStorage.getItem(SHARED_PRODUCTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= INITIAL_PRODUCTS.length) return parsed;
    }
  } catch (e) {}
  saveSharedProducts(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
};

export const saveSharedProducts = (products: any[]) => {
  try {
    localStorage.setItem(SHARED_PRODUCTS_KEY, JSON.stringify(products));
    broadcastDataChange(SHARED_PRODUCTS_KEY, products);
  } catch (e) {}
};

export const findProductById = (id: string): any => {
  const prods = getSharedProducts();
  return prods.find((p: any) => p.id === id) || prods[0];
};

export const productsApi = {
  getCategories: async () => {
    try {
      const res = await apiClient.get('/categories/');
      if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) return res.data;
    } catch (err: any) {}
    return { success: true, data: getSharedCategories() };
  },

  createCategory: async (data: { name: string; description?: string; icon?: string }) => {
    try {
      const res = await apiClient.post('/categories/', data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {}
    const cats = getSharedCategories();
    const newCat = {
      id: `cat-${Date.now()}`,
      name: data.name,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon: data.icon || '🛍️',
      description: data.description || '',
    };
    cats.push(newCat);
    saveSharedCategories(cats);
    return { success: true, data: newCat };
  },

  updateCategory: async (id: string, data: { name?: string; description?: string }) => {
    try {
      const res = await apiClient.put(`/categories/${id}/`, data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {}
    const cats = getSharedCategories();
    const idx = cats.findIndex((c: any) => c.id === id);
    if (idx !== -1) {
      cats[idx] = { ...cats[idx], ...data };
      saveSharedCategories(cats);
    }
    return { success: true, data: cats[idx] };
  },

  deleteCategory: async (id: string) => {
    try {
      const res = await apiClient.delete(`/categories/${id}/`);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {}
    const cats = getSharedCategories().filter((c: any) => c.id !== id);
    saveSharedCategories(cats);
    return { success: true };
  },

  getProducts: async (params?: ProductFilterParams) => {
    try {
      const res = await apiClient.get('/products/', { params });
      if (res.data && res.data.success && res.data.data?.products?.length > 0) return res.data;
    } catch (err: any) {}

    let prods = getSharedProducts();
    if (params?.category) {
      const catId = params.category;
      prods = prods.filter(
        (p: any) =>
          p.category === catId ||
          p.category?.id === catId ||
          p.category?.slug === catId ||
          p.category_id === catId
      );
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      prods = prods.filter(
        (p: any) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    if (params?.in_stock) {
      prods = prods.filter((p: any) => p.is_in_stock ?? p.stock_quantity > 0);
    }
    if (params?.min_price !== undefined) {
      prods = prods.filter((p: any) => Number(p.price) >= params.min_price!);
    }
    if (params?.max_price !== undefined) {
      prods = prods.filter((p: any) => Number(p.price) <= params.max_price!);
    }
    if (params?.sort_by) {
      if (params.sort_by === 'price_asc') {
        prods.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (params.sort_by === 'price_desc') {
        prods.sort((a, b) => Number(b.price) - Number(a.price));
      }
    }

    return {
      success: true,
      data: {
        products: prods,
        total: prods.length,
        page: params?.page || 1,
        page_size: params?.page_size || 50,
      },
    };
  },

  getProduct: async (id: string) => {
    try {
      const res = await apiClient.get(`/products/${id}/`);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {}
    const prods = getSharedProducts();
    const found = prods.find((p: any) => p.id === id) || prods[0];
    return { success: true, data: found };
  },

  getProductDetail: async (id: string) => {
    try {
      const res = await apiClient.get(`/products/${id}/`);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {}
    const prods = getSharedProducts();
    const found = prods.find((p: any) => p.id === id) || prods[0];
    return { success: true, data: found };
  },

  createProduct: async (data: any) => {
    try {
      const res = await apiClient.post('/products/', data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {}
    const prods = getSharedProducts();
    const newProd = {
      id: `prod-${Date.now()}`,
      name: data.name,
      description: data.description || '',
      price: Number(data.price),
      discount_price: data.discount_price ? Number(data.discount_price) : undefined,
      weight_size: data.weight_size || '1 unit',
      stock_quantity: Number(data.stock_quantity || 50),
      is_in_stock: true,
      low_stock_threshold: 10,
      image_url: data.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=350',
      category: data.category_id || data.category || 'cat-dairy',
    };
    prods.unshift(newProd);
    saveSharedProducts(prods);
    return { success: true, data: newProd };
  },

  updateProduct: async (id: string, data: any) => {
    try {
      const res = await apiClient.put(`/products/${id}/`, data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {}
    const prods = getSharedProducts();
    const idx = prods.findIndex((p: any) => p.id === id);
    if (idx !== -1) {
      prods[idx] = { ...prods[idx], ...data };
      saveSharedProducts(prods);
    }
    return { success: true, data: prods[idx] };
  },

  deleteProduct: async (id: string) => {
    try {
      const res = await apiClient.delete(`/products/${id}/`);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {}
    const prods = getSharedProducts().filter((p: any) => p.id !== id);
    saveSharedProducts(prods);
    return { success: true };
  },
};
