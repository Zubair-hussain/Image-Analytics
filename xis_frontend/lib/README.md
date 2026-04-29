# XIS Frontend – API Layer (`lib/api`)

## Overview
This module is the **central communication layer** between the frontend (Next.js) and backend (Django REST API).

It is responsible for:
- Sending HTTP requests
- Attaching authentication tokens
- Handling API responses
- Abstracting backend endpoints into clean functions

---

## Role in Architecture


Frontend UI Components
↓
lib/api.ts
↓
HTTP Requests
↓
Django Backend API
↓
Database / Services


---

## Core Responsibility

Instead of calling `fetch()` directly inside components, this layer:

- Centralizes all API calls
- Keeps frontend clean and modular
- Makes endpoints reusable
- Simplifies debugging and maintenance

---

## Authentication Handling

All requests automatically include JWT token:

- Reads token from `localStorage`
- Attaches it to request headers:

Authorization: Bearer <token>


---

## API Endpoints Used

### 1. Authentication
- `POST /auth/login/`
- `POST /auth/refresh/`

---

### 2. Image Analytics

- `GET /images/`
  - Paginated image list
  - Supports filtering (label, date range)

- `POST /images/upload/`
  - Upload new image
  - Triggers backend analysis pipeline

---

### 3. Analytics Aggregation

- `GET /images/count/`
  - Returns total image count

- `GET /images/by-label/`
  - Returns grouped label distribution

- `GET /images/by-day/`
  - Returns daily upload statistics

---

## Example API Structure

```ts id="apiex21"
export const api = {
  count: () => GET("/images/count/"),
  byDay: () => GET("/images/by-day/"),
  byLabel: () => GET("/images/by-label/"),
  images: (page: number) => GET(`/images/?page=${page}`),
};
Data Flow
Component → api.ts → Backend → Response → State Update → UI Render
Error Handling Strategy
Network failures are caught globally
Invalid token → redirect to login
Backend errors → returned to UI layer
Graceful fallback states in components
Design Principles
Single source of truth for API calls
No direct fetch calls in UI components
Fully reusable request functions
Clean separation of concerns
Scalable endpoint structure
Benefits
Easy to scale backend endpoints
Cleaner React components
Centralized authentication logic
Faster debugging and updates
Consistent request patterns

```

# Summary

The lib/api layer acts as the communication bridge between frontend and backend, ensuring all data flows in a structured, secure, and maintainable way across the XIS system.
