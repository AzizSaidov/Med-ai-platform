document.addEventListener("DOMContentLoaded", () => {
    const doctorsElement = document.getElementById("doctors-data");
    const html = document.documentElement;

    if (!doctorsElement || typeof L === "undefined") {
        return;
    }

    const translations = {
        en: {
            kicker: "Doctors map",
            title: "Find doctors and clinics on the map",
            text: "Explore available specialists, clinic points, and healthcare locations through a clean interactive map with role-aware actions.",
            available_label: "Available profiles",
            available_text: "Doctors with map data",
            note_has_profile: "Your doctor tools are active. Use the public map to review how profiles look to patients, then open your private profile workspace when you need to edit details.",
            note_no_profile: "You can create a doctor profile whenever you are ready. Until then, the public map still helps you review the patient-facing experience.",
            btn_open_profile: "Open my doctor profile",
            btn_create_profile: "Create doctor profile",
            search_label: "Search",
            search_placeholder: "Search doctors, specialization, address...",
            specialization_label: "Specialization",
            all_specializations: "All specializations",
            status_label: "Status",
            all_statuses: "All statuses",
            status_online: "Online",
            status_busy: "Busy",
            status_offline: "Offline",
            map_title: "Live doctors map",
            map_text: "Tap a marker to see doctor information and the most relevant action for your role.",
            list_title: "Doctor list",
            list_text: "Browse available specialists and jump into booking or profile management quickly.",
            results_label: "results",
            empty_title: "Nothing found",
            empty_text: "Try another search or filter.",
            book_now: "Book appointment",
            open_profile: "Open profile",
            my_profile: "Open my profile",
            specialization_value: "Specialization",
            rating_value: "Rating",
            experience_value: "Experience",
            years: "yrs",
            status_value: "Status",
            address_value: "Address",
            phone_value: "Phone",
            email_value: "Email",
            fee_value: "Fee",
            no_address: "Address not specified",
            no_phone: "Not specified",
            no_bio: "No description yet."
        },
        ru: {
            kicker: "\u041a\u0430\u0440\u0442\u0430 \u0432\u0440\u0430\u0447\u0435\u0439",
            title: "\u041d\u0430\u0439\u0434\u0438\u0442\u0435 \u0432\u0440\u0430\u0447\u0435\u0439 \u0438 \u043a\u043b\u0438\u043d\u0438\u043a\u0438 \u043d\u0430 \u043a\u0430\u0440\u0442\u0435",
            text: "\u0418\u0437\u0443\u0447\u0430\u0439\u0442\u0435 \u0441\u043f\u0435\u0446\u0438\u0430\u043b\u0438\u0441\u0442\u043e\u0432 \u0438 \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0441\u043a\u0438\u0435 \u043b\u043e\u043a\u0430\u0446\u0438\u0438 \u0447\u0435\u0440\u0435\u0437 \u0447\u0438\u0441\u0442\u0443\u044e \u0438\u043d\u0442\u0435\u0440\u0430\u043a\u0442\u0438\u0432\u043d\u0443\u044e \u043a\u0430\u0440\u0442\u0443.",
            available_label: "\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u044b\u0435 \u043f\u0440\u043e\u0444\u0438\u043b\u0438",
            available_text: "\u0412\u0440\u0430\u0447\u0438 \u0441 \u043a\u043e\u043e\u0440\u0434\u0438\u043d\u0430\u0442\u0430\u043c\u0438",
            note_has_profile: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u044b \u0432\u0440\u0430\u0447\u0430 \u0443\u0436\u0435 \u0430\u043a\u0442\u0438\u0432\u043d\u044b. \u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435 \u043a\u0430\u0440\u0442\u0443, \u0447\u0442\u043e\u0431\u044b \u0443\u0432\u0438\u0434\u0435\u0442\u044c, \u043a\u0430\u043a \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u044b\u0433\u043b\u044f\u0434\u0438\u0442 \u0434\u043b\u044f \u043f\u0430\u0446\u0438\u0435\u043d\u0442\u043e\u0432.",
            note_no_profile: "\u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u0441\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u0440\u0430\u0447\u0430 \u0432 \u043b\u044e\u0431\u043e\u0439 \u043c\u043e\u043c\u0435\u043d\u0442.",
            btn_open_profile: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043c\u043e\u0439 \u043f\u0440\u043e\u0444\u0438\u043b\u044c",
            btn_create_profile: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u0440\u0430\u0447\u0430",
            search_label: "\u041f\u043e\u0438\u0441\u043a",
            search_placeholder: "\u0418\u0449\u0438\u0442\u0435 \u0432\u0440\u0430\u0447\u0435\u0439, \u0441\u043f\u0435\u0446\u0438\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044e, \u0430\u0434\u0440\u0435\u0441...",
            specialization_label: "\u0421\u043f\u0435\u0446\u0438\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f",
            all_specializations: "\u0412\u0441\u0435 \u0441\u043f\u0435\u0446\u0438\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u0438",
            status_label: "\u0421\u0442\u0430\u0442\u0443\u0441",
            all_statuses: "\u0412\u0441\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u044b",
            status_online: "\u041e\u043d\u043b\u0430\u0439\u043d",
            status_busy: "\u0417\u0430\u043d\u044f\u0442",
            status_offline: "\u041d\u0435 \u0432 \u0441\u0435\u0442\u0438",
            map_title: "\u0416\u0438\u0432\u0430\u044f \u043a\u0430\u0440\u0442\u0430 \u0432\u0440\u0430\u0447\u0435\u0439",
            map_text: "\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u043d\u0430 \u043c\u0430\u0440\u043a\u0435\u0440, \u0447\u0442\u043e\u0431\u044b \u0443\u0432\u0438\u0434\u0435\u0442\u044c \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044e \u043e \u0432\u0440\u0430\u0447\u0435.",
            list_title: "\u0421\u043f\u0438\u0441\u043e\u043a \u0432\u0440\u0430\u0447\u0435\u0439",
            list_text: "\u041f\u0440\u043e\u0441\u043c\u0430\u0442\u0440\u0438\u0432\u0430\u0439\u0442\u0435 \u0441\u043f\u0435\u0446\u0438\u0430\u043b\u0438\u0441\u0442\u043e\u0432 \u0438 \u0431\u044b\u0441\u0442\u0440\u043e \u043f\u0435\u0440\u0435\u0445\u043e\u0434\u0438\u0442\u0435 \u043a \u043d\u0443\u0436\u043d\u043e\u043c\u0443 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044e.",
            results_label: "\u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u043e\u0432",
            empty_title: "\u041d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e",
            empty_text: "\u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0434\u0440\u0443\u0433\u043e\u0439 \u043f\u043e\u0438\u0441\u043a \u0438\u043b\u0438 \u0444\u0438\u043b\u044c\u0442\u0440.",
            book_now: "\u0417\u0430\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f",
            open_profile: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c",
            my_profile: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043c\u043e\u0439 \u043f\u0440\u043e\u0444\u0438\u043b\u044c",
            specialization_value: "\u0421\u043f\u0435\u0446\u0438\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f",
            rating_value: "\u0420\u0435\u0439\u0442\u0438\u043d\u0433",
            experience_value: "\u041e\u043f\u044b\u0442",
            years: "\u043b\u0435\u0442",
            status_value: "\u0421\u0442\u0430\u0442\u0443\u0441",
            address_value: "\u0410\u0434\u0440\u0435\u0441",
            phone_value: "\u0422\u0435\u043b\u0435\u0444\u043e\u043d",
            email_value: "Email",
            fee_value: "\u0426\u0435\u043d\u0430",
            no_address: "\u0410\u0434\u0440\u0435\u0441 \u043d\u0435 \u0443\u043a\u0430\u0437\u0430\u043d",
            no_phone: "\u041d\u0435 \u0443\u043a\u0430\u0437\u0430\u043d",
            no_bio: "\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u044f \u043f\u043e\u043a\u0430 \u043d\u0435\u0442."
        }
    };

    const doctors = JSON.parse(doctorsElement.textContent || "[]");
    const searchInput = document.getElementById("doctor-search");
    const specializationFilter = document.getElementById("specialization-filter");
    const statusFilter = document.getElementById("status-filter");
    const doctorList = document.getElementById("doctor-list");
    const resultsCount = document.getElementById("results-count");
    const doctorsTotal = document.getElementById("doctors-total");
    const defaultCoords = [38.5598, 68.787];

    const map = L.map("map", { zoomControl: true, scrollWheelZoom: true }).setView(defaultCoords, 12);
    let currentLayer = createTileLayer();
    currentLayer.addTo(map);

    const markers = doctors
        .filter((doctor) => doctor.lat != null && doctor.lng != null)
        .map((doctor) => ({
            doctor,
            marker: L.marker([doctor.lat, doctor.lng]),
        }));

    function t(key) {
        const lang = html.getAttribute("data-lang") || "en";
        const dict = translations[lang] || translations.en;
        return dict[key] || translations.en[key] || key;
    }

    function applyStaticTranslations() {
        document.querySelectorAll("[data-page-i18n]").forEach((element) => {
            const key = element.dataset.pageI18n;
            element.textContent = t(key);
        });

        document.querySelectorAll("[data-page-i18n-placeholder]").forEach((element) => {
            const key = element.dataset.pageI18nPlaceholder;
            element.setAttribute("placeholder", t(key));
        });
    }

    function createTileLayer() {
        const isDark = html.getAttribute("data-theme") === "dark";
        return L.tileLayer(
            isDark
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            {
                maxZoom: 19,
                attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
            }
        );
    }

    function buildSpecializationOptions() {
        if (!specializationFilter) return;

        const selectedValue = specializationFilter.value || "all";
        const specializations = [...new Set(doctors.map((doctor) => doctor.specialization).filter(Boolean))].sort();

        specializationFilter.innerHTML = "";
        specializationFilter.insertAdjacentHTML("beforeend", `<option value="all">${t("all_specializations")}</option>`);

        specializations.forEach((specialization) => {
            const option = document.createElement("option");
            option.value = specialization;
            option.textContent = specialization;
            specializationFilter.appendChild(option);
        });

        specializationFilter.value = specializations.includes(selectedValue) ? selectedValue : "all";
    }

    function getFilteredDoctors() {
        const query = (searchInput?.value || "").trim().toLowerCase();
        const selectedSpec = specializationFilter?.value || "all";
        const selectedStatus = statusFilter?.value || "all";

        return doctors.filter((doctor) => {
            const matchesQuery = !query || [
                doctor.name,
                doctor.specialization,
                doctor.address,
                doctor.bio,
                doctor.email,
            ].some((value) => (value || "").toLowerCase().includes(query));

            const matchesSpecialization = selectedSpec === "all" || doctor.specialization === selectedSpec;
            const matchesStatus = selectedStatus === "all" || doctor.status === selectedStatus;

            return matchesQuery && matchesSpecialization && matchesStatus;
        });
    }

    function formatStatus(status) {
        if (status === "online") return t("status_online");
        if (status === "busy") return t("status_busy");
        return t("status_offline");
    }

    function buildActionButtons(doctor) {
        const actions = [];

        if (doctor.book_url) {
            actions.push(`<a href="${doctor.book_url}" class="btn btn-primary doctor-action">${t("book_now")}</a>`);
        }

        if (doctor.detail_url) {
            const label = doctor.is_owner ? t("my_profile") : t("open_profile");
            actions.push(`<a href="${doctor.detail_url}" class="btn btn-secondary doctor-action">${label}</a>`);
        }

        return actions.join("");
    }

    function renderDoctorList(filteredDoctors) {
        if (!doctorList) return;

        doctorList.innerHTML = "";
        if (resultsCount) resultsCount.textContent = String(filteredDoctors.length);
        if (doctorsTotal) doctorsTotal.textContent = String(doctors.length);

        if (!filteredDoctors.length) {
            doctorList.innerHTML = `<div class="empty-state"><h3>${t("empty_title")}</h3><p>${t("empty_text")}</p></div>`;
            return;
        }

        filteredDoctors.forEach((doctor) => {
            const avatar = doctor.photo
                ? `<img src="${doctor.photo}" alt="${doctor.name}" class="doctor-avatar">`
                : `<div class="doctor-avatar doctor-avatar--placeholder">${doctor.name.charAt(0).toUpperCase()}</div>`;

            const fee = doctor.consultation_fee ? `<span>$${Number(doctor.consultation_fee).toFixed(2)}</span>` : "";
            const actions = buildActionButtons(doctor);

            doctorList.insertAdjacentHTML(
                "beforeend",
                `
                <article class="doctor-item">
                    <div class="doctor-item-top">
                        <div class="doctor-main">
                            ${avatar}
                            <div>
                                <h3>${doctor.name}</h3>
                                <p>${doctor.specialization}</p>
                            </div>
                        </div>
                        <span class="doctor-status doctor-status--${doctor.status}">
                            ${formatStatus(doctor.status)}
                        </span>
                    </div>
                    <div class="doctor-meta">
                        <span>${t("rating_value")} ${doctor.rating}</span>
                        <span>${doctor.experience} ${t("years")}</span>
                        ${fee}
                    </div>
                    <p class="doctor-address">${doctor.address || t("no_address")}</p>
                    <div class="doctor-extra-grid">
                        <p class="doctor-extra"><strong>${t("phone_value")}:</strong> ${doctor.phone || t("no_phone")}</p>
                        <p class="doctor-extra"><strong>${t("email_value")}:</strong> ${doctor.email || "Email"}</p>
                    </div>
                    <p class="doctor-bio">${doctor.bio || t("no_bio")}</p>
                    ${actions ? `<div class="doctor-actions">${actions}</div>` : ""}
                </article>
                `
            );
        });
    }

    function popupHtml(doctor) {
        const actions = buildActionButtons(doctor);
        return `
            <div class="map-popup">
                ${doctor.photo ? `<img src="${doctor.photo}" alt="${doctor.name}" class="map-popup-avatar">` : ""}
                <h4>${doctor.name}</h4>
                <p><strong>${t("specialization_value")}:</strong> ${doctor.specialization}</p>
                <p><strong>${t("rating_value")}:</strong> ${doctor.rating}</p>
                <p><strong>${t("experience_value")}:</strong> ${doctor.experience} ${t("years")}</p>
                <p><strong>${t("status_value")}:</strong> ${formatStatus(doctor.status)}</p>
                <p><strong>${t("address_value")}:</strong> ${doctor.address || t("no_address")}</p>
                <p><strong>${t("phone_value")}:</strong> ${doctor.phone || t("no_phone")}</p>
                ${doctor.consultation_fee ? `<p><strong>${t("fee_value")}:</strong> $${Number(doctor.consultation_fee).toFixed(2)}</p>` : ""}
                ${actions}
            </div>
        `;
    }

    function updateMarkers() {
        const filteredDoctors = getFilteredDoctors();
        const visibleIds = new Set(filteredDoctors.map((doctor) => doctor.id));
        const bounds = [];

        markers.forEach(({ doctor, marker }) => {
            if (visibleIds.has(doctor.id)) {
                marker.addTo(map);
                marker.bindPopup(popupHtml(doctor));
                bounds.push([doctor.lat, doctor.lng]);
            } else {
                map.removeLayer(marker);
            }
        });

        if (bounds.length) {
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            map.setView(defaultCoords, 12);
        }
    }

    function refresh() {
        buildSpecializationOptions();
        applyStaticTranslations();
        renderDoctorList(getFilteredDoctors());
        updateMarkers();
    }

    function syncThemeLayer() {
        const nextLayer = createTileLayer();
        map.removeLayer(currentLayer);
        currentLayer = nextLayer;
        currentLayer.addTo(map);
        setTimeout(() => map.invalidateSize(), 120);
    }

    refresh();
    setTimeout(() => map.invalidateSize(), 200);

    searchInput?.addEventListener("input", refresh);
    specializationFilter?.addEventListener("change", refresh);
    statusFilter?.addEventListener("change", refresh);
    document.addEventListener("app:themeChanged", syncThemeLayer);
    document.addEventListener("app:languageChanged", refresh);
});
