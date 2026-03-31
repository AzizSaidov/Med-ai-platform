document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const translations = {
        en: {
            hero_kicker: "Medical dashboard",
            hero_title: "Your health,\nfully in control.",
            hero_text: "One place for doctors, appointments, and AI-powered guidance. Built to feel clear, modern, and presentation-ready.",
            hero_btn_doctors: "Find a doctor",
            hero_btn_appointments: "My appointments",
            hero_btn_profile: "My doctor profile",
            hero_btn_create: "Create doctor profile",
            stat_upcoming: "Upcoming",
            stat_records: "Records",
            stat_ai: "AI support",
            summary_label: "Today overview",
            summary_title: "Your workspace",
            summary_status: "Ready",
            summary_item_1_title: "Doctors",
            summary_item_1_text: "Search specialists, clinics, and locations.",
            summary_item_2_title: "Appointments",
            summary_item_2_text: "Check bookings and upcoming visits.",
            summary_item_3_title: "AI Assistant",
            summary_item_3_text: "Get fast support and guidance.",
            summary_item_4_title: "Doctor profile",
            summary_item_4_create_title: "Create profile",
            summary_item_4_text: "Manage profile details and patient-facing presentation.",
            card_1_tag: "Doctors",
            card_1_title: "Find the right specialist",
            card_1_text: "Use the doctor map and profile details to find the best match for your needs.",
            card_2_tag: "Appointments",
            card_2_title: "Keep visits organized",
            card_2_text: "Track bookings, dates, status updates, and preparation notes in one clear interface.",
            card_3_tag: "AI Support",
            card_3_title: "AI-powered medical guidance",
            card_3_text: "Ask about symptoms, visit preparation, or care steps in a saved conversation.",
            card_cta: "Open",
            note_label: "Why this dashboard",
            note_title: "Less noise.\nClearer care.",
            note_text: "Built around the flows patients and doctors actually use, with calm navigation between the key pages."
        },
        ru: {
            hero_kicker: "\u041c\u0435\u0434\u0438\u0446\u0438\u043d\u0441\u043a\u0430\u044f \u043f\u0430\u043d\u0435\u043b\u044c",
            hero_title: "\u0412\u0430\u0448\u0435 \u0437\u0434\u043e\u0440\u043e\u0432\u044c\u0435,\n\u043f\u043e\u0434 \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u0435\u043c.",
            hero_text: "\u0412\u0441\u0435 \u0432\u0440\u0430\u0447\u0438, \u0437\u0430\u043f\u0438\u0441\u0438 \u0438 \u0418\u0418-\u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430 \u0432 \u043e\u0434\u043d\u043e\u043c \u0430\u043a\u043a\u0443\u0440\u0430\u0442\u043d\u043e\u043c \u0438\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0435.",
            hero_btn_doctors: "\u041d\u0430\u0439\u0442\u0438 \u0432\u0440\u0430\u0447\u0430",
            hero_btn_appointments: "\u041c\u043e\u0438 \u0437\u0430\u043f\u0438\u0441\u0438",
            hero_btn_profile: "\u041c\u043e\u0439 \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u0440\u0430\u0447\u0430",
            hero_btn_create: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u0440\u0430\u0447\u0430",
            stat_upcoming: "\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435",
            stat_records: "\u0417\u0430\u043f\u0438\u0441\u0438",
            stat_ai: "\u0418\u0418-\u043f\u043e\u043c\u043e\u0449\u044c",
            summary_label: "\u041e\u0431\u0437\u043e\u0440 \u043d\u0430 \u0441\u0435\u0433\u043e\u0434\u043d\u044f",
            summary_title: "\u0412\u0430\u0448\u0435 \u0440\u0430\u0431\u043e\u0447\u0435\u0435 \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e",
            summary_status: "\u0413\u043e\u0442\u043e\u0432\u043e",
            summary_item_1_title: "\u0412\u0440\u0430\u0447\u0438",
            summary_item_1_text: "\u0418\u0449\u0438\u0442\u0435 \u0441\u043f\u0435\u0446\u0438\u0430\u043b\u0438\u0441\u0442\u043e\u0432, \u043a\u043b\u0438\u043d\u0438\u043a\u0438 \u0438 \u043b\u043e\u043a\u0430\u0446\u0438\u0438.",
            summary_item_2_title: "\u0417\u0430\u043f\u0438\u0441\u0438",
            summary_item_2_text: "\u041f\u0440\u043e\u0432\u0435\u0440\u044f\u0439\u0442\u0435 \u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f \u0438 \u0431\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435 \u0432\u0438\u0437\u0438\u0442\u044b.",
            summary_item_3_title: "\u0418\u0418-\u043f\u043e\u043c\u043e\u0449\u043d\u0438\u043a",
            summary_item_3_text: "\u041f\u043e\u043b\u0443\u0447\u0430\u0439\u0442\u0435 \u0431\u044b\u0441\u0442\u0440\u0443\u044e \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0443 \u0438 \u043f\u043e\u0434\u0441\u043a\u0430\u0437\u043a\u0438.",
            summary_item_4_title: "\u041f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u0440\u0430\u0447\u0430",
            summary_item_4_create_title: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c",
            summary_item_4_text: "\u0423\u043f\u0440\u0430\u0432\u043b\u044f\u0439\u0442\u0435 \u0434\u0430\u043d\u043d\u044b\u043c\u0438 \u043f\u0440\u043e\u0444\u0438\u043b\u044f \u0438 \u0435\u0433\u043e \u0432\u0438\u0434\u043e\u043c \u0434\u043b\u044f \u043f\u0430\u0446\u0438\u0435\u043d\u0442\u043e\u0432.",
            card_1_tag: "\u0412\u0440\u0430\u0447\u0438",
            card_1_title: "\u041d\u0430\u0439\u0434\u0438\u0442\u0435 \u043d\u0443\u0436\u043d\u043e\u0433\u043e \u0441\u043f\u0435\u0446\u0438\u0430\u043b\u0438\u0441\u0442\u0430",
            card_1_text: "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435 \u043a\u0430\u0440\u0442\u0443 \u0432\u0440\u0430\u0447\u0435\u0439 \u0438 \u0434\u0435\u0442\u0430\u043b\u0438 \u043f\u0440\u043e\u0444\u0438\u043b\u0435\u0439 \u0434\u043b\u044f \u043f\u043e\u0438\u0441\u043a\u0430.",
            card_2_tag: "\u0417\u0430\u043f\u0438\u0441\u0438",
            card_2_title: "\u0414\u0435\u0440\u0436\u0438\u0442\u0435 \u0432\u0438\u0437\u0438\u0442\u044b \u0432 \u043f\u043e\u0440\u044f\u0434\u043a\u0435",
            card_2_text: "\u0421\u043b\u0435\u0434\u0438\u0442\u0435 \u0437\u0430 \u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f\u043c\u0438, \u0434\u0430\u0442\u0430\u043c\u0438 \u0438 \u0437\u0430\u043c\u0435\u0442\u043a\u0430\u043c\u0438.",
            card_3_tag: "\u0418\u0418-\u043f\u043e\u043c\u043e\u0449\u044c",
            card_3_title: "\u0418\u0418-\u043f\u043e\u043c\u043e\u0449\u044c \u043f\u043e \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0435",
            card_3_text: "\u0417\u0430\u0434\u0430\u0432\u0430\u0439\u0442\u0435 \u0432\u043e\u043f\u0440\u043e\u0441\u044b \u043e \u0441\u0438\u043c\u043f\u0442\u043e\u043c\u0430\u0445, \u043f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0435 \u043a \u0432\u0438\u0437\u0438\u0442\u0443 \u0438 \u0443\u0445\u043e\u0434\u0435.",
            card_cta: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c",
            note_label: "\u0417\u0430\u0447\u0435\u043c \u044d\u0442\u0430 \u043f\u0430\u043d\u0435\u043b\u044c",
            note_title: "\u041c\u0435\u043d\u044c\u0448\u0435 \u0448\u0443\u043c\u0430.\n\u042f\u0441\u043d\u0435\u0435 \u0437\u0430\u0431\u043e\u0442\u0430.",
            note_text: "\u041f\u0435\u0440\u0435\u0445\u043e\u0434\u044b \u043c\u0435\u0436\u0434\u0443 \u043a\u043b\u044e\u0447\u0435\u0432\u044b\u043c\u0438 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430\u043c\u0438 \u043e\u0441\u0442\u0430\u044e\u0442\u0441\u044f \u0441\u043f\u043e\u043a\u043e\u0439\u043d\u044b\u043c\u0438 \u0438 \u043f\u043e\u043d\u044f\u0442\u043d\u044b\u043c\u0438."
        }
    };

    function applyDashboardLanguage() {
        const lang = html.getAttribute("data-lang") || localStorage.getItem("lang") || "en";
        const dict = translations[lang] || translations.en;

        document.querySelectorAll("[data-page-i18n]").forEach((element) => {
            const key = element.dataset.pageI18n;
            if (dict[key]) {
                element.innerHTML = dict[key].replace(/\n/g, "<br>");
            }
        });
    }

    function initDashboardMotion() {
        const elements = document.querySelectorAll(".dashboard-reveal");
        if (!elements.length) {
            return;
        }

        if (prefersReducedMotion) {
            elements.forEach((element) => element.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver((entries, motionObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                motionObserver.unobserve(entry.target);
            });
        }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

        elements.forEach((element) => observer.observe(element));
    }

    function initCountUp() {
        if (prefersReducedMotion) {
            return;
        }

        document.querySelectorAll("[data-countup]").forEach((element) => {
            const target = Number.parseInt(element.dataset.countup || "0", 10);
            if (!Number.isFinite(target)) {
                return;
            }

            const duration = 900;
            const start = performance.now();

            function frame(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                element.textContent = String(Math.round(target * eased));

                if (progress < 1) {
                    requestAnimationFrame(frame);
                } else {
                    element.textContent = String(target);
                }
            }

            requestAnimationFrame(frame);
        });
    }

    function initHeroParallax() {
        if (prefersReducedMotion) {
            return;
        }

        const panel = document.querySelector(".hero__panel");
        if (!panel) {
            return;
        }

        panel.addEventListener("pointermove", (event) => {
            const rect = panel.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            panel.style.transform = `translate3d(${x * 8}px, ${y * 10}px, 0)`;
        });

        panel.addEventListener("pointerleave", () => {
            panel.style.transform = "translate3d(0, 0, 0)";
        });
    }

    applyDashboardLanguage();
    initDashboardMotion();
    initCountUp();
    initHeroParallax();
    document.addEventListener("app:languageChanged", applyDashboardLanguage);
});
