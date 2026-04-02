(function () {
    const pageTranslations = {
        en: {
            kicker: "Email Sent",
            title: "Check your inbox for the reset link.",
            text: "If an account exists for the email you entered, you will receive a message with instructions to reset your password.",
            point1_title: "Open your email",
            point1_text: "Look for the password reset message sent from Med Tech.",
            point2_title: "Check spam too",
            point2_text: "If you do not see the message in your inbox, check spam or junk folders.",
            point3_title: "Use the link",
            point3_text: "Open the reset link in the email to continue creating a new password.",
            btn_login: "Back to login",
            btn_home: "Go to home",
        },
        ru: {
            kicker: "Письмо отправлено",
            title: "Проверьте почту для ссылки на сброс пароля.",
            text: "Если аккаунт с таким email существует, вы получите письмо с инструкцией по сбросу пароля.",
            point1_title: "Откройте почту",
            point1_text: "Найдите письмо для сброса пароля от Med Tech.",
            point2_title: "Проверьте спам",
            point2_text: "Если письма нет во входящих, проверьте папки спама и нежелательной почты.",
            point3_title: "Перейдите по ссылке",
            point3_text: "Откройте ссылку из письма, чтобы создать новый пароль.",
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
