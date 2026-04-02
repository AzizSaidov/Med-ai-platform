from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from core.models import TelegramLinkCode, User
from telegram_bot.services import build_bot_deep_link


class Command(BaseCommand):
    help = "Generate a one-time Telegram link code for a Med Tech user."

    def add_arguments(self, parser):
        parser.add_argument("username", help="Username of the Med Tech account")
        parser.add_argument(
            "--minutes",
            type=int,
            default=15,
            help="How long the code should stay valid",
        )

    def handle(self, *args, **options):
        username = options["username"]
        lifetime_minutes = options["minutes"]

        user = User.objects.filter(username=username).first()
        if user is None:
            raise CommandError(f"User '{username}' was not found.")

        link_code = TelegramLinkCode.create_for_user(user, lifetime_minutes=lifetime_minutes)

        self.stdout.write(self.style.SUCCESS(f"Telegram code for {user.username}: {link_code.code}"))
        self.stdout.write(f"Valid until: {timezone.localtime(link_code.expires_at):%d %b %Y %H:%M}")
        deep_link = build_bot_deep_link(link_code.code)
        if deep_link:
            self.stdout.write(f"Deep link: {deep_link}")
