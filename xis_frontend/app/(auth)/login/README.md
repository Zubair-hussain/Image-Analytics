# XIS Frontend – Authentication (Login Module)

## Overview
This module handles the **user authentication system** for the XIS Image Analytics platform.

It is responsible for:
- User login flow
- JWT token handling
- Route protection
- Session persistence
- Secure access to dashboard

---

## Authentication Flow


User → Login Page → API Request → Backend JWT
↓
Token Stored in localStorage
↓
Redirect to Dashboard
↓
Protected Routes Validate Token


---

## Login Page Responsibilities

### 1. User Authentication
- Accepts user credentials (username/password)
- Sends request to backend:
  - `POST /auth/login/`
- Receives JWT access + refresh token

---

### 2. Token Management
- Stores token in `localStorage`
- Uses token for API authorization
- Maintains session across refresh

---

### 3. Route Protection
- Checks token existence on protected pages
- Redirects unauthenticated users to `/login`
- Prevents unauthorized dashboard access

---

### 4. Error Handling
- Invalid credentials handling
- Network failure handling
- Displays user-friendly error messages

---

## API Integration

### Login Endpoint

POST /auth/login/


### Request Body
```json
{
  "username": "string",
  "password": "string"
}
Response
{
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token"
}
Security Logic
JWT-based authentication
Stateless session handling
Token stored client-side (localStorage)
Backend validates every protected request
UI Behavior
Clean login form interface
Loading state during authentication
Error state for invalid credentials
Auto redirect on success
Protected Route Logic
if (!token) {
  redirect("/login")
} else {
  allow access to dashboard
}

```

# Key Features
Secure JWT authentication
Persistent login sessions
Protected dashboard routing
Simple and fast login UX
Backend-driven security model
Summary

The authentication module acts as the entry gate of the XIS system, ensuring only verified users can access the analytics dashboard and image intelligence platform.
