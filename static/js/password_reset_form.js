(function () {
    const pageTranslations = {
        en: {
            kicker: "Password Recovery",
            title: "Reset your password and get back into your account.",
            text: "Enter your email address and we will send you instructions to create a new password.",
            point1_title: "Enter your email",
            point1_text: "Use the email address connected to your Med Tech account.",
            point2_title: "Check your inbox",
            point2_text: "Open the message with password reset instructions.",
            point3_title: "Create a new password",
            point3_text: "Set a new password and continue using your account safely.",
            form_title: "Reset Password",
            form_text: "Enter your email and we will send you a reset link.",
            email: "Email",
            submit: "Send reset link",
            back_login: "Back to login",
            email_placeholder: "Enter your email",
        },
        ru: {
            kicker: "Восстановление пароля",
            title: "Сбросьте пароль и вернитесь в свой аккаунт.",
            text: "Введите ваш email, и мы отправим инструкцию для создания нового пароля.",
            point1_title: "Введите email",
            point1_text: "Используйте адрес электронной почты, связанный с вашим аккаунтом Med Tech.",
            point2_title: "Проверьте почту",
            point2_text: "Откройте письмо с инструкцией по восстановлению пароля.",
            point3_title: "Создайте новый пароль",
            point3_text: "Установите новый пароль и продолжайте безопасно пользоваться аккаунтом.",
            form_title: "Сброс пароля",
            form_text: "Введите email, и мы отправим вам ссылку для сброса.",
            email: "Электронная почта",
            submit: "Отправить ссылку",
            back_login: "Назад ко входу",
            email_placeholder: "Введите email",
        },
    };

    function applyPasswordResetLanguage() {
        const lang = document.documentElement.getAttribute("data-lang") || "en";
        const dict = pageTranslations[lang] || pageTranslations.en;

        document.querySelectorAll("[data-page-i18n]").forEach((el) => {
            const key = el.getAttribute("data-page-i18n");
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });

        const email = document.getElementById("id_email");
        if (email) email.placeholder = dict.email_placeholder;
    }

    document.addEventListener("DOMContentLoaded", applyPasswordResetLanguage);
    document.addEventListener("app:languageChanged", applyPasswordResetLanguage);
})();
