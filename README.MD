# MedTech AI Platform 🏥🤖

Современная медицинская платформа с интеграцией ИИ для анализа симптомов и управления показателями здоровья.

## 🚀 Функционал
- **Bento Grid Dashboard:** Персонализированный интерфейс для пациентов и врачей.
- **AI Symptom Checker:** Интеллектуальный помощник на базе ИИ.
- **Управление ролями:** Четкое разделение на Пациентов, Врачей и Администраторов.
- **Геолокация:** Интеграция с Google Maps для поиска клиник.
- **Безопасность:** Регистрация через Email с подтверждением и хранение данных в PostgreSQL.

## 🛠 Стек технологий
- **Backend:** Django 5.2, Python 3.12
- **Database:** PostgreSQL
- **Tools:** python-dotenv (Environment variables)
- **Frontend:** HTML5, CSS3 (Bento Grid layout), JavaScript

## 📦 Установка и запуск
1. Клонировать репозиторий: `git clone <link>`
2. Создать окружение: `python -m venv .venv`
3. Установить зависимости: `pip install -r requirements.txt`
4. Настроить `.env` файл (см. `.env.example`)
5. Выполнить миграции: `python manage.py migrate`
6. Запустить сервер: `python manage.py runserver`