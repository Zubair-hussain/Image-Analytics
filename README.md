# XIS Image Analytics Platform

> Full-stack Image Analytics System built for the XIS Hiring Assessment.
> Upload images, auto-analyze them with Pillow, and view structured analytics through a cosmic-themed dashboard.

**Repo:** [github.com/Zubair-hussain/Image-Analytics](https://github.com/Zubair-hussain/Image-Analytics)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Setup & Installation](#2-setup--installation)
3. [System Architecture](#3-system-architecture)
4. [API Documentation](#4-api-documentation)
5. [Design Decisions](#5-design-decisions)
6. [Assumptions & Limitations](#6-assumptions--limitations)

---

## 1. Project Overview

The XIS Image Analytics Platform allows users to upload images and automatically extract metadata using a Pillow-based analysis pipeline. The extracted data is stored in a PostgreSQL database and visualized through an analytics dashboard with charts, filters, and a paginated image registry.

### Key Features

- **Image Upload** — drag & drop interface with instant preview
- **Auto Analysis** — filename, size (KB), dimensions, and label extracted automatically on upload
- **Smart Labeling** — Pillow heuristics classify images into descriptive categories (Warm Tones, Dark Scene, Vibrant, etc.)
- **Analytics Dashboard** — total count cards, bar chart (uploads per day), pie chart (uploads per label)
- **Paginated Registry** — image table with thumbnail, filename, size, dimensions, label, timestamp
- **JWT Authentication** — all analytics endpoints protected, stateless auth
- **Fully Containerized** — single `docker-compose up --build` starts everything

### Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Recharts, CSS Custom Properties |
| **Backend** | Django 4.2, Django REST Framework 3.15 |
| **Auth** | djangorestframework-simplejwt (JWT Bearer tokens) |
| **Image Processing** | Pillow 10.3.0 |
| **Database** | PostgreSQL 15 |
| **Containerization** | Docker, Docker Compose |

---

## 2. Setup & Installation

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose installed
- Git

### Clone & Run

```bash
# 1. Clone the repository
git clone https://github.com/Zubair-hussain/Image-Analytics.git
cd Image-Analytics

# 2. Build and start all services
docker-compose up --build
```

This starts three containers:
- `db` — PostgreSQL 15 on port `5432`
- `backend` — Django on port `8000`
- `frontend` — Next.js on port `3000`

### Create Login User

```bash
# Run after docker-compose up --build (first time only)
docker-compose exec backend python manage.py createsuperuser
```

Follow the prompts to set a username and password.

### Access the App

| Service | URL |
|---|---|
| **Frontend Dashboard** | http://localhost:3000 |
| **Backend API** | http://localhost:8000 |
| **Health Check** | http://localhost:8000/health/ |

### Environment Variables

**Backend** (set in `docker-compose.yml`):

| Variable | Description | Example |
|---|---|---|
| `SECRET_KEY` | Django secret key for JWT signing | `your-long-random-string` |
| `DEBUG` | Debug mode — set `False` in production | `True` |
| `DB_NAME` | PostgreSQL database name | `xis_db` |
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | `postgres` |
| `DB_HOST` | DB service name in docker-compose | `db` |
| `DB_PORT` | PostgreSQL port | `5432` |

**Frontend** (`.env.local`):

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |

### Stop & Reset

```bash
# Stop all containers
docker-compose down

# Stop and wipe the database
docker-compose down -v

# Rebuild from scratch
docker-compose up --build
```

---

## 3. System Architecture

### Overview

```
┌─────────────────────────────────┐
│      Next.js 14 Frontend        │
│   (TypeScript + Recharts)       │
│   localhost:3000                │
└──────────────┬──────────────────┘
               │ REST API (JWT Bearer Token)
               ▼
┌─────────────────────────────────┐
│    Django REST Framework        │
│    localhost:8000               │
│                                 │
│  ┌─────────────────────────┐   │
│  │  ImageUploadView         │   │
│  │  analyze_image() service │   │
│  │  Pillow heuristics       │   │
│  └───────────┬─────────────┘   │
└──────────────┼──────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌──────────────┐
│ PostgreSQL  │  │ media/       │
│ xis_db      │  │ uploads/     │
│ (metadata)  │  │ (image files)│
└─────────────┘  └──────────────┘
```

### Data Flow — Image Upload

```
1. User selects image in browser
        ↓
2. Frontend sends POST /images/upload/ (multipart/form-data)
        ↓
3. Django receives file → validates content_type
        ↓
4. analyze_image(file) runs Pillow pipeline:
   - size_kb   = len(file.read()) / 1024
   - width, height = PILImage.open(file).size
   - r_avg, g_avg, b_avg, brightness, contrast, saturation
   - label = heuristic classification
        ↓
5. Image file saved → media/uploads/
   Metadata saved → images_image table
        ↓
6. 201 response with: filename, size, label, width, height, image_url
        ↓
7. Frontend modal shows analysis results
   Dashboard refreshes all charts + table
```

### Docker Compose Services

```yaml
services:
  db:       postgres:15   → port 5432  → volume: pgdata
  backend:  Django build  → port 8000  → depends_on: db
  frontend: Next.js build → port 3000  → depends_on: backend
```

### Database Schema

**Table: `images_image`**

| Field | Django Type | Notes |
|---|---|---|
| `id` | `AutoField` | Primary key, auto-increment |
| `filename` | `CharField(255)` | Original file name |
| `size` | `FloatField` | File size in KB |
| `label` | `CharField(100)` | Auto-assigned by Pillow — `db_index=True` |
| `timestamp` | `DateTimeField` | `auto_now_add=True` — `db_index=True` |
| `width` | `IntegerField` | Image width in pixels |
| `height` | `IntegerField` | Image height in pixels |
| `image` | `ImageField` | Relative path in `media/uploads/` |

> `label` and `timestamp` are indexed for fast GROUP BY and filter queries.
> Django's built-in `auth_user` table handles user credentials.

---

## 4. API Documentation

### Base URL
```
http://localhost:8000
```

### Authentication

All endpoints except `/auth/login/` and `/health/` require a JWT Bearer token.

```
Authorization: Bearer <access_token>
```

---

### POST `/auth/login/`
Authenticate and receive JWT tokens.

**Request:**
```json
{
  "username": "admin",
  "password": "your_password"
}
```

**Response `200`:**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### POST `/images/upload/`
Upload an image. All metadata is extracted automatically.

**Headers:** `Authorization: Bearer <token>`

**Body:** `multipart/form-data`
```
image: <file>
```

**Response `201`:**
```json
{
  "id": 1,
  "filename": "sunset_beach.jpg",
  "size": 245.6,
  "label": "Warm Tones",
  "width": 1920,
  "height": 1080,
  "timestamp": "2026-04-29T14:32:00Z",
  "image_url": "http://localhost:8000/media/uploads/sunset_beach.jpg"
}
```

---

### GET `/images/`
Get paginated list of image records.

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
| Param | Type | Example |
|---|---|---|
| `page` | integer | `?page=2` |
| `limit` | integer | `?limit=10` |
| `label` | string | `?label=Warm+Tones` |
| `date_from` | date | `?date_from=2026-04-01` |
| `date_to` | date | `?date_to=2026-04-30` |

**Response `200`:**
```json
{
  "count": 50,
  "next": "http://localhost:8000/images/?page=2",
  "items": [
    {
      "id": 1,
      "filename": "sunset_beach.jpg",
      "size": 245.6,
      "label": "Warm Tones",
      "width": 1920,
      "height": 1080,
      "timestamp": "2026-04-29T14:32:00Z",
      "image_url": "http://localhost:8000/media/uploads/sunset_beach.jpg"
    }
  ]
}
```

---

### GET `/images/count/`
Get total number of image records.

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{
  "count": 128
}
```

---

### GET `/images/group-by-label/`
Get image counts grouped by label. Powers the pie chart.

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
[
  { "label": "Warm Tones", "count": 45 },
  { "label": "Dark Scene", "count": 30 },
  { "label": "Vibrant", "count": 20 },
  { "label": "Monochrome", "count": 15 }
]
```

---

### GET `/images/group-by-day/`
Get image counts grouped by upload date. Powers the bar chart.

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
[
  { "date": "2026-04-27", "count": 12 },
  { "date": "2026-04-28", "count": 8 },
  { "date": "2026-04-29", "count": 15 }
]
```

---

### GET `/health/`
Health check — no auth required.

**Response `200`:**
```json
{
  "status": "ok"
}
```

---

## 5. Design Decisions

### Django REST Framework over FastAPI
DRF was chosen as specified in the assessment requirements. It provides a mature ORM, built-in pagination, serializers, and a browsable API interface — all reducing boilerplate for a CRUD-heavy analytics system.

### JWT Authentication (SimpleJWT)
Stateless authentication — no server-side sessions. The access token (1hr lifetime) is stored in `localStorage` and injected into every API request via a centralized `api.ts` utility. On 401 responses, the frontend silently redirects to login.

### Pillow for Image Analysis (No External APIs)
All image analysis runs locally using Pillow heuristics — no API keys required, no external dependencies, works fully offline. The `analyze_image()` service calculates brightness, contrast, saturation, and aspect ratio to assign descriptive labels. This keeps the system self-contained and reproducible.

### Dual-Index Database Design
Both `label` and `timestamp` fields have `db_index=True`. This makes the GROUP BY queries (used by the charts) significantly faster as the dataset grows, without requiring any additional configuration.

### Docker Compose for Full Isolation
All three services (PostgreSQL, Django, Next.js) run in isolated containers. A named Docker volume (`pgdata`) ensures database persistence across restarts. Environment variables are injected at runtime — no secrets are hardcoded.

### Centralized API Client (`api.ts`)
All frontend HTTP calls go through a single `api.ts` file that automatically attaches the JWT header, handles 401 redirects, and manages FormData vs JSON content types. This means auth logic lives in one place and never needs to be repeated across components.

---

## 6. Assumptions & Limitations

### Assumptions
- Single user system — one superuser account created via `createsuperuser`
- Images are analyzed at upload time only — no re-analysis after upload
- The frontend and backend run on the same machine during development
- No refresh token rotation implemented on the frontend — expired tokens redirect to login

### Current Limitations
- **Image labeling is heuristic-based** — uses color/brightness/aspect ratio analysis, not a trained ML model. Labels are descriptive but not semantically precise
- **Media stored locally** — uploaded files are stored in `media/uploads/` inside the Docker container. Files are lost if the container is removed without a volume mount
- **No real-time updates** — dashboard requires a manual refresh or page reload to show new data. WebSockets not implemented
- **No file size limit enforced** — very large images may cause slow analysis
- **Single admin user** — no role-based access control or user registration flow

### Future Improvements
- Integrate AI Vision API (Google Gemini Vision / AWS Rekognition) for smarter semantic labels
- Add WebSocket support for real-time dashboard updates
- Use Cloudinary or AWS S3 for persistent cloud media storage
- Add role-based access control and user registration
- Implement refresh token rotation for seamless session management
- Add image re-analysis endpoint for updating labels

---

*Built by [Zubair Hussain](https://github.com/Zubair-hussain) — Full Stack Developer*
