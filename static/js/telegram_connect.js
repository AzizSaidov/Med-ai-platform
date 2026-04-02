(function () {
    const pageTranslations = {
        en: {
            tg_kicker: "Telegram bot",
            tg_title: "Connect Telegram to your Med Tech account and manage quick actions from your phone.",
            tg_text: "The bot works as a mobile companion for the site: it shows appointments, the next visit, doctor catalog, and fast links to the right sections.",
            tg_open_with_code: "Open bot with code",
            tg_open: "Open bot",
            tg_missing_env: "Add TELEGRAM_BOT_USERNAME to .env",
            tg_generate: "Generate a new code",
            tg_disconnect: "Disconnect Telegram",
            tg_site_account: "Site account",
            tg_role: "Role",
            tg_code: "Code",
            tg_create_code: "Create a code",
            tg_how_title: "How to connect it correctly",
            tg_how_text: "A simple flow without confusion between the website account and Telegram.",
            tg_step_1_title: "1. Sign in to the exact Med Tech account you want to connect",
            tg_step_1_text: "If the website is open under a doctor account, Telegram will connect to that doctor. If a patient account is open, it will connect to that patient.",
            tg_step_2_title: "2. Generate a code",
            tg_step_2_text: "The code is one-time and is used only to safely link the current website account to Telegram.",
            tg_step_3_title: "3. Open the bot with the button above",
            tg_step_3_text: "If a deep link is available, the code is passed automatically. This is the easiest and safest way.",
            tg_step_4_title: "4. Or send the code manually",
            tg_manual_prefix: "Manual command:",
            tg_manual_empty: "Generate a code first, then send it in the format",
            tg_features_title: "What the bot can do",
            tg_features_text: "After linking, the menu adapts to the role of the connected account.",
            tg_feature_1: "My appointments / My visits",
            tg_feature_2: "Next visit / Next patient",
            tg_feature_3: "Doctor catalog",
            tg_feature_4: "Account status",
            tg_feature_5: "Quick link to the site and AI",
            tg_status_title: "Connection status",
            tg_connected: "Connected Telegram",
            tg_linked_to: "Linked to account",
            tg_status_empty: "Telegram is not connected yet. Generate a code and open the bot to finish the link.",
            tg_note: "If you need to reconnect another website account, first sign in under that account on the site, then generate a new code and open the bot again."
        },
        ru: {
            tg_kicker: "Telegram бот",
            tg_title: "Подключи Telegram к своему Med Tech аккаунту и управляй быстрыми действиями с телефона.",
            tg_text: "Бот работает как мобильный companion-app для сайта: показывает записи, ближайший приём, каталог врачей и быстрые переходы в нужные разделы.",
            tg_open_with_code: "Открыть бота с кодом",
            tg_open: "Открыть бота",
            tg_missing_env: "Добавь TELEGRAM_BOT_USERNAME в .env",
            tg_generate: "Сгенерировать новый код",
            tg_disconnect: "Отключить Telegram",
            tg_site_account: "Сайт аккаунт",
            tg_role: "Роль",
            tg_code: "Код",
            tg_create_code: "Создай код",
            tg_how_title: "Как подключить правильно",
            tg_how_text: "Простой flow без путаницы между аккаунтом сайта и Telegram.",
            tg_step_1_title: "1. Войди именно в тот Med Tech аккаунт, который хочешь привязать",
            tg_step_1_text: "Если на сайте открыт аккаунт доктора, Telegram привяжется к доктору. Если открыт пациент, привяжется к пациенту.",
            tg_step_2_title: "2. Сгенерируй код",
            tg_step_2_text: "Код одноразовый и нужен только для безопасной привязки текущего сайта-аккаунта к Telegram.",
            tg_step_3_title: "3. Открой бота по кнопке выше",
            tg_step_3_text: "Если доступен deep-link, код передастся автоматически. Это самый удобный и правильный путь.",
            tg_step_4_title: "4. Или отправь код вручную",
            tg_manual_prefix: "Команда для ручной привязки:",
            tg_manual_empty: "Сначала сгенерируй код, затем отправь его в формате",
            tg_features_title: "Что умеет бот",
            tg_features_text: "После привязки меню подстраивается под роль аккаунта.",
            tg_feature_1: "Мои записи / Мои приёмы",
            tg_feature_2: "Ближайший приём / Следующий пациент",
            tg_feature_3: "Каталог врачей",
            tg_feature_4: "Статус аккаунта",
            tg_feature_5: "Переход на сайт и AI",
            tg_status_title: "Статус подключения",
            tg_connected: "Подключённый Telegram",
            tg_linked_to: "Связан с аккаунтом",
            tg_status_empty: "Telegram пока не подключён. Сгенерируй код и открой бота, чтобы завершить привязку.",
            tg_note: "Если нужно переподключиться на другой сайт-аккаунт, сначала зайди под ним на сайт, затем сгенерируй новый код и открой бота снова."
        }
    };

    function applyTelegramConnectLanguage() {
        const lang = document.documentElement.getAttribute("data-lang") || "en";
        const dict = pageTranslations[lang] || pageTranslations.en;

        document.querySelectorAll("[data-page-i18n]").forEach((el) => {
            const key = el.getAttribute("data-page-i18n");
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });
    }

    document.addEventListener("DOMContentLoaded", applyTelegramConnectLanguage);
    document.addEventListener("app:languageChanged", applyTelegramConnectLanguage);
})();
