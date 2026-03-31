(function () {
    const translations = {
        en: {
            kicker: "Appointments",
            kicker_doctor: "Appointment workspace",
            title: "Your appointments, all in one place.",
            title_doctor: "Related appointments, ready for review.",
            text: "View upcoming visits, completed appointments, and important details in a calmer and more organized interface.",
            text_doctor: "Review appointments linked to your doctor profile, update details when needed, and keep patient communication clear.",
            summary_total: "Total",
            summary_upcoming: "Upcoming",
            list_title: "Appointment list",
            list_text: "Track status, doctors, dates, and visit notes with actions shown only when they make sense for your role.",
            patient_label: "Patient",
            specialization_label: "Specialization",
            address_label: "Address",
            notes_label: "Notes",
            notes_empty: "No additional notes for this appointment.",
            btn_view: "View details",
            btn_edit: "Edit",
            btn_cancel: "Cancel appointment",
            empty_title: "No appointments yet.",
            empty_text: "You do not have any booked appointments right now. Start by exploring doctors and booking your first visit.",
            empty_text_doctor: "Appointments connected to your doctor profile will appear here as soon as patients start booking.",
            btn_open_profile: "Open doctor profile",
            btn_find_doctors: "Find doctors",
            btn_open_ai: "Open AI Assistant"
        },
        ru: {
            kicker: "\u0417\u0430\u043f\u0438\u0441\u0438",
            kicker_doctor: "\u0420\u0430\u0431\u043e\u0447\u0435\u0435 \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e \u0437\u0430\u043f\u0438\u0441\u0435\u0439",
            title: "\u0412\u0430\u0448\u0438 \u0437\u0430\u043f\u0438\u0441\u0438 \u0432 \u043e\u0434\u043d\u043e\u043c \u043c\u0435\u0441\u0442\u0435.",
            title_doctor: "\u0417\u0430\u043f\u0438\u0441\u0438, \u0433\u043e\u0442\u043e\u0432\u044b\u0435 \u043a \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u0443.",
            text: "\u0421\u043c\u043e\u0442\u0440\u0438\u0442\u0435 \u0431\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435 \u0432\u0438\u0437\u0438\u0442\u044b, \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043d\u043d\u044b\u0435 \u0437\u0430\u043f\u0438\u0441\u0438 \u0438 \u0432\u0430\u0436\u043d\u044b\u0435 \u0434\u0435\u0442\u0430\u043b\u0438.",
            text_doctor: "\u041f\u0440\u043e\u0441\u043c\u0430\u0442\u0440\u0438\u0432\u0430\u0439\u0442\u0435 \u0437\u0430\u043f\u0438\u0441\u0438, \u0441\u0432\u044f\u0437\u0430\u043d\u043d\u044b\u0435 \u0441 \u0432\u0430\u0448\u0438\u043c \u043f\u0440\u043e\u0444\u0438\u043b\u0435\u043c \u0432\u0440\u0430\u0447\u0430.",
            summary_total: "\u0412\u0441\u0435\u0433\u043e",
            summary_upcoming: "\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435",
            list_title: "\u0421\u043f\u0438\u0441\u043e\u043a \u0437\u0430\u043f\u0438\u0441\u0435\u0439",
            list_text: "\u0421\u043b\u0435\u0434\u0438\u0442\u0435 \u0437\u0430 \u0441\u0442\u0430\u0442\u0443\u0441\u043e\u043c, \u0432\u0440\u0430\u0447\u0430\u043c\u0438, \u0434\u0430\u0442\u0430\u043c\u0438 \u0438 \u0437\u0430\u043c\u0435\u0442\u043a\u0430\u043c\u0438.",
            patient_label: "\u041f\u0430\u0446\u0438\u0435\u043d\u0442",
            specialization_label: "\u0421\u043f\u0435\u0446\u0438\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f",
            address_label: "\u0410\u0434\u0440\u0435\u0441",
            notes_label: "\u0417\u0430\u043c\u0435\u0442\u043a\u0438",
            notes_empty: "\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0445 \u0437\u0430\u043c\u0435\u0442\u043e\u043a \u043d\u0435\u0442.",
            btn_view: "\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u043e",
            btn_edit: "\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c",
            btn_cancel: "\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u0437\u0430\u043f\u0438\u0441\u044c",
            empty_title: "\u0417\u0430\u043f\u0438\u0441\u0435\u0439 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442.",
            empty_text: "\u0423 \u0432\u0430\u0441 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u0437\u0430\u043f\u0438\u0441\u0435\u0439. \u041d\u0430\u0447\u043d\u0438\u0442\u0435 \u0441 \u043f\u043e\u0438\u0441\u043a\u0430 \u0432\u0440\u0430\u0447\u0430 \u0438 \u0431\u0440\u043e\u043d\u0438.",
            empty_text_doctor: "\u0417\u0430\u043f\u0438\u0441\u0438, \u0441\u0432\u044f\u0437\u0430\u043d\u043d\u044b\u0435 \u0441 \u0432\u0430\u0448\u0438\u043c \u043f\u0440\u043e\u0444\u0438\u043b\u0435\u043c \u0432\u0440\u0430\u0447\u0430, \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c.",
            btn_open_profile: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u0440\u0430\u0447\u0430",
            btn_find_doctors: "\u041d\u0430\u0439\u0442\u0438 \u0432\u0440\u0430\u0447\u0435\u0439",
            btn_open_ai: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0418\u0418-\u043f\u043e\u043c\u043e\u0449\u043d\u0438\u043a"
        }
    };

    function applyAppointmentsLanguage() {
        const lang = document.documentElement.getAttribute("data-lang") || "en";
        const dict = translations[lang] || translations.en;

        document.querySelectorAll("[data-page-i18n]").forEach((element) => {
            const key = element.getAttribute("data-page-i18n");
            if (dict[key]) {
                element.textContent = dict[key];
            }
        });
    }

    applyAppointmentsLanguage();
    document.addEventListener("DOMContentLoaded", applyAppointmentsLanguage);
    document.addEventListener("app:languageChanged", applyAppointmentsLanguage);
})();
