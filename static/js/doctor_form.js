document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".chat-form");
    if (!form) {
        return;
    }

    const translations = {
        en: {
            specialization: "Specialization",
            experience: "Experience (years)",
            consultation_fee: "Consultation fee",
            rating: "Rating",
            status: "Status",
            phone: "Phone",
            address: "Address",
            latitude: "Latitude",
            longitude: "Longitude",
            available_days: "Available days",
            workday_start: "Workday start",
            workday_end: "Workday end",
            slot_duration_minutes: "Slot duration (minutes)",
            bio: "Biography",
            photo: "Photo",
            status_online: "Online",
            status_busy: "Busy",
            status_offline: "Offline",
            weekday_0: "Monday",
            weekday_1: "Tuesday",
            weekday_2: "Wednesday",
            weekday_3: "Thursday",
            weekday_4: "Friday",
            weekday_5: "Saturday",
            weekday_6: "Sunday",
        },
        ru: {
            specialization: "Специализация",
            experience: "Стаж (лет)",
            consultation_fee: "Стоимость консультации",
            rating: "Рейтинг",
            status: "Статус",
            phone: "Телефон",
            address: "Адрес",
            latitude: "Широта",
            longitude: "Долгота",
            available_days: "Доступные дни",
            workday_start: "Начало рабочего дня",
            workday_end: "Конец рабочего дня",
            slot_duration_minutes: "Длительность слота (минут)",
            bio: "Биография",
            photo: "Фото",
            status_online: "Онлайн",
            status_busy: "Занят",
            status_offline: "Не в сети",
            weekday_0: "Понедельник",
            weekday_1: "Вторник",
            weekday_2: "Среда",
            weekday_3: "Четверг",
            weekday_4: "Пятница",
            weekday_5: "Суббота",
            weekday_6: "Воскресенье",
        },
    };

    function currentLanguage() {
        return document.documentElement.getAttribute("data-lang") || "en";
    }

    function t(key) {
        const dict = translations[currentLanguage()] || translations.en;
        return dict[key] || translations.en[key] || key;
    }

    function relabelField(name, key) {
        const field = form.querySelector(`[name='${name}']`);
        if (!field) {
            return;
        }

        const label = form.querySelector(`label[for='${field.id}']`);
        if (label) {
            label.textContent = t(key);
        }
    }

    function localizeStatusOptions() {
        const select = form.querySelector("[name='status']");
        if (!select) {
            return;
        }

        [...select.options].forEach((option) => {
            if (option.value === "online") option.textContent = t("status_online");
            if (option.value === "busy") option.textContent = t("status_busy");
            if (option.value === "offline") option.textContent = t("status_offline");
        });
    }

    function localizeWeekdayChoices() {
        form.querySelectorAll("input[name='available_days']").forEach((input) => {
            const label = form.querySelector(`label[for='${input.id}']`);
            if (label) {
                label.textContent = t(`weekday_${input.value}`);
            }
        });
    }

    function applyDoctorFormLanguage() {
        relabelField("specialization", "specialization");
        relabelField("experience", "experience");
        relabelField("consultation_fee", "consultation_fee");
        relabelField("rating", "rating");
        relabelField("status", "status");
        relabelField("phone", "phone");
        relabelField("address", "address");
        relabelField("latitude", "latitude");
        relabelField("longitude", "longitude");
        relabelField("available_days", "available_days");
        relabelField("workday_start", "workday_start");
        relabelField("workday_end", "workday_end");
        relabelField("slot_duration_minutes", "slot_duration_minutes");
        relabelField("bio", "bio");
        relabelField("photo", "photo");
        localizeStatusOptions();
        localizeWeekdayChoices();
    }

    applyDoctorFormLanguage();
    document.addEventListener("app:languageChanged", applyDoctorFormLanguage);
});
