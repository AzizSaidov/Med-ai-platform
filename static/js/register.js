(function () {
    const pageTranslations = {
        en: {
            kicker: "Create your account",
            title: "Join Med Tech and access modern healthcare tools.",
            text: "Register once to use AI guidance, doctor search, appointment booking, and a cleaner digital healthcare experience.",
            point1_title: "Smart assistance",
            point1_text: "Get quick help and simple explanations through the AI assistant.",
            point2_title: "Doctor discovery",
            point2_text: "Search doctors and clinics in a calmer and more modern interface.",
            point3_title: "Easy booking",
            point3_text: "Keep appointments and healthcare steps in one organized place.",
            form_title: "Register",
            form_text: "Fill in your details to create a new account.",
            username: "Username",
            email: "Email",
            phone: "Phone",
            avatar: "Avatar",
            password1: "Password",
            password2: "Confirm password",
            first_name: "First name",
            last_name: "Last name",
            submit: "Create account",
            bottom_text: "Already have an account?",
            login_link: "Login",
            first_name_placeholder: "Enter your first name",
            last_name_placeholder: "Enter your last name",
            username_placeholder: "Enter your username",
            email_placeholder: "Enter your email",
            phone_placeholder: "Enter your phone number",
            password_placeholder: "Enter password",
            password_confirm_placeholder: "Confirm password",
        },
        ru: {
            kicker: "Создайте аккаунт",
            title: "Присоединяйтесь к Med Tech и пользуйтесь современными медицинскими инструментами.",
            text: "Зарегистрируйтесь один раз, чтобы пользоваться ИИ-помощником, поиском врачей, записью на приём и более удобным цифровым медицинским сервисом.",
            point1_title: "Умная помощь",
            point1_text: "Получайте быстрые подсказки и простые объяснения через ИИ-помощника.",
            point2_title: "Поиск врачей",
            point2_text: "Ищите врачей и клиники через более спокойный и современный интерфейс.",
            point3_title: "Удобная запись",
            point3_text: "Храните записи и медицинские шаги в одном организованном месте.",
            form_title: "Регистрация",
            form_text: "Заполните данные, чтобы создать новый аккаунт.",
            username: "Имя пользователя",
            email: "Электронная почта",
            phone: "Телефон",
            avatar: "Аватар",
            password1: "Пароль",
            password2: "Подтвердите пароль",
            first_name: "Имя",
            last_name: "Фамилия",
            submit: "Создать аккаунт",
            bottom_text: "Уже есть аккаунт?",
            login_link: "Войти",
            first_name_placeholder: "Введите имя",
            last_name_placeholder: "Введите фамилию",
            username_placeholder: "Введите имя пользователя",
            email_placeholder: "Введите email",
            phone_placeholder: "Введите номер телефона",
            password_placeholder: "Введите пароль",
            password_confirm_placeholder: "Подтвердите пароль",
        },
    };

    function applyRegisterLanguage() {
        const lang = document.documentElement.getAttribute("data-lang") || "en";
        const dict = pageTranslations[lang] || pageTranslations.en;

        document.querySelectorAll("[data-page-i18n]").forEach((el) => {
            const key = el.getAttribute("data-page-i18n");
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });

        const placeholders = {
            id_first_name: dict.first_name_placeholder,
            id_last_name: dict.last_name_placeholder,
            id_username: dict.username_placeholder,
            id_email: dict.email_placeholder,
            id_phone: dict.phone_placeholder,
            id_password: dict.password_placeholder,
            id_password_confirm: dict.password_confirm_placeholder,
        };

        Object.entries(placeholders).forEach(([id, value]) => {
            const field = document.getElementById(id);
            if (field) field.placeholder = value;
        });
    }

    document.addEventListener("DOMContentLoaded", applyRegisterLanguage);
    document.addEventListener("app:languageChanged", applyRegisterLanguage);
})();
