from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup


def build_guest_keyboard(site_urls):
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="📝 Регистрация", url=site_urls["register"]),
                InlineKeyboardButton(text="🔐 Войти", url=site_urls["login"]),
            ],
            [
                InlineKeyboardButton(
                    text="🔗 Подключить Telegram",
                    url=site_urls["telegram_connect"],
                ),
            ],
            [
                InlineKeyboardButton(text="🌐 Открыть сайт", url=site_urls["base"]),
            ],
        ]
    )


def build_linked_keyboard(context, site_urls):
    role_key = context["role_key"]
    rows = []

    if role_key == "doctor":
        rows.append(
            [
                InlineKeyboardButton(text="🗓 Мои приемы", callback_data="tg_appointments"),
                InlineKeyboardButton(text="⏰ Следующий пациент", callback_data="tg_next"),
            ]
        )
        if context["doctor_profile"] is not None:
            rows.append(
                [
                    InlineKeyboardButton(
                        text="👨‍⚕️ Профиль врача",
                        url=f"{site_urls['base']}/doctor-profiles/{context['doctor_profile'].id}/",
                    ),
                    InlineKeyboardButton(text="👥 Каталог врачей", callback_data="tg_doctors"),
                ]
            )
        else:
            rows.append(
                [
                    InlineKeyboardButton(text="👥 Каталог врачей", callback_data="tg_doctors"),
                    InlineKeyboardButton(text="🔐 Аккаунт", callback_data="tg_profile"),
                ]
            )
    else:
        rows.append(
            [
                InlineKeyboardButton(text="🗓 Мои записи", callback_data="tg_appointments"),
                InlineKeyboardButton(text="⏰ Ближайший прием", callback_data="tg_next"),
            ]
        )
        rows.append(
            [
                InlineKeyboardButton(text="👨‍⚕️ Врачи", callback_data="tg_doctors"),
                InlineKeyboardButton(text="🔐 Аккаунт", callback_data="tg_profile"),
            ]
        )

    rows.append(
        [
            InlineKeyboardButton(text="💬 AI на сайте", url=site_urls["ai_chat"]),
            InlineKeyboardButton(text="🌐 Открыть сайт", url=site_urls["dashboard"]),
        ]
    )
    rows.append([InlineKeyboardButton(text="ℹ️ Помощь", callback_data="tg_help")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def build_doctor_directory_keyboard(doctors):
    rows = [
        [
            InlineKeyboardButton(
                text=f"👨‍⚕️ {doctor.display_name}",
                callback_data=f"tg_doctor_{doctor.id}",
            )
        ]
        for doctor in doctors
    ]
    rows.append([InlineKeyboardButton(text="⬅️ Назад", callback_data="tg_home")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def build_doctor_detail_keyboard(primary_url, primary_label, book_url=None):
    rows = [[InlineKeyboardButton(text=primary_label, url=primary_url)]]
    if book_url:
        rows.append([InlineKeyboardButton(text="📅 Записаться на сайте", url=book_url)])
    rows.append([InlineKeyboardButton(text="⬅️ К списку врачей", callback_data="tg_doctors")])
    return InlineKeyboardMarkup(inline_keyboard=rows)
