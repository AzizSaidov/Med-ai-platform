# Med Tech

Med Tech is a Django healthcare platform built for Open Day presentation and portfolio use. It combines doctor discovery, appointment booking, role-based workflows, email-confirmed authentication, and an AI assistant inside one polished product flow.

## Overview

The project is designed to feel like a finished medical web product rather than a collection of unrelated demo pages. Patients can register, confirm their email, browse doctors, book appointments, manage their own visits, and use an AI assistant with stored chat history. Doctors get a dedicated profile management flow and appointment visibility tied to their role. Administrators keep full access.

## Core Features

- Custom user model
- Registration, login, logout, and email confirmation via SMTP
- Role-aware UI and backend permissions for `patient`, `doctor`, and `admin`
- Doctor discovery page with interactive map and filtering
- Doctor profile CRUD with improved single-profile flow for doctors
- Appointment booking flow
- Appointment CRUD with soft delete for cancellations
- Appointment visibility scoped to the related patient or doctor
- AI assistant powered by the OpenAI Responses API
- Saved AI chat history using the existing `AIChatSession` model
- Django forms and crispy-bootstrap5 integration
- Django Filter integration for doctor search
- Signals for AI session creation and appointment email notifications
- Responsive custom UI across dashboard, doctors, appointments, AI, and auth pages

## Tech Stack

- Python 3.12
- Django 5.2
- PostgreSQL
- django-filter
- django-crispy-forms
- crispy-bootstrap5
- Pillow
- python-dotenv
- OpenAI Python SDK
- HTML, CSS, JavaScript

## Project Structure

```text
config/        Django settings, root URLs, WSGI
core/          Models, forms, views, filters, signals, access helpers, AI service
templates/     Shared and page-specific Django templates
static/        CSS and JavaScript assets
media/         Uploaded avatars and doctor photos
manage.py      Django management entry point
```

## Main User Flows

### Patient Flow

1. Register an account
2. Confirm email through the verification link
3. Log in to the dashboard
4. Browse doctors on the map
5. Book an appointment
6. View or cancel own appointments
7. Use the AI assistant for general guidance

### Doctor Flow

1. Log in with a doctor-role account
2. Create a doctor profile if one does not exist yet
3. Update public profile details and map data
4. Review appointments related to that doctor profile

### Admin Flow

1. Access all patient and doctor functionality
2. Open the admin panel
3. Review doctor management pages and platform flows

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

7. Run the development server:

```bash
python manage.py runserver
```

## Environment Variables

Create a `.env` file with the following values:

```env
SECRET_KEY=your-django-secret-key

DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432

EMAIL_HOST_USER=your_smtp_email
EMAIL_HOST_PASSWORD=your_smtp_password

OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5-mini
OPENAI_MAX_CHAT_HISTORY=18
```

## How To Run

```bash
python manage.py migrate
python manage.py runserver
```

Open the app in the browser and go through the full flow:

- `register -> confirm email -> login -> dashboard -> doctors -> book -> appointments -> AI`

## Feature Notes

- Email confirmation is required before login.
- Appointment cancellation uses soft delete instead of hard removal.
- Signals automatically create an AI chat session and send appointment confirmation email notifications.
- Doctor profile actions are hidden from patients in the UI and protected in the backend.
- The AI assistant stores conversation history in `AIChatSession.history`.


## Future Improvements

- Deployment configuration
- Middleware-level access refinements
- Telegram or aiogram integration

## Demo Readiness

This version is focused on looking clean, consistent, and presentation-ready for Open Day while preserving the existing project structure and already working Django logic.
