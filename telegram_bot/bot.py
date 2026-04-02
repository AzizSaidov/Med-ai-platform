import asyncio
import contextlib
import logging

from asgiref.sync import sync_to_async
from aiogram import Bot, Dispatcher, F, Router
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import Command, CommandObject
from aiogram.types import CallbackQuery, Message
from django.conf import settings

from .keyboards import (
    build_doctor_detail_keyboard,
    build_doctor_directory_keyboard,
    build_guest_keyboard,
    build_linked_keyboard,
)
from .services import (
    format_appointment_line,
    format_doctor_card,
    format_linked_account_text,
    get_doctor_booking_url,
    get_doctor_by_id,
    get_doctor_directory,
    get_doctor_profile_url,
    get_home_text,
    get_linked_account_context,
    get_next_appointment_for_chat,
    get_site_urls,
    get_telegram_profile,
    get_upcoming_appointments_for_chat,
    link_telegram_account,
)
from .reminders import send_due_day_reminders

router = Router()
logger = logging.getLogger(__name__)


def _guest_text():
    return (
        "🩺 <b>Med Tech Telegram Assistant</b>\n\n"
        "Бот связан с сайтом Med Tech и помогает быстро открывать записи, ближайший прием и каталог врачей.\n\n"
        "Как начать:\n"
        "1. Зарегистрируйся или войди на сайте\n"
        "2. Открой страницу Telegram на сайте\n"
        "3. Сгенерируй код и подключи аккаунт через бота\n\n"
        "Регистрация и авторизация остаются на сайте, а Telegram становится удобным мобильным помощником."
    )


def _connect_help_text():
    return (
        "🔗 <b>Как подключить Telegram</b>\n\n"
        "1. Войди в свой аккаунт Med Tech на сайте\n"
        "2. Открой страницу Telegram\n"
        "3. Нажми кнопку генерации кода\n"
        "4. Открой бота по deep-link или отправь <code>/link CODE</code>\n\n"
        "Так бот точно понимает, какой аккаунт сайта нужно привязать."
    )


def _bot_help_text(context):
    if context["role_key"] == "doctor":
        return (
            "ℹ️ <b>Что умеет бот для доктора</b>\n\n"
            "• Показать ближайшие приемы\n"
            "• Открыть следующего пациента\n"
            "• Быстро перейти в профиль врача\n"
            "• Посмотреть каталог врачей и сайт"
        )

    if context["role_key"] == "admin":
        return (
            "ℹ️ <b>Что умеет бот для администратора</b>\n\n"
            "• Показать ближайшие записи\n"
            "• Открыть следующую запись\n"
            "• Смотреть каталог врачей\n"
            "• Быстро перейти на сайт"
        )

    return (
        "ℹ️ <b>Что умеет бот для пациента</b>\n\n"
        "• Показать мои записи\n"
        "• Открыть ближайший прием\n"
        "• Смотреть врачей кнопками\n"
        "• Быстро перейти на сайт и AI"
    )


async def _send_message(message: Message, text: str, reply_markup=None):
    await message.answer(text, reply_markup=reply_markup)


async def _edit_or_answer(callback: CallbackQuery, text: str, reply_markup=None):
    try:
        await callback.message.edit_text(text, reply_markup=reply_markup)
    except Exception:
        await callback.message.answer(text, reply_markup=reply_markup)


async def _send_guest_welcome(target):
    urls = get_site_urls()
    text = _guest_text()
    markup = build_guest_keyboard(urls)

    if isinstance(target, CallbackQuery):
        await _edit_or_answer(target, text, markup)
    else:
        await _send_message(target, text, markup)


async def _send_home(target, chat_id):
    context = await sync_to_async(get_linked_account_context)(chat_id)
    if context is None:
        await _send_guest_welcome(target)
        return

    urls = get_site_urls()
    text = get_home_text(context)
    markup = build_linked_keyboard(context, urls)

    if isinstance(target, CallbackQuery):
        await _edit_or_answer(target, text, markup)
    else:
        await _send_message(target, text, markup)


