from datetime import date, time, timedelta
from django.core.management.base import BaseCommand
from accounts.models import User, RoleChoices
from products.models import Category, Product
from operations.models import PickupSlot

class Command(BaseCommand):
    help = 'Seeds initial test data (Users, Categories, Products, PickupSlots)'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE("Seeding initial data..."))

        # 1. Users seeding skipped (Users created dynamically via registration or admin command)

        # 2. Categories
        categories_data = [
            {"name": "Fruits & Vegetables", "description": "Fresh farm produce", "slug": "fruits-vegetables"},
            {"name": "Dairy & Bakery", "description": "Milk, butter, bread, and bakery items", "slug": "dairy-bakery"},
            {"name": "Beverages", "description": "Juices, soft drinks, tea, coffee", "slug": "beverages"},
            {"name": "Snacks & Munchies", "description": "Chips, biscuits, nuts, and chocolates", "slug": "snacks-munchies"},
            {"name": "Household Essentials", "description": "Detergents, cleaners, and hygiene products", "slug": "household-essentials"},
            {"name": "Ice Creams & Frozen", "description": "Ice cream tubs, bars, pops, and frozen treats", "slug": "ice-creams-frozen"},
            {"name": "Atta, Rice & Staples", "description": "Grains, flour, rice, and suji", "slug": "atta-rice-staples"},
        ]

        cat_objs = {}
        for cdata in categories_data:
            cat, _ = Category.objects.get_or_create(slug=cdata['slug'], defaults=cdata)
            cat_objs[cdata['slug']] = cat

        # 3. Products
        products_data = [
            # Ice Creams & Frozen
            {
                "name": "Kwality Wall's Alphonso Mango Ice Cream (700 ml)",
                "category": cat_objs["ice-creams-frozen"],
                "description": "Rich and creamy Alphonso mango flavored ice cream tub.",
                "price": 160.00,
                "stock_quantity": 40,
                "low_stock_threshold": 5,
                "image_url": "https://images.unsplash.com/photo-1570197788417-0e82375c9371"
            },
            {
                "name": "Kwality Wall's Choco Brownie Fudge Ice Cream (700 ml)",
                "category": cat_objs["ice-creams-frozen"],
                "description": "Decadent chocolate ice cream loaded with rich brownie fudge pieces.",
                "price": 236.00,
                "stock_quantity": 35,
                "low_stock_threshold": 5,
                "image_url": "https://images.unsplash.com/photo-1563805042-7684c019e1cb"
            },
            {
                "name": "Kwality Wall's Butterscotch Ice Cream (700 ml)",
                "category": cat_objs["ice-creams-frozen"],
                "description": "Classic butterscotch ice cream with crunchy caramelized cashew bits.",
                "price": 144.00,
                "stock_quantity": 50,
                "low_stock_threshold": 8,
                "image_url": "https://images.unsplash.com/photo-1567206563064-6f60f4078b57"
            },
            {
                "name": "Kwality Wall's Chocochips Ice Cream Tub (700 ml)",
                "category": cat_objs["ice-creams-frozen"],
                "description": "Creamy chocolate ice cream packed with real chocolate chips.",
                "price": 169.00,
                "stock_quantity": 45,
                "low_stock_threshold": 5,
                "image_url": "https://images.unsplash.com/photo-1563805042-7684c019e1cb"
            },
            {
                "name": "Kwality Wall's Vanilla Ice Cream Tub (700 ml)",
                "category": cat_objs["ice-creams-frozen"],
                "description": "Smooth and classic vanilla bean ice cream tub.",
                "price": 130.00,
                "stock_quantity": 60,
                "low_stock_threshold": 10,
                "image_url": "https://images.unsplash.com/photo-1570197788417-0e82375c9371"
            },
            {
                "name": "MAGNUM Caramel Ice Cream Pop (75 ml)",
                "category": cat_objs["ice-creams-frozen"],
                "description": "Velvety caramel ice cream coated in thick crackling Belgian chocolate.",
                "price": 70.00,
                "stock_quantity": 50,
                "low_stock_threshold": 10,
                "image_url": "https://images.unsplash.com/photo-1549395156-e0c1fe6fc7a5"
            },
            {
                "name": "Magnum Almond Ice Cream Stick Bar (62 g)",
                "category": cat_objs["ice-creams-frozen"],
                "description": "Vanilla ice cream bar dipped in thick chocolate and roasted almond pieces.",
                "price": 80.00,
                "stock_quantity": 55,
                "low_stock_threshold": 10,
                "image_url": "https://images.unsplash.com/photo-1549395156-e0c1fe6fc7a5"
            },
            {
                "name": "Magnum Brownie Ice Cream Stick Bar (61 g)",
                "category": cat_objs["ice-creams-frozen"],
                "description": "Rich brownie chocolate ice cream stick dipped in dark Belgian chocolate.",
                "price": 80.00,
                "stock_quantity": 40,
                "low_stock_threshold": 8,
                "image_url": "https://images.unsplash.com/photo-1549395156-e0c1fe6fc7a5"
            },

            # Snacks & Munchies
            {
                "name": "Lay's India's Magic Masala Chips (80g x 3 Pack)",
                "category": cat_objs["snacks-munchies"],
                "description": "Value pack of spicy Indian magic masala ridged potato chips.",
                "price": 71.00,
                "stock_quantity": 75,
                "low_stock_threshold": 15,
                "image_url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b"
            },
            {
                "name": "NOICE Kerala Nendran Banana Chips (50 g)",
                "category": cat_objs["snacks-munchies"],
                "description": "Authentic Kerala coconut oil fried crispy Nendran banana chips.",
                "price": 36.00,
                "stock_quantity": 65,
                "low_stock_threshold": 10,
                "image_url": "https://images.unsplash.com/photo-1621447504864-d8686e12698c"
            },
            {
                "name": "NOICE Mini Bhakarwadi (100 g)",
                "category": cat_objs["snacks-munchies"],
                "description": "Crispy and spicy traditional Maharashtrian fried snack rolls.",
                "price": 51.00,
                "stock_quantity": 50,
                "low_stock_threshold": 10,
                "image_url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b"
            },
            {
                "name": "NOICE Spicy Potato Wafers (100 g)",
                "category": cat_objs["snacks-munchies"],
                "description": "Thin and crunchy potato wafers tossed in fiery red chilli spice.",
                "price": 67.00,
                "stock_quantity": 60,
                "low_stock_threshold": 10,
                "image_url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b"
            },
            {
                "name": "VS Mani & Co. Potato Hot Chips (60 g)",
                "category": cat_objs["snacks-munchies"],
                "description": "South Indian style spicy potato hot chips fried to perfection.",
                "price": 52.00,
                "stock_quantity": 45,
                "low_stock_threshold": 8,
                "image_url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b"
            },
            {
                "name": "Supergram Protein Nacho Chips (50 g)",
                "category": cat_objs["snacks-munchies"],
                "description": "High protein baked tortilla nacho chips with 10g protein.",
                "price": 30.00,
                "stock_quantity": 80,
                "low_stock_threshold": 15,
                "image_url": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d"
            },
            {
                "name": "NOICE Homestyle Shankarpali (Sweet) (150 g)",
                "category": cat_objs["snacks-munchies"],
                "description": "Sweet homestyle fried flour diamond snacks.",
                "price": 71.00,
                "stock_quantity": 40,
                "low_stock_threshold": 8,
                "image_url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b"
            },
            {
                "name": "Lay's (Sizzling Hot) Spicy Potato Chips (40 g)",
                "category": cat_objs["snacks-munchies"],
                "description": "Fiery sizzling hot chili potato chips.",
                "price": 20.00,
                "stock_quantity": 90,
                "low_stock_threshold": 15,
                "image_url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b"
            },
            {
                "name": "Too Yumm Protein Chips – Grilled Cheese & Chilli (60 g)",
                "category": cat_objs["snacks-munchies"],
                "description": "Non-fried protein chips with delicious grilled cheese & chilli flavor.",
                "price": 41.00,
                "stock_quantity": 50,
                "low_stock_threshold": 10,
                "image_url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b"
            },
            {
                "name": "YELLOW DIAMOND Plain Salted Chips (50 g)",
                "category": cat_objs["snacks-munchies"],
                "description": "Classic salted crispy potato chips.",
                "price": 15.00,
                "stock_quantity": 100,
                "low_stock_threshold": 20,
                "image_url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b"
            },
            {
                "name": "Lay's (Spanish Tomato Tango Flavour) Potato Chips (50 g)",
                "category": cat_objs["snacks-munchies"],
                "description": "Tangy Spanish tomato flavored crispy potato chips.",
                "price": 20.00,
                "stock_quantity": 85,
                "low_stock_threshold": 15,
                "image_url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b"
            },

            # Staples / Sooji
            {
                "name": "SAMRAT MP Sooji (Coarse MP Sooji, 500 g)",
                "category": cat_objs["atta-rice-staples"],
                "description": "Premium quality coarse MP wheat semolina suji.",
                "price": 31.00,
                "stock_quantity": 100,
                "low_stock_threshold": 20,
                "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c"
            },
            {
                "name": "Organic Tattva Suji (Organic Wheat Cooking Grain, 500 g)",
                "category": cat_objs["atta-rice-staples"],
                "description": "100% certified organic wheat cooking grain suji semolina.",
                "price": 64.00,
                "stock_quantity": 60,
                "low_stock_threshold": 10,
                "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c"
            },
            {
                "name": "Safe Harvest Pesticide Free Roasted Sooji (500 g)",
                "category": cat_objs["atta-rice-staples"],
                "description": "Pesticide-free pre-roasted wheat semolina suji rawa.",
                "price": 42.00,
                "stock_quantity": 50,
                "low_stock_threshold": 10,
                "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c"
            },
            {
                "name": "Fortune Suji Rawa Semolina (500 g)",
                "category": cat_objs["atta-rice-staples"],
                "description": "Hygiene packed premium wheat semolina rawa suji.",
                "price": 35.00,
                "stock_quantity": 80,
                "low_stock_threshold": 15,
                "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c"
            },

            # Beverages
            {
                "name": "Pepsi Soft Drink Bottle (750 ml)",
                "category": cat_objs["beverages"],
                "description": "Refreshing carbonated cola soft drink in a 750 ml bottle.",
                "price": 35.00,
                "stock_quantity": 60,
                "low_stock_threshold": 10,
                "image_url": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97"
            },
            {
                "name": "Pepsi Soft Drink Bottle (2250 ml)",
                "category": cat_objs["beverages"],
                "description": "Large family pack carbonated cola soft drink 2.25L.",
                "price": 83.00,
                "stock_quantity": 45,
                "low_stock_threshold": 10,
                "image_url": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97"
            },
            {
                "name": "Aquafina Mineral Water Bottle (1 ltr)",
                "category": cat_objs["beverages"],
                "description": "Purified drinking water bottled under strict quality processes.",
                "price": 20.00,
                "stock_quantity": 150,
                "low_stock_threshold": 20,
                "image_url": "https://images.unsplash.com/photo-1548839140-29a749e1bc4e"
            },
            {
                "name": "Pepsi Zero Sugar Soft Drink (400 ml)",
                "category": cat_objs["beverages"],
                "description": "Maximum taste with zero sugar carbonated cola beverage.",
                "price": 20.00,
                "stock_quantity": 50,
                "low_stock_threshold": 10,
                "image_url": "https://images.unsplash.com/photo-1554866585-cd94860890b7"
            },
            {
                "name": "Pepsi Zero Sugar Soft Drink (300 ml - Pack of 6)",
                "category": cat_objs["beverages"],
                "description": "Pack of 6 canned Pepsi Zero Sugar soft drinks (1.8L total).",
                "price": 212.00,
                "stock_quantity": 30,
                "low_stock_threshold": 5,
                "image_url": "https://images.unsplash.com/photo-1554866585-cd94860890b7"
            },
            {
                "name": "7UP Nimbooz with Lemon Juice (350 ml)",
                "category": cat_objs["beverages"],
                "description": "Tangy and refreshing lemon juice drink with real lemon goodness.",
                "price": 25.00,
                "stock_quantity": 70,
                "low_stock_threshold": 15,
                "image_url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd"
            },
            {
                "name": "Mountain Dew Soft Drink Bottle (750 ml)",
                "category": cat_objs["beverages"],
                "description": "High energy citrus flavored carbonated soft drink.",
                "price": 40.00,
                "stock_quantity": 80,
                "low_stock_threshold": 15,
                "image_url": "https://images.unsplash.com/photo-1622543925917-763c34d1a86e"
            },
            {
                "name": "7 Up Zero Soft Drink (400 ml)",
                "category": cat_objs["beverages"],
                "description": "Crisp lemon-lime zero sugar carbonated soft drink.",
                "price": 20.00,
                "stock_quantity": 50,
                "low_stock_threshold": 10,
                "image_url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd"
            }
        ]

        for pdata in products_data:
            Product.objects.get_or_create(name=pdata['name'], defaults=pdata)

        # 4. Pickup Slots
        today = date.today()
        slots_data = [
            {"date": today + timedelta(days=1), "start_time": time(9, 0), "end_time": time(11, 0), "capacity": 10},
            {"date": today + timedelta(days=1), "start_time": time(11, 0), "end_time": time(13, 0), "capacity": 10},
            {"date": today + timedelta(days=1), "start_time": time(14, 0), "end_time": time(16, 0), "capacity": 10},
            {"date": today + timedelta(days=2), "start_time": time(9, 0), "end_time": time(11, 0), "capacity": 10},
            {"date": today + timedelta(days=2), "start_time": time(14, 0), "end_time": time(16, 0), "capacity": 10},
        ]

        for sdata in slots_data:
            PickupSlot.objects.get_or_create(
                date=sdata['date'],
                start_time=sdata['start_time'],
                end_time=sdata['end_time'],
                defaults={'capacity': sdata['capacity']}
            )

        self.stdout.write(self.style.SUCCESS("Sample data seeded successfully!"))
