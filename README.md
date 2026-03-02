# MedAssist

MedAssist is a full-stack medical assistant application with:
- Backend: Django + Django REST Framework
- Web Frontend: React + Vite + Tailwind
- Mobile Frontend: React Native (Expo)
- Database: PostgreSQL (via `DATABASE_URL`)
- LLM Provider: Groq API

## Project Structure
- `Backend/backend/`: Django project (`manage.py`, app: `chat`)
- `Frontend/`: React web app (Vite dev server + `/api` proxy to Django)
- `Mobile/`: Expo React Native app

## Features Implemented
- Email/password auth (web + mobile)
- Google Sign-In (web)
- Chat sessions and chat history
- Medical report upload + analysis (`txt/csv/json/pdf/docx/png/jpg/jpeg/webp`)
- Profile/settings/password management
- Admin panel:
  - user management
  - medical JSON management + restore versions
  - system health checks
  - audit logs

## Prerequisites
- Python `3.11+`
- Node.js `20+`
- npm `10+`
- PostgreSQL (or hosted Postgres URL)
- Groq API key
- Optional for OCR on images: Tesseract OCR installed locally

## Environment - Setup

Create root `.env` (copy from `.env.example`) and fill required values:

```env
# Required
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db_name>
GROQ_API=<your_groq_api_key>

# Required only if using Google login
GOOGLE_CLIENT_ID=<your_google_web_client_id>

# Recommended for local dev
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost,http://127.0.0.1

# Optional OCR config (Windows)
TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe
```

Notes:
- Do not commit real secrets to git.
- `DEBUG` in this project expects `True`/`False` (not `1`/`0`).

## Run Locally

### 1) Backend (Django)

```powershell
cd Backend/backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

API base URL: `http://127.0.0.1:8000/api/`

### 2) Frontend (Web)

In a new terminal:

```powershell
cd Frontend
npm install
```

If you want Google Sign-In on web, create `Frontend/.env`:

```env
VITE_GOOGLE_CLIENT_ID=<same_client_id_as_backend_or_matching_web_client_id>
```

Run web app:

```powershell
npm run dev
```

Open: `http://localhost:5173`

### 3) Mobile (Expo)

In a new terminal:

```powershell
cd Mobile
copy .env.example .env
npm install
npm run start
```

Set `Mobile/.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://<your-backend-host>:8000
```

Examples:
- Android emulator: `http://10.0.2.2:8000`
- iOS simulator: `http://127.0.0.1:8000`
- Physical device: `http://<your-lan-ip>:8000`

## Admin Access

Admin routes are available in web and mobile for users with admin permissions (`is_staff`/`is_superuser`).

Create an admin user:

```powershell
cd Backend/backend
python manage.py createsuperuser
```

Open admin app from web route: `http://localhost:5173/admin`

## Docker (Optional)

This repository currently has Dockerfiles but no `docker-compose.yml`.

Build backend image:

```powershell
docker build -t medassist-backend:latest Backend/backend
```

Build frontend image:

```powershell
docker build -t medassist-frontend:latest -f Frontend/Dockerfile .
```
