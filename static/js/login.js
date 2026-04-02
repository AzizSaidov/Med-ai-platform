(function () {
    const pageTranslations = {
        en: {
            kicker: "Welcome back",
            title: "Sign in and continue your healthcare journey.",
            text: "Access doctor search, AI guidance, and appointment tools through one clean and simple platform.",
            point1_title: "Fast guidance",
            point1_text: "Use the AI assistant for quick support and clearer next steps.",
            point2_title: "Doctor access",
            point2_text: "Search specialists and clinics with a calmer, easier flow.",
            point3_title: "Appointments",
            point3_text: "Keep your visits and booking flow organized in one place.",
            stat_doctors: "Specialists",
            stat_support: "AI Support",
            stat_rating: "Satisfaction",
            form_title: "Login",
            form_text: "Enter your account details to continue.",
            username: "Username",
            password: "Password",
            forgot: "Forgot password?",
            submit: "Sign in",
            bottom_text: "Don't have an account?",
            register_link: "Register",
            username_placeholder: "Enter your username",
            password_placeholder: "Enter your password",
        },
        ru: {
            kicker: "С возвращением",
            title: "Войдите и продолжите свой путь в Med Tech.",
            text: "Откройте поиск врачей, ИИ-помощника и инструменты записи через одну чистую и удобную платформу.",
            point1_title: "Быстрая помощь",
            point1_text: "Используйте ИИ-помощника для быстрых подсказок и более понятных следующих шагов.",
            point2_title: "Доступ к врачам",
            point2_text: "Ищите специалистов и клиники через спокойный и удобный интерфейс.",
            point3_title: "Записи",
            point3_text: "Держите визиты и запись на приём в одном месте.",
            stat_doctors: "Специалистов",
            stat_support: "ИИ-поддержка",
            stat_rating: "Удовлетворённость",
            form_title: "Вход",
            form_text: "Введите данные аккаунта, чтобы продолжить.",
            username: "Имя пользователя",
            password: "Пароль",
            forgot: "Забыли пароль?",
            submit: "Войти",
            bottom_text: "Нет аккаунта?",
            register_link: "Зарегистрироваться",
            username_placeholder: "Введите имя пользователя",
            password_placeholder: "Введите пароль",
        },
    };

    function applyLoginLanguage() {
        const lang = document.documentElement.getAttribute("data-lang") || "en";
        const dict = pageTranslations[lang] || pageTranslations.en;

        document.querySelectorAll("[data-page-i18n]").forEach((el) => {
            const key = el.getAttribute("data-page-i18n");
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });

        const username = document.getElementById("id_username");
        const password = document.getElementById("id_password");
        if (username) username.placeholder = dict.username_placeholder;
        if (password) password.placeholder = dict.password_placeholder;
    }

    document.addEventListener("DOMContentLoaded", applyLoginLanguage);
    document.addEventListener("app:languageChanged", applyLoginLanguage);
})();
