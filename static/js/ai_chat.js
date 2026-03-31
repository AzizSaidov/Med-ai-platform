document.addEventListener("DOMContentLoaded", () => {
    const translations = {
        en: {
            kicker: "AI Assistant",
            title: "Your medical support conversation, with real history.",
            text: "Ask health-related questions, get structured guidance, and keep the conversation in one saved session tied to your account.",
            messages_stored: "Messages stored",
            session_started: "Session started",
            conversation_title: "Conversation",
            conversation_text: "The assistant uses a real AI backend and keeps the discussion history inside your existing AIChatSession.",
            empty_title: "No messages yet",
            empty_text: "Start the first conversation with a symptom question, appointment preparation request, or general care topic.",
            ask_title: "Ask the assistant",
            ask_text: "Use the assistant for general information and next-step guidance, not as a replacement for an in-person medical diagnosis.",
            providers_title: "Available providers",
            send_button: "Send message",
            clear_button: "Clear conversation",
            warning_note: "For urgent symptoms such as chest pain, breathing difficulty, heavy bleeding, stroke signs, or seizures, seek emergency care immediately."
        },
        ru: {
            kicker: "\u0418\u0418-\u043f\u043e\u043c\u043e\u0449\u043d\u0438\u043a",
            title: "\u0412\u0430\u0448 \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0441\u043a\u0438\u0439 \u0447\u0430\u0442 \u0441 \u0438\u0441\u0442\u043e\u0440\u0438\u0435\u0439.",
            text: "\u0417\u0430\u0434\u0430\u0432\u0430\u0439\u0442\u0435 \u0432\u043e\u043f\u0440\u043e\u0441\u044b \u043e \u0437\u0434\u043e\u0440\u043e\u0432\u044c\u0435, \u043f\u043e\u043b\u0443\u0447\u0430\u0439\u0442\u0435 \u043f\u043e\u0434\u0441\u043a\u0430\u0437\u043a\u0438 \u0438 \u0445\u0440\u0430\u043d\u0438\u0442\u0435 \u0438\u0441\u0442\u043e\u0440\u0438\u044e \u0434\u0438\u0430\u043b\u043e\u0433\u0430.",
            messages_stored: "\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0439 \u0432 \u0438\u0441\u0442\u043e\u0440\u0438\u0438",
            session_started: "\u0421\u0435\u0441\u0441\u0438\u044f \u0441",
            conversation_title: "\u0414\u0438\u0430\u043b\u043e\u0433",
            conversation_text: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043d\u0442 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u0442 \u0440\u0435\u0430\u043b\u044c\u043d\u044b\u0439 AI-\u0431\u044d\u043a\u0435\u043d\u0434 \u0438 \u0445\u0440\u0430\u043d\u0438\u0442 \u0438\u0441\u0442\u043e\u0440\u0438\u044e \u0432 AIChatSession.",
            empty_title: "\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0439 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442",
            empty_text: "\u041d\u0430\u0447\u043d\u0438\u0442\u0435 \u0447\u0430\u0442 \u0441 \u0432\u043e\u043f\u0440\u043e\u0441\u0430 \u043e \u0441\u0438\u043c\u043f\u0442\u043e\u043c\u0430\u0445, \u0432\u0438\u0437\u0438\u0442\u0435 \u0438\u043b\u0438 \u0443\u0445\u043e\u0434\u0435.",
            ask_title: "\u0421\u043f\u0440\u043e\u0441\u0438\u0442\u0435 \u0430\u0441\u0441\u0438\u0441\u0442\u0435\u043d\u0442\u0430",
            ask_text: "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435 \u0435\u0433\u043e \u0434\u043b\u044f \u043e\u0431\u0449\u0435\u0439 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0438 \u0438 \u043f\u043e\u0434\u0441\u043a\u0430\u0437\u043e\u043a \u043f\u043e \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u043c \u0448\u0430\u0433\u0430\u043c.",
            providers_title: "\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u044b\u0435 \u043f\u0440\u043e\u0432\u0430\u0439\u0434\u0435\u0440\u044b",
            send_button: "\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c",
            clear_button: "\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c \u0447\u0430\u0442",
            warning_note: "\u041f\u0440\u0438 \u0431\u043e\u043b\u0438 \u0432 \u0433\u0440\u0443\u0434\u0438, \u0442\u0440\u0443\u0434\u043d\u043e\u043c \u0434\u044b\u0445\u0430\u043d\u0438\u0438, \u0441\u0438\u043b\u044c\u043d\u043e\u043c \u043a\u0440\u043e\u0432\u043e\u0442\u0435\u0447\u0435\u043d\u0438\u0438, \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0430\u0445 \u0438\u043d\u0441\u0443\u043b\u044c\u0442\u0430 \u0438\u043b\u0438 \u0441\u0443\u0434\u043e\u0440\u043e\u0433\u0430\u0445 \u043d\u0435\u043c\u0435\u0434\u043b\u0435\u043d\u043d\u043e \u043e\u0431\u0440\u0430\u0442\u0438\u0442\u0435\u0441\u044c \u0437\u0430 \u0441\u0440\u043e\u0447\u043d\u043e\u0439 \u043f\u043e\u043c\u043e\u0449\u044c\u044e."
        }
    };

    function applyAiChatLanguage() {
        const lang = document.documentElement.getAttribute("data-lang") || "en";
        const dict = translations[lang] || translations.en;

        document.querySelectorAll("[data-page-i18n]").forEach((element) => {
            const key = element.getAttribute("data-page-i18n");
            if (dict[key]) {
                element.textContent = dict[key];
            }
        });
    }

    applyAiChatLanguage();
    document.addEventListener("app:languageChanged", applyAiChatLanguage);
});
