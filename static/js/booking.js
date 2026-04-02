document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const payloadNode = document.getElementById("appointment-schedule-data");
    const form = document.querySelector("[data-schedule-form]");

    if (!payloadNode || !form) {
        return;
    }

    const schedule = JSON.parse(payloadNode.textContent);
    const dateInput = form.querySelector("[name='appointment_date']");
    const timeSelect = form.querySelector("[name='appointment_time']");
    const presetsContainer = form.querySelector("[data-date-presets]");
    const slotGrid = form.querySelector("[data-slot-grid]");
    const emptyState = form.querySelector("[data-slot-empty]");
    const selectedSlot = form.querySelector("[data-selected-slot]");
    const nativeSelect = form.querySelector("[data-native-select]");

    if (!dateInput || !timeSelect || !presetsContainer || !slotGrid || !emptyState || !selectedSlot) {
        return;
    }

    nativeSelect?.classList.add("is-enhanced");

    const copy = {
        en: {
            pickDate: "Choose a date to see available slots.",
            dayUnavailable: "This doctor does not accept appointments on the selected day.",
            noSlots: "No free slots are left for this date. Try another day.",
            selectedEmpty: "No slot selected yet",
            selectedPrefix: "Selected:",
            chooseSlot: "Select a time slot",
            notesPlaceholderBook: "Describe symptoms, goals for the visit, or any extra details...",
            notesPlaceholderEdit: "Update appointment notes...",
            status_pending: "Pending",
            status_confirmed: "Confirmed",
            status_completed: "Completed",
            status_cancelled: "Cancelled",
        },
        ru: {
            pickDate: "Сначала выберите дату, чтобы увидеть свободные слоты.",
            dayUnavailable: "В выбранный день врач не принимает пациентов.",
            noSlots: "На эту дату свободных слотов уже нет. Попробуйте другой день.",
            selectedEmpty: "Слот пока не выбран",
            selectedPrefix: "Выбрано:",
            chooseSlot: "Выберите слот времени",
            notesPlaceholderBook: "Опишите симптомы, цель визита или любые важные детали...",
            notesPlaceholderEdit: "Обновите заметки по записи...",
            status_pending: "В ожидании",
            status_confirmed: "Подтверждено",
            status_completed: "Завершено",
            status_cancelled: "Отменено",
        },
    };

    const bookedByDate = new Map();

    (schedule.bookedSlots || []).forEach((item) => {
        const start = new Date(item.start);
        const dateKey = toDateKey(start);
        const timeKey = toTimeKey(start);
        if (!bookedByDate.has(dateKey)) {
            bookedByDate.set(dateKey, new Set());
        }
        bookedByDate.get(dateKey).add(timeKey);
    });

    function currentLanguage() {
        return document.documentElement.getAttribute("data-lang") || "en";
    }

    function dictionary() {
        return copy[currentLanguage()] || copy.en;
    }

    function toDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function toTimeKey(date) {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    }

    function parseDateInput(value) {
        return new Date(`${value}T00:00:00`);
    }

    function weekdayIndex(date) {
        return (date.getDay() + 6) % 7;
    }

    function formatDateChip(value) {
        return new Intl.DateTimeFormat(currentLanguage(), {
            weekday: "short",
            day: "numeric",
            month: "short",
        }).format(parseDateInput(value));
    }

    function formatSlotRange(timeValue) {
        const [hours, minutes] = timeValue.split(":").map(Number);
        const start = new Date();
        start.setHours(hours, minutes, 0, 0);
        const end = new Date(start.getTime() + schedule.slotDurationMinutes * 60 * 1000);

        const formatter = new Intl.DateTimeFormat(currentLanguage(), {
            hour: "2-digit",
            minute: "2-digit",
        });

        return `${formatter.format(start)} - ${formatter.format(end)}`;
    }

    function setSelectedLabel() {
        const dict = dictionary();
        const dateValue = dateInput.value;
        const timeValue = timeSelect.value;

        if (!dateValue || !timeValue) {
            selectedSlot.textContent = dict.selectedEmpty;
            selectedSlot.classList.add("is-empty");
            return;
        }

        selectedSlot.textContent = `${dict.selectedPrefix} ${formatDateChip(dateValue)}, ${formatSlotRange(timeValue)}`;
        selectedSlot.classList.remove("is-empty");
        selectedSlot.classList.remove("is-updated");
        if (!prefersReducedMotion) {
            window.requestAnimationFrame(() => {
                selectedSlot.classList.add("is-updated");
            });
        }
    }

    function revealPresetChips() {
        const chips = presetsContainer.querySelectorAll(".schedule-date-chip");
        if (prefersReducedMotion) {
            chips.forEach((chip) => chip.classList.add("is-visible"));
            return;
        }

        chips.forEach((chip, index) => {
            chip.style.setProperty("--chip-delay", `${index * 34}ms`);
            window.requestAnimationFrame(() => {
                chip.classList.add("is-visible");
            });
        });
    }

    function revealSlots() {
        const slots = slotGrid.querySelectorAll(".schedule-slot");
        if (prefersReducedMotion) {
            slots.forEach((slot) => slot.classList.add("is-visible"));
            return;
        }

        slots.forEach((slot, index) => {
            slot.style.setProperty("--slot-delay", `${index * 38}ms`);
            window.requestAnimationFrame(() => {
                slot.classList.add("is-visible");
            });
        });
    }

    function buildDatePresets() {
        const values = [];
        const seen = new Set();
        const today = new Date();

        for (let offset = 0; offset < 45 && values.length < 10; offset += 1) {
            const date = new Date(today);
            date.setHours(0, 0, 0, 0);
            date.setDate(today.getDate() + offset);
            const key = toDateKey(date);

            if (schedule.availableDays.includes(weekdayIndex(date)) && !seen.has(key)) {
                values.push(key);
                seen.add(key);
            }
        }

        if (dateInput.value && !seen.has(dateInput.value)) {
            values.unshift(dateInput.value);
        }

        presetsContainer.innerHTML = "";

        values.forEach((value) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "schedule-date-chip";
            button.textContent = formatDateChip(value);
            button.classList.toggle("is-active", value === dateInput.value);
            button.addEventListener("click", () => {
                dateInput.value = value;
                render();
            });
            presetsContainer.append(button);
        });

        revealPresetChips();
    }

    function renderSlots() {
        const dict = dictionary();
        slotGrid.innerHTML = "";

        if (!dateInput.value) {
            emptyState.textContent = dict.pickDate;
            emptyState.hidden = false;
            timeSelect.value = "";
            setSelectedLabel();
            return;
        }

        const selectedDate = parseDateInput(dateInput.value);
        if (!schedule.availableDays.includes(weekdayIndex(selectedDate))) {
            emptyState.textContent = dict.dayUnavailable;
            emptyState.hidden = false;
            timeSelect.value = "";
            setSelectedLabel();
            return;
        }

        const bookedSlots = bookedByDate.get(dateInput.value) || new Set();
        const now = new Date();
        let availableCount = 0;

        Array.from(timeSelect.options)
            .filter((option) => option.value)
            .forEach((option) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "schedule-slot";
                button.textContent = option.textContent;

                const slotDateTime = new Date(`${dateInput.value}T${option.value}:00`);
                const isPast = slotDateTime <= now;
                const isBooked = bookedSlots.has(option.value);
                const isDisabled = isPast || isBooked;

                option.disabled = isDisabled;

                if (isDisabled) {
                    button.classList.add("is-disabled");
                } else {
                    availableCount += 1;
                    button.addEventListener("click", () => {
                        timeSelect.value = option.value;
                        renderSlots();
                    });
                }

                button.classList.toggle("is-active", timeSelect.value === option.value && !isDisabled);
                slotGrid.append(button);
            });

        if (timeSelect.selectedOptions.length && timeSelect.selectedOptions[0].disabled) {
            timeSelect.value = "";
        }

        emptyState.hidden = availableCount > 0;
        if (!emptyState.hidden) {
            emptyState.textContent = dict.noSlots;
        }

        revealSlots();
        setSelectedLabel();
    }

    function applyFieldTranslations() {
        const dict = dictionary();
        const notesField = form.querySelector("[name='notes']");
        const statusField = form.querySelector("[name='status']");

        if (notesField) {
            notesField.placeholder = statusField ? dict.notesPlaceholderEdit : dict.notesPlaceholderBook;
        }

        if (timeSelect.options.length) {
            timeSelect.options[0].textContent = dict.chooseSlot;
        }

        if (statusField) {
            [...statusField.options].forEach((option) => {
                const key = `status_${option.value}`;
                if (dict[key]) {
                    option.textContent = dict[key];
                }
            });
        }
    }

    function render() {
        applyFieldTranslations();
        buildDatePresets();
        renderSlots();
    }

    dateInput.addEventListener("change", render);
    timeSelect.addEventListener("change", renderSlots);
    document.addEventListener("app:languageChanged", render);

    render();
});
