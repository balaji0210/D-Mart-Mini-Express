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
        ]

        cat_objs = {}
        for cdata in categories_data:
            cat, _ = Category.objects.get_or_create(slug=cdata['slug'], defaults=cdata)
            cat_objs[cdata['slug']] = cat

        # 3. Products
        products_data = [
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
            },
            {
                "name": "Fresh Organic Apples (1kg)",
                "category": cat_objs["fruits-vegetables"],
                "description": "Crisp and juicy sweet red apples straight from orchards.",
                "price": 149.00,
                "stock_quantity": 50,
                "low_stock_threshold": 10,
                "image_url": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6"
            },
            {
                "name": "Fresh Organic Bananas (1 Dozen)",
                "category": cat_objs["fruits-vegetables"],
                "description": "Naturally ripened sweet bananas rich in potassium.",
                "price": 60.00,
                "stock_quantity": 80,
                "low_stock_threshold": 15,
                "image_url": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e"
            },
            {
                "name": "Whole Farm Fresh Milk (1 Gallon)",
                "category": cat_objs["dairy-bakery"],
                "description": "Pasteurized whole milk rich in calcium and vitamin D.",
                "price": 75.00,
                "stock_quantity": 30,
                "low_stock_threshold": 5,
                "image_url": "https://images.unsplash.com/photo-1550583724-b2692b85b150"
            },
            {
                "name": "Artisanal Whole Wheat Bread",
                "category": cat_objs["dairy-bakery"],
                "description": "Freshly baked whole grain bread loaf with seeds.",
                "price": 45.00,
                "stock_quantity": 25,
                "low_stock_threshold": 10,
                "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff"
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
