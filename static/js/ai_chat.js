document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const translations = {
        en: {
            kicker: "AI Assistant",
            title: "Your medical support conversation, with real history.",
            text: "Ask health-related questions, get structured guidance, and keep the conversation in one saved session tied to your account.",
            messages_stored: "Messages stored",
            session_started: "Session started",
            conversation_title: "Conversation",
            conversation_text: "The assistant uses a real AI backend and keeps the discussion history inside your existing AIChatSession.",
            role_user: "You",
            role_assistant: "AI Assistant",
            empty_title: "No messages yet",
            empty_text: "Start the first conversation with a symptom question, appointment preparation request, or general care topic.",
            ask_title: "Ask the assistant",
            ask_text: "Use the assistant for general information and next-step guidance, not as a replacement for an in-person medical diagnosis.",
            providers_title: "Available providers",
            message_label: "Message",
            message_placeholder: "Ask about symptoms, preparing for a visit, or general care guidance...",
            send_button: "Send message",
            clear_button: "Clear conversation",
            tips_title: "Smart care tips",
            tips: [
                "For urgent symptoms such as chest pain, breathing difficulty, heavy bleeding, stroke signs, or seizures, seek emergency care immediately.",
                "The assistant is best for general guidance, visit preparation, and simple symptom questions.",
                "Add timing, severity, and recent changes to get a clearer and more useful answer.",
                "For prescriptions, diagnosis, and urgent treatment decisions, contact a licensed clinician.",
            ],
        },
        ru: {
            kicker: "ИИ-помощник",
            title: "Ваш медицинский чат с историей.",
            text: "Задавайте вопросы о здоровье, получайте подсказки и храните историю диалога.",
            messages_stored: "Сообщений в истории",
            session_started: "Сессия с",
            conversation_title: "Диалог",
            conversation_text: "Ассистент использует реальный AI-бэкенд и хранит историю в AIChatSession.",
            role_user: "Вы",
            role_assistant: "AI помощник",
            empty_title: "Сообщений пока нет",
            empty_text: "Начните чат с вопроса о симптомах, визите или уходе.",
            ask_title: "Спросите ассистента",
            ask_text: "Используйте его для общей информации и подсказок по следующим шагам.",
            providers_title: "Доступные провайдеры",
            message_label: "Сообщение",
            message_placeholder: "Спросите о симптомах, подготовке к визиту или об общих советах по уходу...",
            send_button: "Отправить",
            clear_button: "Очистить чат",
            tips_title: "Полезные советы",
            tips: [
                "При боли в груди, трудном дыхании, сильном кровотечении, признаках инсульта или судорогах немедленно обратитесь за срочной помощью.",
                "Ассистент лучше всего подходит для общих подсказок, подготовки к визиту и простых вопросов о симптомах.",
                "Указывайте, когда начался симптом, насколько он сильный и что изменилось, чтобы ответ был точнее.",
                "За диагнозом, рецептами и срочным лечением нужно обращаться к лицензированному врачу.",
            ],
        },
    };

    let tipIndex = 0;
    let tipTimer = null;

    function animateThread() {
        const bubbles = document.querySelectorAll(".chat-bubble");
        if (!bubbles.length) {
            return;
        }

        if (prefersReducedMotion) {
            bubbles.forEach((bubble) => bubble.classList.add("is-visible"));
            return;
        }

        bubbles.forEach((bubble, index) => {
            window.setTimeout(() => {
                bubble.classList.add("is-visible");
            }, 90 * index);
        });
    }

    function setupComposer() {
        const form = document.querySelector(".ai-compose-form");
        const textarea = form?.querySelector("textarea");
        const submitButton = form?.querySelector("button[type='submit']");
        const emptyCard = document.querySelector(".empty-card");

        if (!form || !textarea || !submitButton) {
            return;
        }

        const syncState = () => {
            const hasValue = textarea.value.trim().length > 0;
            form.classList.toggle("is-active", hasValue);
            submitButton.classList.toggle("is-ready", hasValue);
            if (emptyCard) {
                emptyCard.classList.toggle("is-listening", hasValue);
            }
        };

        syncState();
        textarea.addEventListener("input", syncState);
        textarea.addEventListener("focus", () => form.classList.add("is-focused"));
        textarea.addEventListener("blur", () => form.classList.remove("is-focused"));
        form.addEventListener("submit", () => {
            form.classList.add("is-submitting");
            submitButton.classList.add("is-sending");
        });
    }

    function updateTip(lang, immediate = false) {
        const tipNode = document.querySelector("[data-ai-tip-text]");
        const progressNode = document.querySelector("[data-ai-tip-progress]");
        if (!tipNode) {
            return;
        }

        const dict = translations[lang] || translations.en;
        const tips = dict.tips || translations.en.tips;
        if (!tips.length) {
            return;
        }

        if (progressNode) {
            progressNode.style.animation = "none";
            progressNode.offsetHeight;
            progressNode.style.animation = "";
        }

        if (immediate) {
            tipNode.textContent = tips[tipIndex % tips.length];
            return;
        }

        tipNode.classList.add("is-switching");
        window.setTimeout(() => {
            tipNode.textContent = tips[tipIndex % tips.length];
            tipNode.classList.remove("is-switching");
        }, 180);
    }

    function startTipsRotation() {
        if (tipTimer) {
            window.clearInterval(tipTimer);
        }

        const lang = document.documentElement.getAttribute("data-lang") || "en";
        tipIndex = 0;
        updateTip(lang, true);

        tipTimer = window.setInterval(() => {
            const currentLang = document.documentElement.getAttribute("data-lang") || "en";
            const dict = translations[currentLang] || translations.en;
            const tips = dict.tips || translations.en.tips;
            tipIndex = (tipIndex + 1) % tips.length;
            updateTip(currentLang);
        }, 5800);
    }

    function applyAiChatLanguage() {
        const lang = document.documentElement.getAttribute("data-lang") || "en";
        const dict = translations[lang] || translations.en;

        document.querySelectorAll("[data-page-i18n]").forEach((element) => {
            const key = element.getAttribute("data-page-i18n");
            if (dict[key]) {
                element.textContent = dict[key];
            }
        });

        document.querySelectorAll("[data-message-role]").forEach((element) => {
            const role = element.getAttribute("data-message-role");
            element.textContent = role === "user" ? dict.role_user : dict.role_assistant;
        });

        const messageField = document.getElementById("id_message");
        const messageLabel = document.querySelector("label[for='id_message']");
        if (messageField) {
            messageField.placeholder = dict.message_placeholder;
        }
        if (messageLabel) {
            messageLabel.textContent = dict.message_label;
        }

        tipIndex = 0;
        updateTip(lang, true);
    }

    applyAiChatLanguage();
    startTipsRotation();
    animateThread();
    setupComposer();
    document.addEventListener("app:languageChanged", applyAiChatLanguage);
});
