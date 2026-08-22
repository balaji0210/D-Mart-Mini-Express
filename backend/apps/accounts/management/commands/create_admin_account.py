from django.core.management.base import BaseCommand
from accounts.models import User, RoleChoices

class Command(BaseCommand):
    help = 'Creates or updates an Admin account with full privileges'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, default='admin@dmart.com', help='Admin email address')
        parser.add_argument('--password', type=str, default='Admin@123', help='Admin password')
        parser.add_argument('--name', type=str, default='System Admin', help='Admin full name')

    def handle(self, *args, **options):
        email = options['email'].strip().lower()
        password = options['password']
        name = options['name']

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'full_name': name,
                'role': RoleChoices.ADMIN,
                'is_staff': True,
                'is_superuser': True,
            }
        )

        user.full_name = name
        user.role = RoleChoices.ADMIN
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()

        action = "Created" if created else "Updated"
        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully {action} Admin Account!\n"
                f"  Email: {email}\n"
                f"  Password: {password}\n"
                f"  Role: ADMIN (Full Superuser Privileges)"
            )
        )
