document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const body = document.body;
    const themeToggle = document.getElementById("theme-toggle");
    const navToggle = document.getElementById("nav-toggle");
    const navPanel = document.getElementById("site-nav-panel");
    const langButtons = document.querySelectorAll("[data-lang-btn]");
    const navLinks = document.querySelectorAll(".site-nav a");

    const translations = {
        en: {
            site_subtitle: "Medical care workspace",
            nav_dashboard: "Dashboard",
            nav_about: "About",
            nav_ai: "AI Assistant",
            nav_doctors: "Doctors",
            nav_appointments: "Appointments",
            nav_my_profile: "My Doctor Profile",
            nav_my_profile_doctor: "Doctor Profile",
            nav_create_profile: "Create Doctor Profile",
            nav_my_profile_short: "My Profile",
            nav_create_profile_short: "Create Profile",
            nav_doctor_profiles: "Doctor Profiles",
            nav_doctor_profiles_short: "Profiles",
            nav_admin: "Admin",
            nav_register: "Register",
            nav_tg: "Telegram",
            sign_in: "Sign In",
            sign_out: "Sign Out",
            site_home: "Med Tech home",
            theme_toggle: "Toggle theme",
            nav_toggle: "Toggle navigation",
            flash_success: "Success",
            flash_error: "Action needed",
            flash_warning: "Attention",
            flash_notice: "Notice",
            dismiss_message: "Dismiss message",
            footer_tagline: "Clear tools for patients and clinics.",
            footer_desc: "Doctor search, appointment management, and AI guidance in one medical platform.",
            footer_platform: "Platform",
            footer_support: "Support",
            footer_contact: "Contact",
            footer_support_1: "Reset password",
            footer_support_2: "Find a doctor",
            footer_support_3: "Care guidance",
            footer_support_4: "Doctor workspace",
            footer_support_5: "My appointments",
            footer_rights: "All rights reserved.",
            footer_status: "Systems operational",
            role_admin: "Admin",
            role_doctor: "Doctor",
            role_patient: "Patient",
            common_status: "Status",
            common_experience: "Experience",
            common_name: "Name",
            common_specialization: "Specialization",
            common_phone: "Phone",
            common_email: "Email",
            common_address: "Address",
            common_notes: "Notes",
            common_doctor: "Doctor",
            common_patient: "Patient",
            common_date_time: "Date and time",
            common_schedule: "Schedule",
            common_available_days: "Available days",
            common_working_hours: "Working hours",
            common_slot_length: "Slot length",
            common_slot_duration: "Slot duration",
            common_minutes: "minutes",
            common_live: "Live",
            common_hidden: "hidden",
            common_chat_id: "Chat ID",
            common_linked: "Linked",
            common_edit: "Edit",
            common_create: "Create",
            common_save_changes: "Save changes",
            common_cancel: "Cancel",
            doctor_list_kicker: "Doctor management",
            doctor_list_title_admin: "Review and manage doctor profiles across the platform.",
            doctor_list_title_doctor: "Keep your doctor profile complete and ready for patients.",
            doctor_list_text_admin: "This directory stays hidden from patients and gives administrators a clean overview of every doctor workspace.",
            doctor_list_text_doctor: "This management area stays focused on your own doctor profile so the workflow feels simple and professional.",
            doctor_list_btn_create: "Create doctor profile",
            doctor_list_btn_public: "Open public doctors page",
            doctor_list_stat_profiles: "Profiles in view",
            doctor_list_stat_role: "Role",
            doctor_list_cards_title: "Doctor profiles",
            doctor_list_cards_text: "Each card gives quick access to detail, edit, and delete actions without exposing that UI to patients.",
            doctor_list_years_experience: "years experience",
            doctor_list_consultation: "consultation",
            doctor_list_btn_open: "Open profile",
            doctor_list_btn_edit: "Edit",
            doctor_list_btn_delete: "Delete",
            doctor_list_empty_title: "No doctor profile yet",
            doctor_list_empty_text: "Create a doctor profile to unlock profile management, appointment context, and a cleaner doctor-side workflow.",
            doctor_detail_kicker: "Doctor profile",
            doctor_detail_text: "Manage your professional information, map visibility, and presentation details from one consistent workspace.",
            doctor_detail_btn_edit: "Edit profile",
            doctor_detail_btn_delete: "Delete profile",
            doctor_detail_btn_back: "Back to profiles",
            doctor_detail_card_title: "Professional details",
            doctor_detail_card_text: "These details power the public doctors experience and keep your management flow aligned with the rest of the product.",
            doctor_detail_years: "years",
            doctor_detail_rating: "Rating",
            doctor_detail_fee: "Consultation fee",
            doctor_detail_coordinates: "Map coordinates",
            doctor_detail_bio: "Biography",
            doctor_detail_bio_empty: "Add a concise bio to make your profile feel more complete on the public doctors page.",
            doctor_form_kicker: "Doctor setup",
            doctor_form_title_edit: "Update your doctor profile",
            doctor_form_title_create: "Create your doctor profile",
            doctor_form_text: "Keep the doctor-facing workspace polished with consistent profile details, public map data, and presentation-ready information.",
            doctor_form_workflow: "Workflow",
            doctor_form_card_title_edit: "Doctor profile details",
            doctor_form_card_title_create: "Professional profile details",
            doctor_form_card_text: "This form stays inside the existing CRUD flow while matching the rest of the Med Tech UI more closely.",
            doctor_form_submit_create: "Create profile",
            doctor_delete_kicker: "Profile removal",
            doctor_delete_title: "Delete this doctor profile?",
            doctor_delete_text: "This removes the doctor profile itself, so make sure you really want to take it out of the management flow.",
            doctor_delete_confirm: "Yes, delete profile",
            doctor_delete_keep: "Keep profile",
            appointment_detail_kicker: "Appointment details",
            appointment_detail_title: "Everything important about this visit, in one clear view.",
            appointment_detail_text: "Review the current status, doctor information, timing, and notes without exposing actions that do not belong to your role.",
            appointment_detail_btn_edit: "Edit appointment",
            appointment_detail_btn_cancel: "Cancel appointment",
            appointment_detail_btn_back: "Back to appointments",
            appointment_detail_scheduled_for: "Scheduled for",
            appointment_detail_card_title: "Visit summary",
            appointment_detail_card_text: "Useful context for patients, doctors, and administrators.",
            appointment_detail_notes_empty: "No additional notes were added for this appointment.",
            appointment_form_kicker: "Appointment update",
            appointment_form_title: "Adjust timing, notes, and appointment status with care.",
            appointment_form_text: "This form stays limited to doctor and admin actions so patient-facing controls remain clean and safe.",
            appointment_form_card_title: "Edit appointment",
            appointment_form_card_text: "Update the booking details without breaking the existing appointment flow.",
            appointment_form_btn_back: "Back to details",
            appointment_delete_kicker: "Cancellation",
            appointment_delete_title: "Cancel this appointment?",
            appointment_delete_text: "You can cancel this appointment now or return to the details page.",
            appointment_delete_confirm: "Yes, cancel appointment",
            appointment_delete_keep: "Keep appointment",
            summary_item_tg_title: "Telegram bot",
            summary_item_tg_text: "Connect your account and use quick actions from your phone.",
            book_kicker: "Booking flow",
            book_title_prefix: "Book a visit with",
            book_text: "Complete the form below to schedule a visit while keeping the existing booking flow simple and dependable.",
            book_card_title: "Appointment request",
            book_card_text: "Choose a future date and add any useful notes for the doctor.",
            book_date_kicker: "Date selection",
            book_date_title: "Pick a day that fits the doctor schedule.",
            book_date_field: "Appointment date",
            book_time_field: "Time slot",
            book_slot_hint: "Only available slots are shown for the selected date.",
            book_btn_confirm: "Confirm booking",
            book_btn_back: "Back to doctors",
            book_sidebar_title: "Doctor snapshot",
            book_sidebar_text: "Use this summary to confirm you are booking the right specialist before submitting the appointment.",
            book_about_doctor: "About this doctor",
            book_schedule_prefix: "Available on",
            book_schedule_from: "from",
            book_schedule_to: "to",
            book_schedule_each: "Each visit uses a",
            appointment_slot_title: "Move the appointment to another available slot.",
            about_kicker: "About Med Tech",
            about_title: "A calm clinic page for patients and doctors.",
            about_text: "Everything important lives in one place: doctors, appointments, reminders, and help.",
            about_stat_users: "Who uses it",
            about_stat_users_value: "Patient · doctor · admin",
            about_stat_booking: "Booking",
            about_stat_booking_value: "Schedule and slots",
            about_section_product: "What the platform includes",
            about_section_product_text: "Doctors, bookings, reminders, and support work together.",
            about_feature_1: "Doctors map with live markers",
            about_feature_1_text: "Find specialists and clinics fast.",
            about_feature_2: "Booking by schedule and slots",
            about_feature_2_text: "Only valid times appear.",
            about_feature_3: "Separate views for each role",
            about_feature_3_text: "Patient, doctor, and admin see only what they need.",
            about_feature_4: "Support chat with saved history",
            about_feature_4_text: "Conversations stay tied to the account.",
            about_section_demo: "Why clinics can use it",
            about_spotlight_label: "Why it feels calm",
            about_spotlight_title: "One clinic route. Clear roles. Fast actions.",
            about_spotlight_text: "Only the steps clinics need stay on screen.",
            about_section_demo_text: "One place for the full patient journey.",
            about_section_demo_note: "Simple, practical, and easy to trust.",
            about_section_stack: "What clinics get",
            about_stack_1: "Doctors",
            about_stack_2: "Appointments",
            about_stack_3: "Reminders",
            about_stack_4: "Support",
            error_403_kicker: "Access denied",
            error_403_title: "This area is not available for your account.",
            error_403_text: "The page exists, but your current role does not have permission to open it. Return to a safe section of Med Tech and continue from there.",
            error_403_tip: "Try a page that matches your role.",
            error_404_kicker: "Page not found",
            error_404_title: "The page you tried to open does not exist.",
            error_404_text: "The link may be outdated, incomplete, or removed. You can return to the main Med Tech flow and continue from a valid section.",
            error_404_tip: "Start again from the dashboard or the About page.",
            error_code_label: "Error code",
            error_tip_label: "Tip",
            error_btn_home: "Go to dashboard",
            error_btn_doctors: "Browse doctors",
            error_btn_about: "Read about Med Tech"
        },
        ru: {
            site_subtitle: "\u041c\u0435\u0434\u0438\u0446\u0438\u043d\u0441\u043a\u043e\u0435 \u0440\u0430\u0431\u043e\u0447\u0435\u0435 \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e",
            nav_dashboard: "\u0413\u043b\u0430\u0432\u043d\u0430\u044f",
            nav_about: "\u041e \u043d\u0430\u0441",
            nav_ai: "\u0418\u0418-\u043f\u043e\u043c\u043e\u0449\u043d\u0438\u043a",
            nav_doctors: "\u0412\u0440\u0430\u0447\u0438",
            nav_appointments: "\u0417\u0430\u043f\u0438\u0441\u0438",
            nav_my_profile: "\u041c\u043e\u0439 \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u0440\u0430\u0447\u0430",
            nav_my_profile_doctor: "\u041f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u0440\u0430\u0447\u0430",
            nav_create_profile: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u0440\u0430\u0447\u0430",
            nav_my_profile_short: "\u041c\u043e\u0439 \u043f\u0440\u043e\u0444\u0438\u043b\u044c",
            nav_create_profile_short: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c",
            nav_doctor_profiles: "\u041f\u0440\u043e\u0444\u0438\u043b\u0438 \u0432\u0440\u0430\u0447\u0435\u0439",
            nav_doctor_profiles_short: "\u041f\u0440\u043e\u0444\u0438\u043b\u0438",
            nav_admin: "\u0410\u0434\u043c\u0438\u043d",
            nav_register: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f",
            nav_tg: "Telegram",
            sign_in: "\u0412\u043e\u0439\u0442\u0438",
            sign_out: "\u0412\u044b\u0439\u0442\u0438",
            site_home: "\u0413\u043b\u0430\u0432\u043d\u0430\u044f Med Tech",
            theme_toggle: "\u041f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0442\u0435\u043c\u0443",
            nav_toggle: "\u041f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043c\u0435\u043d\u044e",
            flash_success: "\u0423\u0441\u043f\u0435\u0445",
            flash_error: "\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435",
            flash_warning: "\u0412\u043d\u0438\u043c\u0430\u043d\u0438\u0435",
            flash_notice: "\u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u0435",
            dismiss_message: "\u0417\u0430\u043a\u0440\u044b\u0442\u044c \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435",
            footer_tagline: "\u041f\u043e\u043d\u044f\u0442\u043d\u044b\u0435 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u044b \u0434\u043b\u044f \u043f\u0430\u0446\u0438\u0435\u043d\u0442\u043e\u0432 \u0438 \u043a\u043b\u0438\u043d\u0438\u043a.",
            footer_desc: "\u041f\u043e\u0438\u0441\u043a \u0432\u0440\u0430\u0447\u0435\u0439, \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0437\u0430\u043f\u0438\u0441\u044f\u043c\u0438 \u0438 \u0418\u0418-\u043f\u043e\u043c\u043e\u0449\u044c \u0432 \u043e\u0434\u043d\u043e\u0439 \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0441\u043a\u043e\u0439 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0435.",
            footer_platform: "\u041f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0430",
            footer_support: "\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430",
            footer_contact: "\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b",
            footer_support_1: "\u0421\u0431\u0440\u043e\u0441 \u043f\u0430\u0440\u043e\u043b\u044f",
            footer_support_2: "\u041d\u0430\u0439\u0442\u0438 \u0432\u0440\u0430\u0447\u0430",
            footer_support_3: "\u041f\u043e\u0434\u0441\u043a\u0430\u0437\u043a\u0438 \u043f\u043e \u0443\u0445\u043e\u0434\u0443",
            footer_support_4: "\u041a\u0430\u0431\u0438\u043d\u0435\u0442 \u0432\u0440\u0430\u0447\u0430",
            footer_support_5: "\u041c\u043e\u0438 \u0437\u0430\u043f\u0438\u0441\u0438",
            footer_rights: "\u0412\u0441\u0435 \u043f\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043d\u044b.",
            footer_status: "\u0421\u0438\u0441\u0442\u0435\u043c\u044b \u0440\u0430\u0431\u043e\u0442\u0430\u044e\u0442",
            role_admin: "\u0410\u0434\u043c\u0438\u043d",
            role_doctor: "\u0412\u0440\u0430\u0447",
            role_patient: "\u041f\u0430\u0446\u0438\u0435\u043d\u0442",
            common_status: "\u0421\u0442\u0430\u0442\u0443\u0441",
            common_experience: "\u0421\u0442\u0430\u0436",
            common_name: "\u0418\u043c\u044f",
            common_specialization: "\u0421\u043f\u0435\u0446\u0438\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f",
            common_phone: "\u0422\u0435\u043b\u0435\u0444\u043e\u043d",
            common_email: "Email",
            common_address: "\u0410\u0434\u0440\u0435\u0441",
            common_notes: "\u0417\u0430\u043c\u0435\u0442\u043a\u0438",
            common_doctor: "\u0412\u0440\u0430\u0447",
            common_patient: "\u041f\u0430\u0446\u0438\u0435\u043d\u0442",
            common_date_time: "\u0414\u0430\u0442\u0430 \u0438 \u0432\u0440\u0435\u043c\u044f",
            common_schedule: "\u0413\u0440\u0430\u0444\u0438\u043a",
            common_available_days: "\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u044b\u0435 \u0434\u043d\u0438",
            common_working_hours: "\u0427\u0430\u0441\u044b \u0440\u0430\u0431\u043e\u0442\u044b",
            common_slot_length: "\u0414\u043b\u0438\u043d\u0430 \u0441\u043b\u043e\u0442\u0430",
            common_slot_duration: "\u0414\u043b\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c \u0441\u043b\u043e\u0442\u0430",
            common_minutes: "\u043c\u0438\u043d\u0443\u0442",
            common_live: "\u0412 \u044d\u0444\u0438\u0440\u0435",
            common_hidden: "\u0441\u043a\u0440\u044b\u0442",
            common_chat_id: "Chat ID",
            common_linked: "\u041f\u0440\u0438\u0432\u044f\u0437\u0430\u043d",
            common_edit: "\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c",
            common_create: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c",
            common_save_changes: "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f",
            common_cancel: "\u041e\u0442\u043c\u0435\u043d\u0430",
            doctor_list_kicker: "\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0432\u0440\u0430\u0447\u0430\u043c\u0438",
            doctor_list_title_admin: "\u041f\u0440\u043e\u0441\u043c\u0430\u0442\u0440\u0438\u0432\u0430\u0439\u0442\u0435 \u0438 \u0443\u043f\u0440\u0430\u0432\u043b\u044f\u0439\u0442\u0435 \u043f\u0440\u043e\u0444\u0438\u043b\u044f\u043c\u0438 \u0432\u0440\u0430\u0447\u0435\u0439 \u043d\u0430 \u0432\u0441\u0435\u0439 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0435.",
            doctor_list_title_doctor: "\u0414\u0435\u0440\u0436\u0438\u0442\u0435 \u0441\u0432\u043e\u0439 \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u0440\u0430\u0447\u0430 \u0430\u043a\u043a\u0443\u0440\u0430\u0442\u043d\u044b\u043c \u0438 \u0433\u043e\u0442\u043e\u0432\u044b\u043c \u0434\u043b\u044f \u043f\u0430\u0446\u0438\u0435\u043d\u0442\u043e\u0432.",
            doctor_list_text_admin: "\u042d\u0442\u0430 \u0437\u043e\u043d\u0430 \u0441\u043a\u0440\u044b\u0442\u0430 \u043e\u0442 \u043f\u0430\u0446\u0438\u0435\u043d\u0442\u043e\u0432 \u0438 \u0434\u0430\u0451\u0442 \u0430\u0434\u043c\u0438\u043d\u0443 \u0447\u0438\u0441\u0442\u044b\u0439 \u043e\u0431\u0437\u043e\u0440 \u043f\u043e \u043f\u0440\u043e\u0444\u0438\u043b\u044f\u043c \u0432\u0440\u0430\u0447\u0435\u0439.",
            doctor_list_text_doctor: "\u042d\u0442\u0430 \u0437\u043e\u043d\u0430 \u0441\u043e\u0441\u0440\u0435\u0434\u043e\u0442\u043e\u0447\u0435\u043d\u0430 \u043d\u0430 \u0432\u0430\u0448\u0435\u043c \u043f\u0440\u043e\u0444\u0438\u043b\u0435 \u0432\u0440\u0430\u0447\u0430, \u0447\u0442\u043e\u0431\u044b \u0441\u0446\u0435\u043d\u0430\u0440\u0438\u0439 \u043e\u0441\u0442\u0430\u0432\u0430\u043b\u0441\u044f \u043f\u0440\u043e\u0441\u0442\u044b\u043c \u0438 \u043f\u043e\u043d\u044f\u0442\u043d\u044b\u043c.",
            doctor_list_btn_create: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u0440\u0430\u0447\u0430",
            doctor_list_btn_public: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u0443\u0431\u043b\u0438\u0447\u043d\u0443\u044e \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443 \u0432\u0440\u0430\u0447\u0435\u0439",
            doctor_list_stat_profiles: "\u041f\u0440\u043e\u0444\u0438\u043b\u0435\u0439 \u0432 \u0441\u043f\u0438\u0441\u043a\u0435",
            doctor_list_stat_role: "\u0420\u043e\u043b\u044c",
            doctor_list_cards_title: "\u041f\u0440\u043e\u0444\u0438\u043b\u0438 \u0432\u0440\u0430\u0447\u0435\u0439",
            doctor_list_cards_text: "\u041a\u0430\u0436\u0434\u0430\u044f \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0430 \u0434\u0430\u0451\u0442 \u0431\u044b\u0441\u0442\u0440\u044b\u0439 \u0434\u043e\u0441\u0442\u0443\u043f \u043a \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u0443, \u0440\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e \u0438 \u0443\u0434\u0430\u043b\u0435\u043d\u0438\u044e \u0431\u0435\u0437 \u043f\u043e\u043a\u0430\u0437\u0430 \u044d\u0442\u043e\u0433\u043e UI \u043f\u0430\u0446\u0438\u0435\u043d\u0442\u0430\u043c.",
            doctor_list_years_experience: "\u043b\u0435\u0442 \u043e\u043f\u044b\u0442\u0430",
            doctor_list_consultation: "\u043a\u043e\u043d\u0441\u0443\u043b\u044c\u0442\u0430\u0446\u0438\u044f",
            doctor_list_btn_open: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c",
            doctor_list_btn_edit: "\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c",
            doctor_list_btn_delete: "\u0423\u0434\u0430\u043b\u0438\u0442\u044c",
            doctor_list_empty_title: "\u041f\u0440\u043e\u0444\u0438\u043b\u044f \u0432\u0440\u0430\u0447\u0430 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442",
            doctor_list_empty_text: "\u0421\u043e\u0437\u0434\u0430\u0439\u0442\u0435 \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u0440\u0430\u0447\u0430, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435, \u0441\u0432\u044f\u0437\u044c \u0441 \u0437\u0430\u043f\u0438\u0441\u044f\u043c\u0438 \u0438 \u0431\u043e\u043b\u0435\u0435 \u0446\u0435\u043b\u044c\u043d\u044b\u0439 doctor-flow.",
            doctor_detail_kicker: "\u041f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u0440\u0430\u0447\u0430",
            doctor_detail_text: "\u0423\u043f\u0440\u0430\u0432\u043b\u044f\u0439\u0442\u0435 \u043f\u0440\u043e\u0444\u0435\u0441\u0441\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u043e\u0439 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0435\u0439, \u0432\u0438\u0434\u0438\u043c\u043e\u0441\u0442\u044c\u044e \u043d\u0430 \u043a\u0430\u0440\u0442\u0435 \u0438 \u043f\u0440\u0435\u0437\u0435\u043d\u0442\u0430\u0446\u0438\u0435\u0439 \u043f\u0440\u043e\u0444\u0438\u043b\u044f \u0438\u0437 \u043e\u0434\u043d\u043e\u0433\u043e \u043c\u0435\u0441\u0442\u0430.",
            doctor_detail_btn_edit: "\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c",
            doctor_detail_btn_delete: "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c",
            doctor_detail_btn_back: "\u041d\u0430\u0437\u0430\u0434 \u043a \u043f\u0440\u043e\u0444\u0438\u043b\u044f\u043c",
            doctor_detail_card_title: "\u041f\u0440\u043e\u0444\u0435\u0441\u0441\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435",
            doctor_detail_card_text: "\u042d\u0442\u0438 \u0434\u0430\u043d\u043d\u044b\u0435 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u044e\u0442\u0441\u044f \u043d\u0430 \u043f\u0443\u0431\u043b\u0438\u0447\u043d\u043e\u0439 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0435 \u0432\u0440\u0430\u0447\u0435\u0439 \u0438 \u0434\u0435\u0440\u0436\u0430\u0442 doctor-flow \u0441\u043e\u0433\u043b\u0430\u0441\u043e\u0432\u0430\u043d\u043d\u044b\u043c.",
            doctor_detail_years: "\u043b\u0435\u0442",
            doctor_detail_rating: "\u0420\u0435\u0439\u0442\u0438\u043d\u0433",
            doctor_detail_fee: "\u0421\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c \u043a\u043e\u043d\u0441\u0443\u043b\u044c\u0442\u0430\u0446\u0438\u0438",
            doctor_detail_coordinates: "\u041a\u043e\u043e\u0440\u0434\u0438\u043d\u0430\u0442\u044b \u043d\u0430 \u043a\u0430\u0440\u0442\u0435",
            doctor_detail_bio: "\u0411\u0438\u043e\u0433\u0440\u0430\u0444\u0438\u044f",
            doctor_detail_bio_empty: "\u0414\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u043a\u0440\u0430\u0442\u043a\u043e\u0435 \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435, \u0447\u0442\u043e\u0431\u044b \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u044b\u0433\u043b\u044f\u0434\u0435\u043b \u043f\u043e\u043b\u043d\u0435\u0435 \u043d\u0430 \u043f\u0443\u0431\u043b\u0438\u0447\u043d\u043e\u0439 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0435.",
            doctor_form_kicker: "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430 \u043f\u0440\u043e\u0444\u0438\u043b\u044f",
            doctor_form_title_edit: "\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u0440\u0430\u0447\u0430",
            doctor_form_title_create: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u0440\u0430\u0447\u0430",
            doctor_form_text: "\u0414\u0435\u0440\u0436\u0438\u0442\u0435 doctor-\u0437\u043e\u043d\u0443 \u0430\u043a\u043a\u0443\u0440\u0430\u0442\u043d\u043e\u0439: \u0435\u0434\u0438\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435, \u043a\u0430\u0440\u0442\u0430 \u0438 \u0433\u043e\u0442\u043e\u0432\u0430\u044f \u043a \u043f\u043e\u043a\u0430\u0437\u0443 \u043f\u0440\u0435\u0437\u0435\u043d\u0442\u0430\u0446\u0438\u044f.",
            doctor_form_workflow: "\u0421\u0446\u0435\u043d\u0430\u0440\u0438\u0439",
            doctor_form_card_title_edit: "\u0414\u0430\u043d\u043d\u044b\u0435 \u043f\u0440\u043e\u0444\u0438\u043b\u044f \u0432\u0440\u0430\u0447\u0430",
            doctor_form_card_title_create: "\u0414\u0430\u043d\u043d\u044b\u0435 \u043f\u0440\u043e\u0444\u0435\u0441\u0441\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u043f\u0440\u043e\u0444\u0438\u043b\u044f",
            doctor_form_card_text: "\u0424\u043e\u0440\u043c\u0430 \u043e\u0441\u0442\u0430\u0451\u0442\u0441\u044f \u0432 \u0442\u0435\u043a\u0443\u0449\u0435\u043c CRUD-flow, \u043d\u043e \u0432\u044b\u0433\u043b\u044f\u0434\u0438\u0442 \u0431\u043e\u043b\u0435\u0435 \u0446\u0435\u043b\u044c\u043d\u043e \u0432 \u0441\u0442\u0438\u043b\u0435 Med Tech.",
            doctor_form_submit_create: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c",
            doctor_delete_kicker: "\u0423\u0434\u0430\u043b\u0435\u043d\u0438\u0435 \u043f\u0440\u043e\u0444\u0438\u043b\u044f",
            doctor_delete_title: "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u044d\u0442\u043e\u0442 \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u0440\u0430\u0447\u0430?",
            doctor_delete_text: "\u042d\u0442\u043e \u0443\u0434\u0430\u043b\u0438\u0442 \u0441\u0430\u043c \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0432\u0440\u0430\u0447\u0430, \u043f\u043e\u044d\u0442\u043e\u043c\u0443 \u0443\u0431\u0435\u0434\u0438\u0442\u0435\u0441\u044c \u0432 \u0440\u0435\u0448\u0435\u043d\u0438\u0438.",
            doctor_delete_confirm: "\u0414\u0430, \u0443\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c",
            doctor_delete_keep: "\u041e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c",
            appointment_detail_kicker: "\u0414\u0435\u0442\u0430\u043b\u0438 \u0437\u0430\u043f\u0438\u0441\u0438",
            appointment_detail_title: "\u0412\u0441\u0451 \u0432\u0430\u0436\u043d\u043e\u0435 \u043e \u044d\u0442\u043e\u043c \u0432\u0438\u0437\u0438\u0442\u0435 \u0432 \u043e\u0434\u043d\u043e\u043c \u043e\u043a\u043d\u0435.",
            appointment_detail_text: "\u041f\u0440\u043e\u0441\u043c\u0430\u0442\u0440\u0438\u0432\u0430\u0439\u0442\u0435 \u0441\u0442\u0430\u0442\u0443\u0441, \u0432\u0440\u0430\u0447\u0430, \u0432\u0440\u0435\u043c\u044f \u0438 \u0437\u0430\u043c\u0435\u0442\u043a\u0438 \u0431\u0435\u0437 \u043b\u0438\u0448\u043d\u0438\u0445 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439 \u0434\u043b\u044f \u0432\u0430\u0448\u0435\u0439 \u0440\u043e\u043b\u0438.",
            appointment_detail_btn_edit: "\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0437\u0430\u043f\u0438\u0441\u044c",
            appointment_detail_btn_cancel: "\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u0437\u0430\u043f\u0438\u0441\u044c",
            appointment_detail_btn_back: "\u041d\u0430\u0437\u0430\u0434 \u043a \u0437\u0430\u043f\u0438\u0441\u044f\u043c",
            appointment_detail_scheduled_for: "\u0417\u0430\u043f\u043b\u0430\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u043e \u043d\u0430",
            appointment_detail_card_title: "\u041a\u0440\u0430\u0442\u043a\u0430\u044f \u0441\u0432\u043e\u0434\u043a\u0430",
            appointment_detail_card_text: "\u041f\u043e\u043b\u0435\u0437\u043d\u044b\u0439 \u043a\u043e\u043d\u0442\u0435\u043a\u0441\u0442 \u0434\u043b\u044f \u043f\u0430\u0446\u0438\u0435\u043d\u0442\u0430, \u0432\u0440\u0430\u0447\u0430 \u0438 \u0430\u0434\u043c\u0438\u043d\u0430.",
            appointment_detail_notes_empty: "\u0414\u043b\u044f \u044d\u0442\u043e\u0439 \u0437\u0430\u043f\u0438\u0441\u0438 \u0434\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0445 \u0437\u0430\u043c\u0435\u0442\u043e\u043a \u043d\u0435 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u043e.",
            appointment_form_kicker: "\u0418\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0435 \u0437\u0430\u043f\u0438\u0441\u0438",
            appointment_form_title: "\u0410\u043a\u043a\u0443\u0440\u0430\u0442\u043d\u043e \u043e\u0431\u043d\u043e\u0432\u0438\u0442\u0435 \u0432\u0440\u0435\u043c\u044f, \u0437\u0430\u043c\u0435\u0442\u043a\u0438 \u0438 \u0441\u0442\u0430\u0442\u0443\u0441.",
            appointment_form_text: "\u042d\u0442\u0430 \u0444\u043e\u0440\u043c\u0430 \u043e\u0441\u0442\u0430\u0451\u0442\u0441\u044f \u0434\u043b\u044f doctor/admin \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439, \u0447\u0442\u043e\u0431\u044b patient-flow \u043d\u0435 \u043f\u0435\u0440\u0435\u0433\u0440\u0443\u0436\u0430\u043b\u0441\u044f.",
            appointment_form_card_title: "\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0437\u0430\u043f\u0438\u0441\u044c",
            appointment_form_card_text: "\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u0435 \u0434\u0435\u0442\u0430\u043b\u0438 \u0431\u0435\u0437 \u043b\u043e\u043c\u043a\u0438 \u0442\u0435\u043a\u0443\u0449\u0435\u0433\u043e appointment-flow.",
            appointment_form_btn_back: "\u041d\u0430\u0437\u0430\u0434 \u043a \u0434\u0435\u0442\u0430\u043b\u044f\u043c",
            appointment_delete_kicker: "\u041e\u0442\u043c\u0435\u043d\u0430",
            appointment_delete_title: "\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u044d\u0442\u0443 \u0437\u0430\u043f\u0438\u0441\u044c?",
            appointment_delete_text: "\u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u043e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u044d\u0442\u0443 \u0437\u0430\u043f\u0438\u0441\u044c \u0438\u043b\u0438 \u0432\u0435\u0440\u043d\u0443\u0442\u044c\u0441\u044f \u043a \u0435\u0451 \u0434\u0435\u0442\u0430\u043b\u044f\u043c.",
            appointment_delete_confirm: "\u0414\u0430, \u043e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u0437\u0430\u043f\u0438\u0441\u044c",
            appointment_delete_keep: "\u041e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u043f\u0438\u0441\u044c",
            summary_item_tg_title: "Telegram \u0431\u043e\u0442",
            summary_item_tg_text: "\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0438 \u0430\u043a\u043a\u0430\u0443\u043d\u0442 \u0438 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439 \u0431\u044b\u0441\u0442\u0440\u044b\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f \u0441 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430.",
            book_kicker: "\u0417\u0430\u043f\u0438\u0441\u044c \u043d\u0430 \u043f\u0440\u0438\u0451\u043c",
            book_title_prefix: "\u0417\u0430\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f \u043a",
            book_text: "\u0417\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u0435 \u0444\u043e\u0440\u043c\u0443 \u043d\u0438\u0436\u0435, \u0447\u0442\u043e\u0431\u044b \u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u043f\u0438\u0441\u044c \u0431\u0435\u0437 \u043b\u043e\u043c\u043a\u0438 \u0442\u0435\u043a\u0443\u0449\u0435\u0433\u043e booking-flow.",
            book_card_title: "\u0417\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 \u0437\u0430\u043f\u0438\u0441\u044c",
            book_card_text: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0443\u0434\u0443\u0449\u0443\u044e \u0434\u0430\u0442\u0443 \u0438 \u0434\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u043d\u0443\u0436\u043d\u044b\u0435 \u0437\u0430\u043c\u0435\u0442\u043a\u0438 \u0434\u043b\u044f \u0432\u0440\u0430\u0447\u0430.",
            book_date_kicker: "\u0412\u044b\u0431\u043e\u0440 \u0434\u0430\u0442\u044b",
            book_date_title: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0435\u043d\u044c, \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u043f\u043e\u0434\u0445\u043e\u0434\u0438\u0442 \u043f\u043e \u0433\u0440\u0430\u0444\u0438\u043a\u0443 \u0432\u0440\u0430\u0447\u0430.",
            book_date_field: "\u0414\u0430\u0442\u0430 \u043f\u0440\u0438\u0451\u043c\u0430",
            book_time_field: "\u0412\u0440\u0435\u043c\u044f \u043f\u0440\u0438\u0451\u043c\u0430",
            book_slot_hint: "\u0414\u043b\u044f \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u043e\u0439 \u0434\u0430\u0442\u044b \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u044e\u0442\u0441\u044f \u0442\u043e\u043b\u044c\u043a\u043e \u0441\u0432\u043e\u0431\u043e\u0434\u043d\u044b\u0435 \u0441\u043b\u043e\u0442\u044b.",
            book_btn_confirm: "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c \u0437\u0430\u043f\u0438\u0441\u044c",
            book_btn_back: "\u041d\u0430\u0437\u0430\u0434 \u043a \u0432\u0440\u0430\u0447\u0430\u043c",
            book_sidebar_title: "\u041a\u0440\u0430\u0442\u043a\u043e \u043e \u0432\u0440\u0430\u0447\u0435",
            book_sidebar_text: "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435 \u044d\u0442\u043e \u0440\u0435\u0437\u044e\u043c\u0435, \u0447\u0442\u043e\u0431\u044b \u0443\u0431\u0435\u0434\u0438\u0442\u044c\u0441\u044f, \u0447\u0442\u043e \u0432\u044b \u0432\u044b\u0431\u0440\u0430\u043b\u0438 \u043d\u0443\u0436\u043d\u043e\u0433\u043e \u0441\u043f\u0435\u0446\u0438\u0430\u043b\u0438\u0441\u0442\u0430.",
            book_about_doctor: "\u041e\u0431 \u044d\u0442\u043e\u043c \u0432\u0440\u0430\u0447\u0435",
            book_schedule_prefix: "\u0414\u043e\u0441\u0442\u0443\u043f\u0435\u043d \u0432",
            book_schedule_from: "\u0441",
            book_schedule_to: "\u0434\u043e",
            book_schedule_each: "\u041a\u0430\u0436\u0434\u044b\u0439 \u043f\u0440\u0438\u0451\u043c \u0437\u0430\u043d\u0438\u043c\u0430\u0435\u0442",
            appointment_slot_title: "\u041f\u0435\u0440\u0435\u043d\u0435\u0441\u0438\u0442\u0435 \u0437\u0430\u043f\u0438\u0441\u044c \u043d\u0430 \u0434\u0440\u0443\u0433\u043e\u0439 \u0441\u0432\u043e\u0431\u043e\u0434\u043d\u044b\u0439 \u0441\u043b\u043e\u0442.",
            about_kicker: "\u041e Med Tech",
            about_title: "\u0421\u043f\u043e\u043a\u043e\u0439\u043d\u0430\u044f \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u043a\u043b\u0438\u043d\u0438\u043a\u0438 \u0434\u043b\u044f \u043f\u0430\u0446\u0438\u0435\u043d\u0442\u043e\u0432 \u0438 \u0432\u0440\u0430\u0447\u0435\u0439.",
            about_text: "\u0412\u0441\u0451 \u0432\u0430\u0436\u043d\u043e\u0435 \u0441\u043e\u0431\u0440\u0430\u043d\u043e \u0432 \u043e\u0434\u043d\u043e\u043c \u043c\u0435\u0441\u0442\u0435: \u0432\u0440\u0430\u0447\u0438, \u0437\u0430\u043f\u0438\u0441\u0438, \u043d\u0430\u043f\u043e\u043c\u0438\u043d\u0430\u043d\u0438\u044f \u0438 \u043f\u043e\u043c\u043e\u0449\u044c.",
            about_stat_users: "\u0421\u0446\u0435\u043d\u0430\u0440\u0438\u0438",
            about_stat_users_value: "\u041f\u0430\u0446\u0438\u0435\u043d\u0442 \u00b7 \u0432\u0440\u0430\u0447 \u00b7 \u0430\u0434\u043c\u0438\u043d",
            about_stat_booking: "\u0417\u0430\u043f\u0438\u0441\u044c",
            about_stat_booking_value: "\u0421\u043b\u043e\u0442\u044b \u0438 \u0433\u0440\u0430\u0444\u0438\u043a \u0432\u0440\u0430\u0447\u0430",
            about_section_product: "\u0427\u0442\u043e \u0432\u0445\u043e\u0434\u0438\u0442 \u0432 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0443",
            about_section_product_text: "\u0412\u0440\u0430\u0447\u0438, \u0437\u0430\u043f\u0438\u0441\u0438, \u043d\u0430\u043f\u043e\u043c\u0438\u043d\u0430\u043d\u0438\u044f \u0438 \u043f\u043e\u043c\u043e\u0449\u044c \u0440\u0430\u0431\u043e\u0442\u0430\u044e\u0442 \u0432\u043c\u0435\u0441\u0442\u0435.",
            about_feature_1: "\u041a\u0430\u0440\u0442\u0430 \u0432\u0440\u0430\u0447\u0435\u0439 \u0441 \u0436\u0438\u0432\u044b\u043c\u0438 \u043c\u0435\u0442\u043a\u0430\u043c\u0438",
            about_feature_1_text: "\u0411\u044b\u0441\u0442\u0440\u043e \u043d\u0430\u0445\u043e\u0434\u0438\u0442\u0435 \u0432\u0440\u0430\u0447\u0435\u0439 \u0438 \u043a\u043b\u0438\u043d\u0438\u043a\u0438.",
            about_feature_2: "\u0417\u0430\u043f\u0438\u0441\u044c \u043f\u043e \u0433\u0440\u0430\u0444\u0438\u043a\u0443 \u0438 \u0441\u043b\u043e\u0442\u0430\u043c",
            about_feature_2_text: "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u044e\u0442\u0441\u044f \u0442\u043e\u043b\u044c\u043a\u043e \u0432\u0430\u043b\u0438\u0434\u043d\u044b\u0435 \u0432\u0440\u0435\u043c\u0435\u043d\u0430.",
            about_feature_3: "\u0420\u0430\u0437\u043d\u044b\u0435 \u0432\u0438\u0434\u044b \u0434\u043b\u044f \u043a\u0430\u0436\u0434\u043e\u0439 \u0440\u043e\u043b\u0438",
            about_feature_3_text: "\u041f\u0430\u0446\u0438\u0435\u043d\u0442, \u0432\u0440\u0430\u0447 \u0438 \u0430\u0434\u043c\u0438\u043d \u0432\u0438\u0434\u044f\u0442 \u0442\u043e\u043b\u044c\u043a\u043e \u0441\u0432\u043e\u0451.",
            about_feature_4: "AI-\u0447\u0430\u0442 \u0441 \u0441\u043e\u0445\u0440\u0430\u043d\u0451\u043d\u043d\u043e\u0439 \u0438\u0441\u0442\u043e\u0440\u0438\u0435\u0439",
            about_feature_4_text: "\u0414\u0438\u0430\u043b\u043e\u0433\u0438 \u0441\u043e\u0445\u0440\u0430\u043d\u044f\u044e\u0442\u0441\u044f \u043d\u0430 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0435.",
            about_section_demo: "\u041f\u043e\u0447\u0435\u043c\u0443 \u043a\u043b\u0438\u043d\u0438\u043a\u0435 \u044d\u0442\u043e \u0443\u0434\u043e\u0431\u043d\u043e",
            about_section_demo_text: "\u0412\u0441\u044f \u0440\u0430\u0431\u043e\u0442\u0430 \u0441 \u043f\u0430\u0446\u0438\u0435\u043d\u0442\u043e\u043c \u0432 \u043e\u0434\u043d\u043e\u043c \u043c\u0435\u0441\u0442\u0435.",
            about_section_demo_note: "\u041f\u0440\u043e\u0441\u0442\u043e, \u043f\u0440\u0430\u043a\u0442\u0438\u0447\u043d\u043e \u0438 \u0434\u043e\u0432\u0435\u0440\u0438\u0442\u0435\u043b\u044c\u043d\u043e.",
            about_spotlight_label: "\u041f\u043e\u0447\u0435\u043c\u0443 \u0441\u043f\u043e\u043a\u043e\u0439\u043d\u043e",
            about_spotlight_title: "\u041e\u0434\u0438\u043d \u043a\u043b\u0438\u043d\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u043c\u0430\u0440\u0448\u0440\u0443\u0442. \u042f\u0441\u043d\u044b\u0435 \u0440\u043e\u043b\u0438. \u0411\u044b\u0441\u0442\u0440\u044b\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f.",
            about_spotlight_text: "\u041d\u0430 \u044d\u043a\u0440\u0430\u043d\u0435 \u043e\u0441\u0442\u0430\u044e\u0442\u0441\u044f \u0442\u043e\u043b\u044c\u043a\u043e \u043d\u0443\u0436\u043d\u044b\u0435 \u0448\u0430\u0433\u0438.",
            about_section_stack: "\u0427\u0442\u043e \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442 \u043a\u043b\u0438\u043d\u0438\u043a\u0430",
            about_stack_1: "\u0412\u0440\u0430\u0447\u0438",
            about_stack_2: "\u0417\u0430\u043f\u0438\u0441\u0438",
            about_stack_3: "\u041d\u0430\u043f\u043e\u043c\u0438\u043d\u0430\u043d\u0438\u044f",
            about_stack_4: "\u041f\u043e\u043c\u043e\u0449\u044c",
            error_403_kicker: "\u0414\u043e\u0441\u0442\u0443\u043f \u0437\u0430\u043a\u0440\u044b\u0442",
            error_403_title: "\u042d\u0442\u0430 \u0437\u043e\u043d\u0430 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430 \u0434\u043b\u044f \u0432\u0430\u0448\u0435\u0439 \u0443\u0447\u0451\u0442\u043d\u043e\u0439 \u0437\u0430\u043f\u0438\u0441\u0438.",
            error_403_text: "\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442, \u043d\u043e \u0442\u0435\u043a\u0443\u0449\u0430\u044f \u0440\u043e\u043b\u044c \u043d\u0435 \u0438\u043c\u0435\u0435\u0442 \u043f\u0440\u0430\u0432 \u0434\u043b\u044f \u0435\u0451 \u043e\u0442\u043a\u0440\u044b\u0442\u0438\u044f. \u0412\u0435\u0440\u043d\u0438\u0441\u044c \u0432 \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u044b\u0439 \u0440\u0430\u0437\u0434\u0435\u043b Med Tech \u0438 \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0438 \u0440\u0430\u0431\u043e\u0442\u0443 \u0442\u0430\u043c.",
            error_403_tip: "\u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439 \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443, \u043a\u043e\u0442\u043e\u0440\u0430\u044f \u043f\u043e\u0434\u0445\u043e\u0434\u0438\u0442 \u0442\u0432\u043e\u0435\u0439 \u0440\u043e\u043b\u0438.",
            error_404_kicker: "\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430",
            error_404_title: "\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430, \u043a\u043e\u0442\u043e\u0440\u0443\u044e \u0442\u044b \u043e\u0442\u043a\u0440\u044b\u043b, \u043d\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442.",
            error_404_text: "\u0421\u0441\u044b\u043b\u043a\u0430 \u043c\u043e\u0433\u043b\u0430 \u0443\u0441\u0442\u0430\u0440\u0435\u0442\u044c, \u0431\u044b\u0442\u044c \u043d\u0435\u043f\u043e\u043b\u043d\u043e\u0439 \u0438\u043b\u0438 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443 \u0443\u0436\u0435 \u0443\u0431\u0440\u0430\u043b\u0438. \u0422\u044b \u043c\u043e\u0436\u0435\u0448\u044c \u0432\u0435\u0440\u043d\u0443\u0442\u044c\u0441\u044f \u0432 \u043e\u0441\u043d\u043e\u0432\u043d\u043e\u0439 flow Med Tech \u0438 \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c \u043e\u0442\u0442\u0443\u0434\u0430.",
            error_404_tip: "\u041d\u0430\u0447\u043d\u0438 \u0437\u0430\u043d\u043e\u0432\u043e \u0441 \u0433\u043b\u0430\u0432\u043d\u043e\u0439 \u0438\u043b\u0438 \u0441\u043e \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u00ab\u041e \u043d\u0430\u0441\u00bb.",
            error_code_label: "\u041a\u043e\u0434 \u043e\u0448\u0438\u0431\u043a\u0438",
            error_tip_label: "\u041f\u043e\u0434\u0441\u043a\u0430\u0437\u043a\u0430",
            error_btn_home: "\u041d\u0430 \u0433\u043b\u0430\u0432\u043d\u0443\u044e",
            error_btn_doctors: "\u041a \u0432\u0440\u0430\u0447\u0430\u043c",
            error_btn_about: "\u0427\u0438\u0442\u0430\u0442\u044c \u043e Med Tech"
        }
    };

    const weekdayLabels = {
        en: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        ru: [
            "\u041f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a",
            "\u0412\u0442\u043e\u0440\u043d\u0438\u043a",
            "\u0421\u0440\u0435\u0434\u0430",
            "\u0427\u0435\u0442\u0432\u0435\u0440\u0433",
            "\u041f\u044f\u0442\u043d\u0438\u0446\u0430",
            "\u0421\u0443\u0431\u0431\u043e\u0442\u0430",
            "\u0412\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435"
        ],
    };

    const statusLabels = {
        en: {
            pending: "Pending",
            confirmed: "Confirmed",
            completed: "Completed",
            cancelled: "Cancelled",
            online: "Online",
            busy: "Busy",
            offline: "Offline",
        },
        ru: {
            pending: "\u0412 \u043e\u0436\u0438\u0434\u0430\u043d\u0438\u0438",
            confirmed: "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u043e",
            completed: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e",
            cancelled: "\u041e\u0442\u043c\u0435\u043d\u0435\u043d\u043e",
            online: "\u041e\u043d\u043b\u0430\u0439\u043d",
            busy: "\u0417\u0430\u043d\u044f\u0442",
            offline: "\u041d\u0435 \u0432 \u0441\u0435\u0442\u0438",
        },
    };

    function currentLanguage() {
        return html.getAttribute("data-lang") || "en";
    }

    function applyLanguage(lang) {
        const dict = translations[lang] || translations.en;

        html.setAttribute("data-lang", lang);
        html.lang = lang;
        localStorage.setItem("lang", lang);

        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const key = element.dataset.i18n;
            if (dict[key]) {
                element.textContent = dict[key];
            }
        });

        document.querySelectorAll("[data-page-i18n]").forEach((element) => {
            const key = element.dataset.pageI18n;
            if (dict[key]) {
                element.textContent = dict[key];
            }
        });

        document.querySelectorAll("[data-page-i18n-placeholder]").forEach((element) => {
            const key = element.dataset.pageI18nPlaceholder;
            if (dict[key]) {
                element.setAttribute("placeholder", dict[key]);
            }
        });

        document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
            const key = element.dataset.i18nAriaLabel;
            if (dict[key]) {
                element.setAttribute("aria-label", dict[key]);
            }
        });

        langButtons.forEach((button) => {
            button.classList.toggle("active", button.dataset.langBtn === lang);
        });

        applyLocalizedDynamicContent(lang);

        document.dispatchEvent(new CustomEvent("app:languageChanged", { detail: { lang } }));
    }

    function formatLocalDateValue(value, format, lang) {
        if (!value) {
            return "";
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }

        const locale = lang === "ru" ? "ru-RU" : "en-US";
        const optionsMap = {
            "day-month": { day: "2-digit", month: "short" },
            "month-year": { month: "short", year: "numeric" },
            "time": { hour: "2-digit", minute: "2-digit" },
            "datetime": { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" },
        };

        const options = optionsMap[format] || optionsMap.datetime;
        return new Intl.DateTimeFormat(locale, options).format(date);
    }

    function applyLocalizedDynamicContent(lang) {
        const weekdayDict = weekdayLabels[lang] || weekdayLabels.en;
        const statusDict = statusLabels[lang] || statusLabels.en;

        document.querySelectorAll("[data-weekdays]").forEach((element) => {
            const raw = element.dataset.weekdays || "";
            const labels = raw
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .map((item) => weekdayDict[Number.parseInt(item, 10)])
                .filter(Boolean);

            if (labels.length) {
                element.textContent = labels.join(", ");
            }
        });

        document.querySelectorAll("[data-local-date]").forEach((element) => {
            element.textContent = formatLocalDateValue(
                element.dataset.localDate,
                element.dataset.localFormat,
                lang
            );
        });

        document.querySelectorAll("[data-status]").forEach((element) => {
            const key = element.dataset.status;
            if (statusDict[key]) {
                element.textContent = statusDict[key];
            }
        });
    }

    function applyTheme(theme) {
        html.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        document.dispatchEvent(new CustomEvent("app:themeChanged", { detail: { theme } }));
    }

    function markActiveNav() {
        const currentPath = window.location.pathname;
        navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            const isActive = href && href !== "#" && href.startsWith("/") && currentPath === href;
            link.classList.toggle("is-active", isActive);
        });
    }

    function closeNavPanel() {
        body.classList.remove("nav-open");
        if (navToggle) {
            navToggle.setAttribute("aria-expanded", "false");
        }
    }

    function toggleNavPanel() {
        const willOpen = !body.classList.contains("nav-open");
        body.classList.toggle("nav-open", willOpen);
        if (navToggle) {
            navToggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
        }
    }

    function handleHeaderScroll() {
        const header = document.querySelector(".site-header");
        if (!header) {
            return;
        }

        header.style.boxShadow = window.scrollY > 10
            ? "0 4px 24px rgba(13, 27, 46, 0.10)"
            : "none";
    }

    function initMotion() {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const selectors = [
            ".portal-hero",
            ".portal-card",
            ".portal-sidebar-card",
            ".portal-panel",
            ".page-note",
            ".flash",
            ".summary-card",
            ".appointment-card",
            ".profile-card",
            ".doctor-item",
            ".chat-bubble",
            ".empty-card",
            ".doctors-hero",
            ".doctors-toolbar",
            ".map-card",
            ".doctors-sidebar",
            ".appointments-table-wrap",
            ".appointments-summary",
            ".appointments-hero-copy",
            ".empty-state"
        ];

        const elements = Array.from(document.querySelectorAll(selectors.join(",")))
            .filter((element) => !element.classList.contains("reveal-ap"));

        elements.forEach((element, index) => {
            element.classList.add("motion-reveal");
            element.style.setProperty("--motion-delay", `${Math.min(index * 45, 240)}ms`);
        });

        const observer = new IntersectionObserver((entries, motionObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                motionObserver.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -8% 0px"
        });

        elements.forEach((element) => observer.observe(element));
    }

    document.querySelectorAll(".flash__close").forEach((button) => {
        button.addEventListener("click", () => {
            const flash = button.closest(".flash");
            if (flash) {
                flash.remove();
            }
        });
    });

    applyTheme(html.getAttribute("data-theme") || "light");
    applyLanguage(currentLanguage());
    markActiveNav();
    handleHeaderScroll();
    initMotion();

    themeToggle?.addEventListener("click", () => {
        const nextTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
    });

    navToggle?.addEventListener("click", toggleNavPanel);

    langButtons.forEach((button) => {
        button.addEventListener("click", () => applyLanguage(button.dataset.langBtn));
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", closeNavPanel);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNavPanel();
        }
    });

    document.addEventListener("click", (event) => {
        if (!body.classList.contains("nav-open") || !navPanel || !navToggle) {
            return;
        }

        if (!navPanel.contains(event.target) && !navToggle.contains(event.target)) {
            closeNavPanel();
        }
    });

    window.addEventListener("scroll", handleHeaderScroll, { passive: true });
    window.addEventListener("resize", () => {
        if (window.innerWidth > 1380) {
            closeNavPanel();
        }
    });
});

