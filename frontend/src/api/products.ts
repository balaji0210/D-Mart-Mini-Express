import { apiClient } from './client';
import { ProductFilterParams } from '../types/product';
import { broadcastDataChange } from './cloudSync';

export const INITIAL_CATEGORIES = [
  { id: 'cat-baby', name: 'Baby Care', slug: 'baby-care', icon: '👶', description: 'Diapers, baby wipes, bath and baby food' },
  { id: 'cat-breakfast', name: 'Breakfast & Cereals', slug: 'breakfast-cereals', icon: '🥣', description: 'Cornflakes, oats, muesli, and instant breakfast' },
  { id: 'cat-cooking', name: 'Cooking Essentials', slug: 'cooking-essentials', icon: '🍳', description: 'Oils, ghee, spices, salt and cooking pastes' },
  { id: 'cat-dairy', name: 'Dairy & Bakery', slug: 'dairy-bakery', icon: '🥛', description: 'Fresh milk, eggs, bread, curd, butter and cheese' },
  { id: 'cat-dryfruits', name: 'Dry Fruits & Nuts', slug: 'dry-fruits-nuts', icon: '🥜', description: 'Almonds, cashews, raisins, walnuts, and trail mix' },
  { id: 'cat-drinks', name: 'Cold Drinks & Juices', slug: 'cold-drinks-juices', icon: '🥤', description: 'Soft drinks, fruit juices, packaged water, iced teas' },
  { id: 'cat-candies', name: 'Candies & Gums', slug: 'candies-gums', icon: '🍬', description: 'Chewing gums, mints, lollipops, fruit candies' },
  { id: 'cat-tobacco', name: 'Rolling paper & tobacco', slug: 'rolling-paper-tobacco', icon: '🚬', description: 'Rolling papers, cones, filters and accessories' },
  { id: 'cat-snacks', name: 'Snacks & Munchies', slug: 'snacks-munchies', icon: '🍟', description: 'Potato chips, namkeen, nachos, popcorn, bhujia' },
  { id: 'cat-fruits-veg', name: 'Fruits & Vegetables', slug: 'fruits-vegetables', icon: '🥦', description: 'Fresh farm fruits, exotic veggies, greens and herbs' },
  { id: 'cat-sweet', name: 'Sweet Tooth', slug: 'sweet-tooth', icon: '🍫', description: 'Chocolates, ice creams, mithai, dessert syrups' },
  { id: 'cat-bakery', name: 'Bakery & Biscuits', slug: 'bakery-biscuits', icon: '🍞', description: 'Cookies, cream biscuits, rusks, cakes, and croissants' },
  { id: 'cat-tea-coffee', name: 'Tea, Coffee & Milk Drinks', slug: 'tea-coffee-milk-drinks', icon: '☕', description: 'Premium teas, instant coffee, health drinks like Bournvita' },
  { id: 'cat-staples', name: 'Atta, Rice & Dal', slug: 'atta-rice-dal', icon: '🌾', description: 'Whole wheat flour, basmati rice, toor dal, pulses' },
  { id: 'cat-pharmacy', name: 'Pharmacy & Wellness', slug: 'pharmacy-wellness', icon: '💊', description: 'Antacids, pain sprays, band-aids, health supplements' },
  { id: 'cat-pet', name: 'Pet Care Supplies', slug: 'pet-care-supplies', icon: '🐶', description: 'Dog food, cat food, pet grooming, and treats' },
];

