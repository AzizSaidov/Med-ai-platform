import asyncio

from aiogram import Bot
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from django.conf import settings
from django.core.management.base import BaseCommand

from telegram_bot.reminders import (
    send_due_day_reminders,
)


class Command(BaseCommand):
    help = "Send one Telegram reminder on the day of an appointment to linked patients and doctors."

    def handle(self, *args, **options):
        asyncio.run(self.send_today_reminders())

    async def send_today_reminders(self):
        if not settings.TELEGRAM_BOT_TOKEN:
            raise RuntimeError("TELEGRAM_BOT_TOKEN is not configured in .env.")

        bot = Bot(
            token=settings.TELEGRAM_BOT_TOKEN,
            default=DefaultBotProperties(parse_mode=ParseMode.HTML),
        )

        try:
            result = await send_due_day_reminders(bot)
        finally:
            await bot.session.close()

        self.stdout.write(
            self.style.SUCCESS(
                "Telegram reminders sent: "
                f"patients={result['patients']}, doctors={result['doctors']}, skipped={result['skipped']}"
            )
        )
