(function () {
    const pageTranslations = {
        en: {
            kicker: "Password Updated",
            title: "Your password has been changed successfully.",
            text: "You can now sign in with your new password and continue using your Med Tech account.",
            point1_title: "Use your new password",
            point1_text: "Go back to the login page and sign in with the password you just created.",
            point2_title: "Keep it secure",
            point2_text: "Do not share your password and store it somewhere safe if needed.",
            point3_title: "Continue your work",
            point3_text: "Return to Med Tech and keep using appointments, AI tools, and doctor search.",
            btn_login: "Go to login",
            btn_home: "Go to home"
        },
        ru: {
            kicker: "Пароль обновлён",
            title: "Ваш пароль успешно изменён.",
            text: "Теперь вы можете войти с новым паролем и продолжить пользоваться аккаунтом Med Tech.",
            point1_title: "Используйте новый пароль",
            point1_text: "Вернитесь на страницу входа и войдите с паролем, который только что создали.",
            point2_title: "Храните его безопасно",
            point2_text: "Не передавайте пароль другим и при необходимости сохраните его в надёжном месте.",
            point3_title: "Продолжайте работу",
            point3_text: "Вернитесь в Med Tech и продолжайте пользоваться записями, AI-инструментами и поиском врачей.",
            btn_login: "Перейти ко входу",
            btn_home: "На главную"
        }
    };

    function applyPasswordResetCompleteLanguage() {
        const lang = document.documentElement.getAttribute('data-lang') || 'en';
        const dict = pageTranslations[lang] || pageTranslations.en;

        document.querySelectorAll('[data-page-i18n]').forEach(el => {
            const key = el.getAttribute('data-page-i18n');
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });
    }

    document.addEventListener('DOMContentLoaded', applyPasswordResetCompleteLanguage);

    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(applyPasswordResetCompleteLanguage, 0);
        });
    });
})();