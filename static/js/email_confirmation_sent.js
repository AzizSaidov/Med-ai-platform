(function () {
    const pageTranslations = {
        en: {
            kicker: "Confirmation Sent",
            title: "We sent a confirmation email to your inbox.",
            text: "Please check your email and click the verification link to activate your account.",
            point1_title: "Check your inbox",
            point1_text: "Open your email and find the verification message from Med Tech.",
            point2_title: "Check spam folder",
            point2_text: "If the message is not in your inbox, check spam or junk folders too.",
            point3_title: "Click the link",
            point3_text: "Use the verification link in the email to activate your account.",
            btn_login: "Back to login",
            btn_home: "Go to home",
        },
        ru: {
            kicker: "Подтверждение отправлено",
            title: "Мы отправили письмо с подтверждением на вашу почту.",
            text: "Проверьте email и перейдите по ссылке подтверждения, чтобы активировать аккаунт.",
            point1_title: "Проверьте входящие",
            point1_text: "Откройте почту и найдите письмо от Med Tech.",
            point2_title: "Проверьте спам",
            point2_text: "Если письма нет во входящих, проверьте спам и нежелательную почту.",
            point3_title: "Перейдите по ссылке",
            point3_text: "Используйте ссылку из письма, чтобы активировать аккаунт.",
            btn_login: "Назад ко входу",
            btn_home: "На главную",
        },
    };

    function applyLanguage() {
        const lang = document.documentElement.getAttribute("data-lang") || "en";
        const dict = pageTranslations[lang] || pageTranslations.en;
        document.querySelectorAll("[data-page-i18n]").forEach((el) => {
            const key = el.getAttribute("data-page-i18n");
            if (dict[key]) el.textContent = dict[key];
        });
    }

    document.addEventListener("DOMContentLoaded", applyLanguage);
    document.addEventListener("app:languageChanged", applyLanguage);
})();
