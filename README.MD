# Med Tech

Med Tech is a polished Django medical platform built as a presentation-ready portfolio project. It combines doctor discovery, role-based dashboards, appointment booking by schedule, AI assistance, email flows, and Telegram integration inside one consistent product.

## Features

- Custom user model with role-aware flows for `patient`, `doctor`, and `admin`
- Registration, login, logout, and email confirmation via SMTP
- Doctor discovery with map markers and real clinic locations in Dushanbe
- Doctor profile CRUD with a cleaner single-profile workflow
- Appointment booking by working days, working hours, and available slots
- Appointment soft delete for cancellations
- Automatic cancellation notifications via Telegram first, with email fallback
- Telegram bot with account linking, doctor directory, reminders, and quick actions
- AI assistant with chat history stored in `AIChatSession`
- Multi-provider AI fallback prepared for OpenAI, xAI/Grok, and Gemini
- Custom Django admin in Med Tech style
- Custom `403` and `404` pages in the same UI language as the main site
- Responsive UI across auth, dashboard, doctors, appointments, AI, and admin pages

## Stack

- Python 3.12
- Django 5.2
- SQLite
- django-filter
- django-crispy-forms
- crispy-bootstrap5
- aiogram
- OpenAI SDK
- Google GenAI SDK
- python-dotenv
- Pillow
- HTML, CSS, JavaScript

## Main Flows

### Patient

1. Register
2. Confirm email
3. Log in
4. Browse doctors and clinics
5. Book an appointment
6. Manage or cancel appointments
7. Use the AI assistant
8. Connect Telegram for reminders and quick actions

### Doctor

1. Log in with a doctor account
2. Create or manage a doctor profile
3. Review doctor-related appointments
4. Receive appointment reminders and cancellation notifications

### Admin

1. Access the custom Django admin panel
2. Review all appointments on the site
3. Manage doctor profiles across the platform

## Project Structure

```text
config/          Django settings and root URLs
core/            Models, views, forms, signals, filters, Telegram commands
telegram_bot/    Bot logic, reminders, keyboards, Telegram services
templates/       Shared templates, pages, custom admin, auth, error pages
static/          CSS and JavaScript assets
media/           Uploaded media files
manage.py        Django entry point
db.sqlite3       Local SQLite database
```

## Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd med-tech
```

2. Create and activate a virtual environment:

```bash
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the project root.

5. Apply migrations:

```bash
python manage.py migrate
```

6. Create a superuser if needed:

```bash
python manage.py createsuperuser
```

7. Run the project:

```bash
python manage.py runserver
python manage.py run_telegram_bot
```

## Environment Variables

Create `.env` in the project root and add:

```env
SECRET_KEY=your_django_secret_key
DEBUG=True

EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password

OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-5-mini

XAI_API_KEY=your_xai_key
XAI_MODEL=grok-4-1-fast-reasoning

GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-2.5-flash

AI_PROVIDER_ORDER=openai,xai,gemini
OPENAI_MAX_CHAT_HISTORY=18

TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_BOT_USERNAME=your_bot_username_without_@
TELEGRAM_REMINDER_INTERVAL_SECONDS=300

SITE_URL=http://127.0.0.1:8000
```

## Telegram Bot

The project includes a Telegram bot that works as a mobile companion to the site.

Current bot capabilities:

- account linking through the website
- upcoming appointments
- next appointment
- doctor directory with inline buttons
- automatic reminders for today’s appointments
- cancellation notifications

Run it with:

```bash
python manage.py run_telegram_bot
```

## Email Features

- email confirmation after registration
- appointment creation emails
- cancellation fallback emails
- password reset emails

## AI Assistant

The AI chat stores history in `AIChatSession` and is configured to try providers in the order defined by `AI_PROVIDER_ORDER`.

Supported provider setup:

- OpenAI
- xAI / Grok
- Gemini

If one provider fails, the assistant tries the next one.

## Demo Data

You can seed demo doctors with Dushanbe clinic addresses using:

```bash
python manage.py seed_dushanbe_clinics
```

## Screenshots

- Dashboard screenshot placeholder
- Doctors page screenshot placeholder
- Appointments page screenshot placeholder
- AI assistant screenshot placeholder
- Telegram bot screenshot placeholder
- Admin panel screenshot placeholder

## Notes

- The project currently uses SQLite for local/demo usage.
- Telegram reminders work automatically while the bot process is running.
- Appointment cancellation uses soft delete instead of hard removal.
- Custom `403` and `404` pages are included.
- Before deployment, make sure at least one AI provider key is valid and active.

## How To Run Before Demo

```bash
python manage.py migrate
python manage.py runserver
python manage.py run_telegram_bot
```

Then open the browser and test:

- `register -> confirm email -> login`
- `dashboard -> doctors -> booking -> appointments`
- `AI assistant`
- `Telegram linking and reminders`

