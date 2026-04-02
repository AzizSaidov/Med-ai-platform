import asyncio

from django.core.management.base import BaseCommand

from telegram_bot.bot import run_bot


class Command(BaseCommand):
    help = "Run the Med Tech Telegram bot with polling."

    def handle(self, *args, **options):
        asyncio.run(run_bot())
