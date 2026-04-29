# Core Module (XIS Backend)

## Overview
The `core/` folder contains the **central configuration layer** of the Django backend project.  
It does not contain business logic — instead, it controls how the entire system is configured, routed, and served.

This module acts as the **foundation layer** that connects all apps, settings, and server entry points.

---

## Folder Structure


core/
│── init.py
│── settings.py
│── urls.py
│── wsgi.py
│── pycache/


---

## Responsibilities

### 1. Settings Configuration (`settings.py`)
This file controls the global configuration of the Django project.

It includes:
- Installed applications (Django apps, DRF, CORS, local apps)
- Middleware configuration
- Database setup (SQLite / PostgreSQL support)
- REST Framework configuration
- JWT authentication settings (SimpleJWT)
- Media and static file configuration
- CORS policy
- Logging configuration
- Security settings (SECRET_KEY, DEBUG, ALLOWED_HOSTS)

 
This file defines **how the system behaves globally**

---

### 2. URL Routing (`urls.py`)
This file defines the **main API routing entry point**.

It connects:
- Authentication endpoints
- Image application APIs
- Health check endpoint

Key routes:
- `/auth/login/` → JWT token generation
- `/auth/refresh/` → token refresh
- `/images/` → image-related APIs
- `/health/` → system status check

👉 This file acts as the **API gateway router**

---

### 3. WSGI Entry Point (`wsgi.py`)
This file is the **server entry point for deployment**.

It exposes the Django application to production servers like:
- Gunicorn
- Docker containers
- Cloud hosting platforms

👉 This file is required for **deployment but not business logic**

---

### 4. Package Init (`__init__.py`)
- Marks the `core` directory as a Python package
- Required for Django module recognition

---

## Role in System Architecture

The `core/` module sits at the **top level of the backend system**:


core (configuration layer)
↓
images app (business logic)
↓
services (image analysis logic)
↓
database (storage layer)


---

## Key Idea

The `core` module does NOT implement features.

Instead, it:
- Configures the system
- Routes requests
- Connects apps
- Enables deployment

It is the **control center of the backend architecture**.
