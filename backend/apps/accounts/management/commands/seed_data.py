from datetime import date, time, timedelta
from django.core.management.base import BaseCommand
from accounts.models import User, RoleChoices
from products.models import Category, Product
from operations.models import PickupSlot

class Command(BaseCommand):
    help = 'Seeds initial test data (Users, Categories, Products, PickupSlots)'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE("Seeding initial data..."))

        # 1. Users
        password = "Test@123456"

        customer, _ = User.objects.get_or_create(
            email="customer@test.com",
            defaults={"full_name": "Test Customer", "role": RoleChoices.CUSTOMER}
        )
        customer.role = RoleChoices.CUSTOMER
        customer.set_password(password)
        customer.save()
        self.stdout.write(self.style.SUCCESS("Seeded customer@test.com"))

        staff, _ = User.objects.get_or_create(
            email="staff@test.com",
            defaults={"full_name": "Test Staff", "role": RoleChoices.STAFF, "is_staff": True}
        )
        staff.role = RoleChoices.STAFF
        staff.is_staff = True
        staff.set_password(password)
        staff.save()
        self.stdout.write(self.style.SUCCESS("Seeded staff@test.com"))

        admin, _ = User.objects.get_or_create(
            email="admin@test.com",
            defaults={"full_name": "Test Admin", "role": RoleChoices.ADMIN, "is_staff": True, "is_superuser": True}
        )
        admin.role = RoleChoices.ADMIN
        admin.is_staff = True
        admin.is_superuser = True
        admin.set_password(password)
        admin.save()
        self.stdout.write(self.style.SUCCESS("Seeded admin@test.com"))

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
                "name": "Fresh Organic Apples (1kg)",
                "category": cat_objs["fruits-vegetables"],
                "description": "Crisp and juicy sweet red apples straight from orchards.",
                "price": 3.99,
                "stock_quantity": 50,
                "low_stock_threshold": 10,
                "image_url": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6"
            },
            {
                "name": "Fresh Organic Bananas (1 Dozen)",
                "category": cat_objs["fruits-vegetables"],
                "description": "Naturally ripened sweet bananas rich in potassium.",
                "price": 1.99,
                "stock_quantity": 80,
                "low_stock_threshold": 15,
                "image_url": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e"
            },
            {
                "name": "Whole Farm Fresh Milk (1 Gallon)",
                "category": cat_objs["dairy-bakery"],
                "description": "Pasteurized whole milk rich in calcium and vitamin D.",
                "price": 4.49,
                "stock_quantity": 30,
                "low_stock_threshold": 5,
                "image_url": "https://images.unsplash.com/photo-1550583724-b2692b85b150"
            },
            {
                "name": "Artisanal Whole Wheat Bread",
                "category": cat_objs["dairy-bakery"],
                "description": "Freshly baked whole grain bread loaf with seeds.",
                "price": 2.99,
                "stock_quantity": 4,  # Low stock test
                "low_stock_threshold": 10,
                "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff"
            },
            {
                "name": "Fresh Orange Juice (1L)",
                "category": cat_objs["beverages"],
                "description": "100% pure squeezed orange juice with pulp.",
                "price": 3.49,
                "stock_quantity": 40,
                "low_stock_threshold": 8,
                "image_url": "https://images.unsplash.com/photo-1600271886742-f049cd451bba"
            },
            {
                "name": "Crispy Potato Chips (Family Pack)",
                "category": cat_objs["snacks-munchies"],
                "description": "Classic salted potato chips for quick snacking.",
                "price": 2.49,
                "stock_quantity": 100,
                "low_stock_threshold": 20,
                "image_url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b"
            },
            {
                "name": "Eco-Friendly Dishwashing Liquid (500ml)",
                "category": cat_objs["household-essentials"],
                "description": "Tough on grease, soft on hands eco-friendly dish cleaner.",
                "price": 3.99,
                "stock_quantity": 25,
                "low_stock_threshold": 5,
                "image_url": "https://images.unsplash.com/photo-1585421514738-01798e348b17"
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
