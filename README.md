# SaskLifeHub

Saskatchewan's all-in-one services hub — marketplace, utilities, finances, and health, built for the province.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui |
| Backend | Flask 3 + Flask-JWT-Extended + SQLAlchemy |
| Database | PostgreSQL 16 |
| Cache / Queue | Redis 7 |
| Auth | JWT access tokens (1hr) + refresh tokens (30d) |
| Email | Flask-Mail (SMTP) |
| Containers | Docker + Docker Compose |

## Project Structure

```
SaskLifeHub/
├── frontend/               # Next.js 14 app
│   ├── src/app/            # App Router pages
│   │   ├── page.tsx                # Landing
│   │   ├── dashboard/              # Protected dashboard
│   │   ├── auth/login|signup|verify-email/
│   │   ├── marketplace/            # Listings + create + detail
│   │   ├── utilities/              # Saskatchewan utility bills
│   │   ├── finances/               # Budget tools + community
│   │   ├── health/                 # Health services + wellness
│   │   ├── profile/                # User profile (edit)
│   │   └── notifications/          # Notification inbox
│   ├── src/components/     # Reusable UI components
│   ├── src/lib/            # API client, types, auth helpers
│   └── src/contexts/       # AuthContext (React context)
├── backend/                # Flask REST API
│   ├── app.py              # Application factory
│   ├── config.py           # Dev/prod config
│   ├── extensions.py       # SQLAlchemy, JWT, Mail singletons
│   ├── models/             # User, Listing, Order, Notification
│   ├── routes/             # auth, users, marketplace, notifications
│   ├── services/           # email_service, notification_service
│   └── migrations/
│       └── schema.sql      # Raw PostgreSQL DDL
├── SaskLife/               # Original React Native app (preserved)
├── docker-compose.yml      # Full stack (postgres + redis + api + frontend)
├── .env.example            # Root environment template
└── README.md
```

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- Python 3.12+
- PostgreSQL 16 (or Docker)
- Redis (or Docker)

---

### Option A — Docker Compose (Recommended)

```bash
# 1. Clone and enter the project
cd C:\SaskLifeHub

# 2. Set up environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# 3. Edit backend/.env — set SECRET_KEY, JWT_SECRET_KEY, and MAIL_* values

# 4. Start everything
docker compose up --build

# Frontend → http://localhost:3000
# Backend  → http://localhost:5000
# Health   → http://localhost:5000/health
```

---

### Option B — Manual Setup

#### 1. Database

```bash
# Create the PostgreSQL database and user
psql -U postgres -c "CREATE USER sasklifehub WITH PASSWORD 'password';"
psql -U postgres -c "CREATE DATABASE sasklifehub OWNER sasklifehub;"
psql -U sasklifehub -d sasklifehub -f backend/migrations/schema.sql
```

#### 2. Backend (Flask)

```bash
cd backend

# Create and activate virtualenv
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env — fill in DATABASE_URL, SECRET_KEY, JWT_SECRET_KEY, MAIL_* values

# Run migrations (or use schema.sql above)
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Start server
python app.py
# → Running on http://localhost:5000
```

#### 3. Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local if your backend is on a different port

# Start dev server
npm run dev
# → Running on http://localhost:3000
```

---

## API Reference

### Auth (`/auth`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | — | Register new account |
| POST | `/auth/login` | — | Login, returns JWT tokens |
| POST | `/auth/refresh` | Refresh token | Get new access token |
| GET | `/auth/me` | Bearer | Current user info |
| POST | `/auth/verify-email` | — | Verify email with token |
| POST | `/auth/resend-verification` | — | Resend verification email |
| POST | `/auth/logout` | Bearer | Logout (client clears cookies) |

### Users (`/users`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users/<id>` | — | Public profile |
| PUT | `/users/me` | Bearer | Update own profile |

### Marketplace (`/marketplace`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/marketplace/listings` | — | List listings (search, category, page) |
| GET | `/marketplace/listings/<id>` | — | Single listing |
| POST | `/marketplace/listings` | Bearer | Create listing |
| PUT | `/marketplace/listings/<id>` | Bearer (owner) | Update listing |
| DELETE | `/marketplace/listings/<id>` | Bearer (owner) | Delete listing |
| POST | `/marketplace/orders` | Bearer | Place order |
| GET | `/marketplace/orders` | Bearer | My orders (buyer or seller) |

### Notifications (`/notifications`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/notifications` | Bearer | My notifications |
| PATCH | `/notifications/<id>/read` | Bearer | Mark one read |
| PATCH | `/notifications/read-all` | Bearer | Mark all read |

---

## Features

### Implemented
- **Auth flow** — signup, login, email verification, JWT + refresh token rotation
- **Marketplace** — listings with 8 Saskatchewan-relevant categories, search, pagination, orders
- **Utilities Hub** — SaskPower, SaskEnergy, SaskTel, water, TransGas, Access Communications
- **Financial Agora** — interactive budget tracker, 8 financial tools, community listings
- **Health Agora** — wellness tracker, 8 health service categories, events board
- **User profiles** — editable name, bio, location, phone
- **Notifications** — in-app notification system with mark-read
- **Responsive UI** — mobile-first with hamburger nav

### From the Original SaskLife React Native App (Preserved)
All screen content from the original Expo app has been carried over:
- Marketplace categories and featured listings
- Utility providers (8 Saskatchewan services)
- Financial tools and community marketplace
- Health categories, featured resources, and local events
- Settings/dark mode concept

### Roadmap (Not Yet Built)
- React Native mobile app (Expo) — reuse existing SaskLife scaffolding
- File uploads for listing images
- Real-time notifications via WebSocket
- Payment integration (Stripe)
- Background workers (Celery tasks for email queue)
- Admin dashboard

---

## Environment Variables

### `backend/.env`

| Variable | Required | Description |
|---|---|---|
| `SECRET_KEY` | Yes | Flask secret key |
| `JWT_SECRET_KEY` | Yes | JWT signing key |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | No | Redis URL (default: localhost:6379) |
| `MAIL_SERVER` | For email | SMTP server |
| `MAIL_USERNAME` | For email | SMTP username |
| `MAIL_PASSWORD` | For email | SMTP password (use app password for Gmail) |
| `FRONTEND_URL` | Yes | CORS allowed origin |

### `frontend/.env.local`

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_AUTH_API_URL` | Backend URL (default: http://localhost:5000) |
| `NEXT_PUBLIC_APP_URL` | Frontend URL (default: http://localhost:3000) |

---

## License

MIT — see [LICENSE](./LICENSE)