async def _send_appointments(target, chat_id):
    context, appointments = await sync_to_async(get_upcoming_appointments_for_chat)(chat_id)
    if context is None:
        await _send_guest_welcome(target)
        return

    if not appointments:
        if context["role_key"] == "doctor":
            text = "🗓 <b>Ближайших приемов пока нет.</b>"
        elif context["role_key"] == "admin":
            text = "🗓 <b>Ближайших записей пока нет.</b>"
        else:
            text = "🗓 <b>У тебя пока нет ближайших записей.</b>"
    else:
        title = {
            "doctor": "🗓 <b>Ближайшие приемы</b>",
            "admin": "🗓 <b>Ближайшие записи</b>",
            "patient": "🗓 <b>Мои ближайшие записи</b>",
        }[context["role_key"]]
        body = "\n\n".join(
            format_appointment_line(item, role_key=context["role_key"]) for item in appointments
        )
        text = f"{title}\n\n{body}"

    markup = build_linked_keyboard(context, get_site_urls())
    if isinstance(target, CallbackQuery):
        await _edit_or_answer(target, text, markup)
    else:
        await _send_message(target, text, markup)


async def _send_next_appointment(target, chat_id):
    context, appointment = await sync_to_async(get_next_appointment_for_chat)(chat_id)
    if context is None:
        await _send_guest_welcome(target)
        return

    if appointment is None:
        if context["role_key"] == "doctor":
            text = "⏰ <b>Следующего пациента пока нет.</b>"
        elif context["role_key"] == "admin":
            text = "⏰ <b>Ближайших записей пока нет.</b>"
        else:
            text = "⏰ <b>Ближайшего приема пока нет.</b>"
    else:
        title = {
            "doctor": "⏰ <b>Следующий пациент</b>",
            "admin": "⏰ <b>Следующая запись</b>",
            "patient": "⏰ <b>Твой ближайший прием</b>",
        }[context["role_key"]]
        text = f"{title}\n\n{format_appointment_line(appointment, role_key=context['role_key'])}"

    markup = build_linked_keyboard(context, get_site_urls())
    if isinstance(target, CallbackQuery):
        await _edit_or_answer(target, text, markup)
    else:
        await _send_message(target, text, markup)


async def _send_doctors(target, chat_id):
    context = await sync_to_async(get_linked_account_context)(chat_id)
    if context is None:
        await _send_guest_welcome(target)
        return

    doctors = await sync_to_async(get_doctor_directory)()
    if not doctors:
        text = "В базе пока нет врачей."
        markup = build_linked_keyboard(context, get_site_urls())
    else:
        text = (
            "👨‍⚕️ <b>Каталог врачей Med Tech</b>\n\n"
            "Выбери врача кнопкой ниже, чтобы открыть подробную карточку."
        )
        markup = build_doctor_directory_keyboard(doctors)

    if isinstance(target, CallbackQuery):
        await _edit_or_answer(target, text, markup)
    else:
        await _send_message(target, text, markup)


async def _send_doctor_detail(target, chat_id, doctor_id):
    context = await sync_to_async(get_linked_account_context)(chat_id)
    if context is None:
        await _send_guest_welcome(target)
        return

    doctor = await sync_to_async(get_doctor_by_id)(doctor_id)
    if doctor is None:
        text = "Карточка врача не найдена."
        markup = build_linked_keyboard(context, get_site_urls())
    else:
        if context["role_key"] in {"doctor", "admin"}:
            primary_url = get_doctor_profile_url(doctor.id)
            primary_label = "🌐 Открыть профиль врача"
        else:
            primary_url = get_site_urls()["doctors"]
            primary_label = "🌐 Открыть страницу врачей"

        can_book = context["role_key"] in {"patient", "admin"}
        book_url = get_doctor_booking_url(doctor.id) if can_book else None
        text = format_doctor_card(doctor)
        markup = build_doctor_detail_keyboard(
            primary_url,
            primary_label,
            book_url=book_url,
        )

    if isinstance(target, CallbackQuery):
        await _edit_or_answer(target, text, markup)
    else:
        await _send_message(target, text, markup)


async def _send_profile(target, chat_id):
    context = await sync_to_async(get_linked_account_context)(chat_id)
    if context is None:
        await _send_guest_welcome(target)
        return

    text = format_linked_account_text(context)
    markup = build_linked_keyboard(context, get_site_urls())
    if isinstance(target, CallbackQuery):
        await _edit_or_answer(target, text, markup)
    else:
        await _send_message(target, text, markup)


async def _send_help(target, chat_id):
    context = await sync_to_async(get_linked_account_context)(chat_id)
    if context is None:
        text = _connect_help_text()
        markup = build_guest_keyboard(get_site_urls())
    else:
        text = _bot_help_text(context)
        markup = build_linked_keyboard(context, get_site_urls())

    if isinstance(target, CallbackQuery):
        await _edit_or_answer(target, text, markup)
    else:
        await _send_message(target, text, markup)


