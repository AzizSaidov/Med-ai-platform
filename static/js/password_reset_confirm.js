(function () {
    const pageTranslations = {
        en: {
            kicker: "Create New Password",
            title: "Set a new password for your account.",
            text: "Choose a strong password to keep your account safe and secure.",
            point1_title: "Use a strong password",
            point1_text: "Create a password that is hard to guess and different from your old one.",
            point2_title: "Confirm it carefully",
            point2_text: "Enter the same password in both fields to avoid mistakes.",
            point3_title: "Save and continue",
            point3_text: "After saving, you will be able to log in with your new password.",
            form_title: "New Password",
            form_text: "Enter your new password below.",
            new_password1: "New password",
            new_password2: "Confirm new password",
            submit: "Save new password",
            invalid_kicker: "Invalid Link",
            invalid_title: "This password reset link is no longer valid.",
            invalid_text: "The link may have expired or already been used. Please request a new password reset email.",
            invalid_btn_1: "Request a new link",
            invalid_btn_2: "Back to login",
            new_password1_placeholder: "Enter new password",
            new_password2_placeholder: "Confirm new password",
        },
        ru: {
            kicker: "Новый пароль",
            title: "Задайте новый пароль для вашего аккаунта.",
            text: "Выберите надёжный пароль, чтобы защитить свой аккаунт.",
            point1_title: "Используйте надёжный пароль",
            point1_text: "Создайте пароль, который сложно угадать и который отличается от старого.",
            point2_title: "Подтвердите его внимательно",
            point2_text: "Введите один и тот же пароль в оба поля, чтобы избежать ошибок.",
            point3_title: "Сохраните и продолжайте",
            point3_text: "После сохранения вы сможете войти с новым паролем.",
            form_title: "Новый пароль",
            form_text: "Введите новый пароль ниже.",
            new_password1: "Новый пароль",
            new_password2: "Подтвердите новый пароль",
            submit: "Сохранить новый пароль",
            invalid_kicker: "Недействительная ссылка",
            invalid_title: "Эта ссылка для сброса пароля больше недействительна.",
            invalid_text: "Ссылка могла истечь или уже быть использована. Пожалуйста, запросите новое письмо для сброса пароля.",
            invalid_btn_1: "Запросить новую ссылку",
            invalid_btn_2: "Назад ко входу",
            new_password1_placeholder: "Введите новый пароль",
            new_password2_placeholder: "Подтвердите новый пароль",
        },
    };

    function applyPasswordResetConfirmLanguage() {
        const lang = document.documentElement.getAttribute("data-lang") || "en";
        const dict = pageTranslations[lang] || pageTranslations.en;

        document.querySelectorAll("[data-page-i18n]").forEach((el) => {
            const key = el.getAttribute("data-page-i18n");
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });

        const newPassword1 = document.getElementById("id_new_password1");
        const newPassword2 = document.getElementById("id_new_password2");
        if (newPassword1) newPassword1.placeholder = dict.new_password1_placeholder;
        if (newPassword2) newPassword2.placeholder = dict.new_password2_placeholder;
    }

    document.addEventListener("DOMContentLoaded", applyPasswordResetConfirmLanguage);
    document.addEventListener("app:languageChanged", applyPasswordResetConfirmLanguage);
})();