export const INITIAL_PRODUCTS = [
  // --- BREAKFAST & CEREALS (Reference Matched) ---
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

  // --- COOKING ESSENTIALS (Reference Matched) ---
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

  // --- COLD DRINKS & JUICES ---
  {
    id: 'prod-diet-coke-330',
    name: 'Diet Coke Diets & Lights',
    description: 'Crisp, refreshing sugar-free cola with light carbonation.',
    price: 50.0,
    discount_price: 50.0,
    weight_size: '330 ml',
    unit: '330 ml',
    stock_quantity: 60,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=350',
    category: 'cat-drinks',
  },
  {
    id: 'prod-bisleri-1l',
    name: 'Bisleri Packaged Water',
    description: '10-step purified mineral packaged drinking water.',
    price: 20.0,
    discount_price: 20.0,
    weight_size: '1 ltr',
    unit: '1 ltr',
    stock_quantity: 120,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=350',
    category: 'cat-drinks',
  },
  {
    id: 'prod-ice-cubes-icelings-1kg',
    name: 'Ice Cubes by Icelings',
    description: 'Pure, clear, food-grade ice cubes packed hygienically.',
    price: 65.0,
    discount_price: 75.0,
    weight_size: '1 kg',
    unit: '1 kg',
    stock_quantity: 45,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=350',
    category: 'cat-drinks',
  },
  {
    id: 'prod-sprite-750ml',
    name: 'Sprite Lime Flavored Soft Drink',
    description: 'Clear, crisp lemon-lime flavored sparkling soft drink.',
    price: 38.0,
    discount_price: 40.0,
    weight_size: '750 ml',
    unit: '750 ml',
    stock_quantity: 80,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=350',
    category: 'cat-drinks',
  },
  {
    id: 'prod-bisleri-10l',
    name: 'Bisleri Packaged Water',
    description: 'Large family-size packaged drinking water dispenser jar.',
    price: 130.0,
    discount_price: 130.0,
    weight_size: '10 ltr',
    unit: '10 ltr',
    stock_quantity: 30,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 5,
    image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=350',
    category: 'cat-drinks',
  },
  {
    id: 'prod-amul-lactose-free-250',
    name: 'Amul Lactose Free Milk',
    description: 'Nutritious, easy-to-digest lactose free cow milk pack.',
    price: 26.0,
    discount_price: 26.0,
    weight_size: '250 ml',
    unit: '250 ml',
    stock_quantity: 50,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=350',
    category: 'cat-drinks',
  },
  {
    id: 'prod-clear-water-6l',
    name: 'Clear Premium Packaged Water',
    description: 'Ultra-pure packaged mineral water container with sturdy handle.',
    price: 75.0,
    discount_price: 75.0,
    weight_size: '6 ltr',
    unit: '6 ltr',
    stock_quantity: 40,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=350',
    category: 'cat-drinks',
  },

  // --- CANDIES & GUMS ---
  {
    id: 'prod-orbit-spearmint-22g',
    name: 'Orbit Spearmint Flavour Sugar Free Chewing Gum',
    description: 'Refreshing spearmint flavored sugar-free dental gum.',
    price: 50.0,
    discount_price: 50.0,
    weight_size: '22g',
    unit: '22g',
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
    weight_size: '56g',
    unit: '56g',
    stock_quantity: 70,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=350',
    category: 'cat-candies',
  },
  {
    id: 'prod-happydent-wave-28g',
    name: 'Happydent Wave Sugarfree Mint Chewing Gum',
    description: 'Long-lasting mint freshness with whitening formula.',
    price: 47.0,
    discount_price: 50.0,
    weight_size: '28g',
    unit: '28g',
    stock_quantity: 90,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=350',
    category: 'cat-candies',
  },
  {
    id: 'prod-kopiko-family-135g',
    name: 'Kopiko Cappuccino Candy - Family Pack',
    description: 'Real coffee bean extract creamy cappuccino candies.',
    price: 46.0,
    discount_price: 50.0,
    weight_size: '135g',
    unit: '135g',
    stock_quantity: 60,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=350',
    category: 'cat-candies',
  },
  {
    id: 'prod-chupa-chups-sour-belt-56g',
    name: 'Chupa Chups Sour Belt Mixed Fruit Sour Candy',
    description: 'Long rainbow sour belt ribbons packed with tanginess.',
    price: 30.0,
    discount_price: 30.0,
    weight_size: '56g',
    unit: '56g',
    stock_quantity: 50,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=350',
    category: 'cat-candies',
  },
  {
    id: 'prod-orbit-mixed-fruit-22g',
    name: 'Orbit Mixed Fruit Flavour Chewing Gum',
    description: 'Fruity sugar-free chewing gum for fresh breath anytime.',
    price: 50.0,
    discount_price: 50.0,
    weight_size: '22g',
    unit: '22g',
    stock_quantity: 75,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=350',
    category: 'cat-candies',
  },

  // --- DAIRY, BREAD & EGGS ---
  {
    id: 'prod-chitale-cow-milk-500',
    name: 'Chitale Pasteurised Cow Milk',
    description: 'Fresh and wholesome pasteurised cow milk pouch.',
    price: 32.0,
    discount_price: 32.0,
    weight_size: '500 ml',
    unit: '500 ml',
    stock_quantity: 110,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=350',
    category: 'cat-dairy',
  },
  {
    id: 'prod-yojana-eggs-6pcs',
    name: 'Yojana Poultry Power White Eggs - 6 pcs',
    description: 'Fresh, protein-rich graded white farm eggs tray.',
    price: 60.0,
    discount_price: 60.0,
    weight_size: '6 pcs',
    unit: '6 pcs',
    stock_quantity: 85,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=350',
    category: 'cat-dairy',
  },
  {
    id: 'prod-chitale-full-cream-500',
    name: 'Chitale Full Cream Milk',
    description: 'Thick, rich full cream milk perfect for tea and sweets.',
    price: 39.0,
    discount_price: 39.0,
    weight_size: '500 ml',
    unit: '500 ml',
    stock_quantity: 95,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=350',
    category: 'cat-dairy',
  },
  {
    id: 'prod-gokul-full-cream-500',
    name: 'Gokul Full Cream Milk',
    description: 'Nutritious farm fresh buffalo milk rich in calcium.',
    price: 39.0,
    discount_price: 39.0,
    weight_size: '500 ml',
    unit: '500 ml',
    stock_quantity: 70,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=350',
    category: 'cat-dairy',
  },
  {
    id: 'prod-amul-masti-cup-200g',
    name: 'Amul Masti Cup Curd',
    description: 'Creamy, thick and refreshing cup curd for daily meals.',
    price: 25.0,
    discount_price: 25.0,
    weight_size: '200 g',
    unit: '200 g',
    stock_quantity: 100,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=350',
    category: 'cat-dairy',
  },
  {
    id: 'prod-chitale-pouch-curd-400g',
    name: 'Chitale Pouch Curd',
    description: 'Naturally set wholesome dahi pouch.',
    price: 41.0,
    discount_price: 41.0,
    weight_size: '400 g',
    unit: '400 g',
    stock_quantity: 65,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=350',
    category: 'cat-dairy',
  },
  {
    id: 'prod-amul-taaza-500ml',
    name: 'Amul Taaza Fresh Toned Milk',
    description: 'Fresh homogenized toned milk pouch with essential nutrients.',
    price: 30.0,
    discount_price: 30.0,
    weight_size: '500 ml',
    unit: '500 ml',
    stock_quantity: 130,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=350',
    category: 'cat-dairy',
  },

  // --- ROLLING PAPER & TOBACCO ACCESSORIES ---
  {
    id: 'prod-brown-ripper-32',
    name: 'Brown Ripper Rolling Paper 32 Leaves + 32 Tips',
    description: 'Unbleached natural brown rolling paper with filter tips.',
    price: 99.0,
    discount_price: 99.0,
    weight_size: '32 pcs',
    unit: '32 pcs',
    stock_quantity: 75,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=350',
    category: 'cat-tobacco',
  },
  {
    id: 'prod-bongchie-cones-3pcs',
    name: 'Perfect Rolled Cones (Natural) - Bongchie',
    description: 'Slow-burning pre-rolled paper cones with tips.',
    price: 45.0,
    discount_price: 45.0,
    weight_size: '3 pcs',
    unit: '3 pcs',
    stock_quantity: 80,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=350',
    category: 'cat-tobacco',
  },
  {
    id: 'prod-lit-thins-1pack',
    name: 'Thins Pre-Rolled Rolling Paper - LIT',
    description: 'Ultra thin organic rolling paper cone pack.',
    price: 50.0,
    discount_price: 50.0,
    weight_size: '1 pack',
    unit: '1 pack',
    stock_quantity: 90,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=350',
    category: 'cat-tobacco',
  },
  {
    id: 'prod-ultimate-rolling-tray',
    name: 'Ultimate Rolling Paper with Filter Tips & Tray',
    description: 'All-in-one pack with built-in folding rolling tray.',
    price: 120.0,
    discount_price: 120.0,
    weight_size: '32 pcs',
    unit: '32 pcs',
    stock_quantity: 40,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 5,
    image_url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=350',
    category: 'cat-tobacco',
  },
  {
    id: 'prod-stash-pro-king-32',
    name: 'Brown Rolling Paper (King Size) - Stash Pro',
    description: 'King size slim unrefined natural brown rolling paper.',
    price: 60.0,
    discount_price: 60.0,
    weight_size: '32 pcs',
    unit: '32 pcs',
    stock_quantity: 95,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=350',
    category: 'cat-tobacco',
  },
  {
    id: 'prod-colour-roach-stash',
    name: 'Colour Roach - Stash Pro',
    description: 'Perforated vibrant colored filter tips booklet.',
    price: 40.0,
    discount_price: 40.0,
    weight_size: '32 sheets',
    unit: '32 sheets',
    stock_quantity: 85,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=350',
    category: 'cat-tobacco',
  },

  // --- SNACKS & MUNCHIES ---
  {
    id: 'prod-lays-magic-masala-3pack',
    name: "Lay's India's Magic Masala Chips (80g x 3 Pack)",
    description: 'Spicy and tangy Indian masala flavored crunchy potato chips combo.',
    price: 71.0,
    discount_price: 71.0,
    weight_size: '240g (3 Pack)',
    unit: '3 Pack',
    stock_quantity: 85,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=350',
    category: 'cat-snacks',
  },
  {
    id: 'prod-lays-cream-onion-3pack',
    name: "Lay's American Style Cream & Onion Chips (80g x 3 Pack)",
    description: 'Smooth cream and onion flavored potato chips 3-pack.',
    price: 71.0,
    discount_price: 71.0,
    weight_size: '240g (3 Pack)',
    unit: '3 Pack',
    stock_quantity: 90,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=350',
    category: 'cat-snacks',
  },

  // --- SWEET TOOTH & ICE CREAMS ---
  {
    id: 'prod-kwality-mango-700',
    name: "Kwality Wall's Alphonso Mango Ice Cream (700 ml)",
    description: 'Rich and creamy Alphonso mango flavored ice cream tub.',
    price: 160.0,
    discount_price: 160.0,
    weight_size: '700 ml',
    unit: '700 ml',
    stock_quantity: 40,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 5,
    image_url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=350',
    category: 'cat-sweet',
  },
  {
    id: 'prod-kwality-choco-brownie-700',
    name: "Kwality Wall's Choco Brownie Fudge Ice Cream (700 ml)",
    description: 'Decadent chocolate ice cream loaded with rich brownie fudge pieces.',
    price: 236.0,
    discount_price: 250.0,
    weight_size: '700 ml',
    unit: '700 ml',
    stock_quantity: 35,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 5,
    image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=350',
    category: 'cat-sweet',
  },

  // --- FRUITS & VEGETABLES ---
  {
    id: 'prod-fresh-apples-1kg',
    name: 'Fresh Premium Shimla Apples (1 kg)',
    description: 'Crisp, juicy, and naturally sweet red Shimla apples.',
    price: 180.0,
    discount_price: 180.0,
    weight_size: '1 kg',
    unit: '1 kg',
    stock_quantity: 60,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=350',
    category: 'cat-fruits-veg',
  },
  {
    id: 'prod-fresh-bananas-1dozen',
    name: 'Fresh Robusta Bananas (1 Dozen / ~1.2 kg)',
    description: 'Naturally ripened, rich source of potassium bananas.',
    price: 60.0,
    discount_price: 60.0,
    weight_size: '1 Dozen',
    unit: '1 Dozen',
    stock_quantity: 90,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=350',
    category: 'cat-fruits-veg',
  },
  {
    id: 'prod-fresh-tomatoes-1kg',
    name: 'Fresh Hybrid Red Tomatoes (1 kg)',
    description: 'Firm and tangy hybrid red cooking tomatoes.',
    price: 38.0,
    discount_price: 38.0,
    weight_size: '1 kg',
    unit: '1 kg',
    stock_quantity: 100,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=350',
    category: 'cat-fruits-veg',
  },

  // --- BABY CARE ---
  {
    id: 'prod-pampers-medium-30',
    name: 'Pampers All round Protection Diaper Pants (Medium)',
    description: '12-hour leak lock diaper pants with ultra aloe vera lotion.',
    price: 399.0,
    discount_price: 450.0,
    weight_size: '30 pcs',
    unit: '30 pcs',
    stock_quantity: 50,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=350',
    category: 'cat-baby',
  },
  {
    id: 'prod-sebamed-baby-wash-200',
    name: 'Sebamed Baby Gentle Body Wash',
    description: 'Soap-free pH 5.5 gentle baby wash for sensitive skin.',
    price: 450.0,
    discount_price: 450.0,
    weight_size: '200 ml',
    unit: '200 ml',
    stock_quantity: 35,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=350',
    category: 'cat-baby',
  },

  // --- PET CARE ---
  {
    id: 'prod-pedigree-adult-1kg',
    name: 'Pedigree Adult Dry Dog Food Meat & Rice',
    description: 'Complete and balanced nutrition for healthy adult dogs.',
    price: 330.0,
    discount_price: 350.0,
    weight_size: '1.2 kg',
    unit: '1.2 kg',
    stock_quantity: 40,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=350',
    category: 'cat-pet',
  },
  {
    id: 'prod-whiskas-ocean-fish-1kg',
    name: 'Whiskas Dry Cat Food Ocean Fish Flavour',
    description: 'Tasty crunchy kibbles rich in omega 3 & 6 for shiny coat.',
    price: 380.0,
    discount_price: 400.0,
    weight_size: '1.2 kg',
    unit: '1.2 kg',
    stock_quantity: 30,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 5,
    image_url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=350',
    category: 'cat-pet',
  },

  // --- PHARMACY & WELLNESS ---
  {
    id: 'prod-eno-lemon-30g',
    name: 'Eno Fruit Salt Lemon Flavor Sachet',
    description: 'Fast 6-second relief from acidity and heartburn.',
    price: 15.0,
    discount_price: 15.0,
    weight_size: '30 g',
    unit: '30 g',
    stock_quantity: 150,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 25,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=350',
    category: 'cat-pharmacy',
  },
  {
    id: 'prod-moov-spray-50g',
    name: 'Moov Pain Relief Specialist Spray',
    description: '100% ayurvedic formula for fast muscle and joint pain relief.',
    price: 175.0,
    discount_price: 185.0,
    weight_size: '50 g',
    unit: '50 g',
    stock_quantity: 75,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=350',
    category: 'cat-pharmacy',
  },

  // --- ATTA, RICE & DAL ---
  {
    id: 'prod-aashirvaad-atta-5kg',
    name: 'Aashirvaad Whole Wheat Shudda Chakki Atta (5 kg Pack)',
    description: '100% pure whole wheat chakki atta for soft rotis.',
    price: 245.0,
    discount_price: 260.0,
    weight_size: '5 kg',
    unit: '5 kg',
    stock_quantity: 65,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=350',
    category: 'cat-staples',
  },
  {
    id: 'prod-daawat-basmati-5kg',
    name: 'Daawat Rozana Super Basmati Rice (5 kg Pack)',
    description: 'Aromatic long-grain basmati rice for daily meals.',
    price: 380.0,
    discount_price: 410.0,
    weight_size: '5 kg',
    unit: '5 kg',
    stock_quantity: 45,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=350',
    category: 'cat-staples',
  },

  // --- DRY FRUITS & NUTS ---
  {
    id: 'prod-almonds-500g',
    name: 'Premium California Almonds (Badam) 500g',
    description: 'Crisp, crunchy, nutrient-dense California raw almonds.',
    price: 420.0,
    discount_price: 450.0,
    weight_size: '500 g',
    unit: '500 g',
    stock_quantity: 55,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=350',
    category: 'cat-dryfruits',
  },
  {
    id: 'prod-cashews-500g',
    name: 'Whole Cashew Nuts (Kaju W240) 500g',
    description: 'Creamy, rich whole cashew nuts.',
    price: 460.0,
    discount_price: 490.0,
    weight_size: '500 g',
    unit: '500 g',
    stock_quantity: 45,
    is_in_stock: true,
    is_low_stock: false,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=350',
    category: 'cat-dryfruits',
  },
];

const SHARED_CATEGORIES_KEY = 'dmart_shared_categories_v3';
const SHARED_PRODUCTS_KEY = 'dmart_shared_products_v3';

export const getSharedCategories = (): any[] => {
  try {
    const raw = localStorage.getItem(SHARED_CATEGORIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 10) return parsed;
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
      if (Array.isArray(parsed) && parsed.length >= 15) return parsed;
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