@router.message(Command("start"))
async def start_handler(message: Message, command: CommandObject):
    profile = await sync_to_async(get_telegram_profile)(message.chat.id)

    start_arg = (command.args or "").strip()
    if start_arg.startswith("link_"):
        code = start_arg.split("link_", 1)[1].strip().upper()
        if code:
            linked_profile, error = await sync_to_async(link_telegram_account)(
                code,
                message.chat.id,
                telegram_username=message.from_user.username or "",
                first_name=message.from_user.first_name or "",
                language_code=message.from_user.language_code or "",
            )
            if error:
                await message.answer(f"⚠️ {error}")
            else:
                await message.answer(
                    f"✅ Telegram подключен к аккаунту <b>{linked_profile.user.username}</b>."
                )
                await _send_home(message, message.chat.id)
                return

    if profile is None:
        await _send_guest_welcome(message)
        return

    await _send_home(message, message.chat.id)


@router.message(Command("help"))
async def help_handler(message: Message):
    await _send_help(message, message.chat.id)


@router.message(Command("status"))
async def status_handler(message: Message):
    await _send_profile(message, message.chat.id)


@router.message(Command("link"))
async def link_handler(message: Message, command: CommandObject):
    code = (command.args or "").strip().upper()
    if not code:
        await message.answer("Укажи код так: <code>/link CODE</code>")
        return

    profile, error = await sync_to_async(link_telegram_account)(
        code,
        message.chat.id,
        telegram_username=message.from_user.username or "",
        first_name=message.from_user.first_name or "",
        language_code=message.from_user.language_code or "",
    )

    if error:
        await message.answer(f"⚠️ {error}")
        await _send_guest_welcome(message)
        return

    await message.answer(
        f"✅ Telegram подключен к аккаунту <b>{profile.user.username}</b>."
    )
    await _send_home(message, message.chat.id)


@router.callback_query(F.data == "tg_home")
async def home_callback(callback: CallbackQuery):
    await callback.answer()
    await _send_home(callback, callback.message.chat.id)


@router.callback_query(F.data == "tg_appointments")
async def appointments_callback(callback: CallbackQuery):
    await callback.answer()
    await _send_appointments(callback, callback.message.chat.id)


@router.callback_query(F.data == "tg_next")
async def next_callback(callback: CallbackQuery):
    await callback.answer()
    await _send_next_appointment(callback, callback.message.chat.id)


@router.callback_query(F.data == "tg_doctors")
async def doctors_callback(callback: CallbackQuery):
    await callback.answer()
    await _send_doctors(callback, callback.message.chat.id)


@router.callback_query(F.data == "tg_help")
async def help_callback(callback: CallbackQuery):
    await callback.answer()
    await _send_help(callback, callback.message.chat.id)


@router.callback_query(F.data == "tg_profile")
async def profile_callback(callback: CallbackQuery):
    await callback.answer()
    await _send_profile(callback, callback.message.chat.id)


@router.callback_query(F.data.startswith("tg_doctor_"))
async def doctor_detail_callback(callback: CallbackQuery):
    await callback.answer()
    doctor_id = callback.data.split("tg_doctor_", 1)[1]
    if doctor_id.isdigit():
        await _send_doctor_detail(callback, callback.message.chat.id, int(doctor_id))
        return

    await callback.message.answer("Не удалось открыть карточку врача.")


@router.message()
async def fallback_handler(message: Message):
    profile = await sync_to_async(get_telegram_profile)(message.chat.id)
    if profile is None:
        await _send_guest_welcome(message)
        return

    await _send_home(message, message.chat.id)


async def run_bot():
    if not settings.TELEGRAM_BOT_TOKEN:
        raise RuntimeError("TELEGRAM_BOT_TOKEN is not configured in .env.")

    bot = Bot(
        token=settings.TELEGRAM_BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML),
    )
    dispatcher = Dispatcher()
    dispatcher.include_router(router)
    reminder_task = asyncio.create_task(_run_reminder_worker(bot))
    try:
        await dispatcher.start_polling(bot)
    finally:
        reminder_task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await reminder_task


async def _run_reminder_worker(bot):
    interval_seconds = max(getattr(settings, "TELEGRAM_REMINDER_INTERVAL_SECONDS", 600), 60)

    while True:
        try:
            result = await send_due_day_reminders(bot)
            if result["patients"] or result["doctors"]:
                logger.info(
                    "Telegram day reminders sent automatically: patients=%s doctors=%s skipped=%s",
                    result["patients"],
                    result["doctors"],
                    result["skipped"],
                )
        except Exception:
            logger.exception("Automatic Telegram reminder loop failed.")

        await asyncio.sleep(interval_seconds)
