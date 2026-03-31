(function () {
    const pageTranslations = {
        en: {
            kicker: "Email Sent",
            title: "Password reset instructions have been sent.",
            text: "If an account exists for the email you entered, you will receive a message with instructions to reset your password.",
            point1_title: "Check your inbox",
            point1_text: "Open your email and look for the message with the reset link.",
            point2_title: "Check spam folder",
            point2_text: "If you do not see the email, check spam or junk folders as well.",
            point3_title: "Use the link",
            point3_text: "Follow the link in the email to set a new password securely.",
            btn_login: "Back to login",
            btn_home: "Go to home"
        },
        ru: {
            kicker: "Письмо отправлено",
            title: "Инструкция по сбросу пароля отправлена.",
            text: "Если аккаунт с таким email существует, вы получите письмо с инструкцией по сбросу пароля.",
            point1_title: "Проверьте входящие",
            point1_text: "Откройте почту и найдите письмо со ссылкой для сброса.",
            point2_title: "Проверьте спам",
            point2_text: "Если письма не видно, проверьте папку спам или нежелательную почту.",
            point3_title: "Перейдите по ссылке",
            point3_text: "Используйте ссылку из письма, чтобы безопасно задать новый пароль.",
            btn_login: "Назад ко входу",
            btn_home: "На главную"
        }
    };

    function applyPasswordResetDoneLanguage() {
        const lang = document.documentElement.getAttribute('data-lang') || 'en';
        const dict = pageTranslations[lang] || pageTranslations.en;

        document.querySelectorAll('[data-page-i18n]').forEach(el => {
            const key = el.getAttribute('data-page-i18n');
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });
    }

    document.addEventListener('DOMContentLoaded', applyPasswordResetDoneLanguage);

    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(applyPasswordResetDoneLanguage, 0);
        });
    });
})();