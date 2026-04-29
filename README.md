#  XIS Image Analytics Platform

A full-stack **Image Analytics System** built for the XIS Hiring Assessment.  
The system allows users to upload images, automatically analyze them, and view structured analytics through a dashboard.

---

#  Tech Stack

## Backend
- Django
- Django REST Framework
- PostgreSQL
- Pillow (Image Processing)
- JWT Authentication
- Docker + Gunicorn

## Frontend
- Next.js (React)
- TypeScript
- REST API integration
- Custom UI Dashboard

## DevOps
- Docker
- Docker Compose

---

#  System Architecture

Frontend communicates with backend via REST APIs.


Frontend (Next.js)
↓
REST API (JWT Auth)
↓
Django Backend (DRF)
↓
PostgreSQL Database
↓
Pillow Image Analysis Service
↓
Media Storage (local / docker volume)


---

#  Backend Logic Overview

##  Image Upload Flow

1. User uploads image
2. Backend receives multipart file
3. `analyze_image()` service runs:
   - Extract filename
   - Calculate size (KB)
   - Get image dimensions
   - Generate label using heuristics
4. Image saved to database
5. Response returned to frontend

---

##  Image Analysis Logic

Uses Pillow-based heuristics:

- Brightness detection
- Aspect ratio analysis
- Color intensity checks

### Generated Labels:
- Bright Landscape  
- Dark Portrait  
- Vibrant Macro  
- Monochrome  
- High Contrast  
- Warm / Cool Tone  

---

##  Analytics System

Backend provides:

- Total image count
- Group by label
- Group by day
- Filter by date range

---

##  Authentication

- JWT authentication system
- Token required for protected endpoints

---

#  API ENDPOINTS

##  Authentication

### Login
```http
POST /auth/login/

Body

{
  "username": "xis",
  "password": "your_password"
}

Response

{
  "access": "jwt_token",
  "refresh": "jwt_refresh_token"
}
 Image APIs
Upload Image
POST /images/upload/
Authorization: Bearer <token>

FormData

image: file

Response

{
  "id": 1,
  "filename": "image.jpg",
  "size": 245.6,
  "label": "Bright Landscape",
  "width": 1920,
  "height": 1080
}
Get Images (Paginated)
GET /images/
Authorization: Bearer <token>
Filter Images
GET /images?label=Landscape
GET /images?date_from=2026-04-01&date_to=2026-04-10
Total Image Count
GET /images/count/
Authorization: Bearer <token>
Group by Label
GET /images/group-by-label/

Response

[
  { "label": "Bright Landscape", "count": 10 },
  { "label": "Dark Portrait", "count": 5 }
]
Group by Day
GET /images/group-by-day/

Response

[
  { "date": "2026-04-29", "count": 3 }
]
 Frontend Logic Overview
 Upload Flow
User selects image
File sent via FormData
Backend returns analysis
UI updates instantly
 Image Dashboard

Displays:

Thumbnail preview
Filename
Size
Label
Dimensions
Timestamp
Analytis Usage

Frontend consumes:

/images/count/
/images/group-by-lAbel/
/images/group-by-day/

Used for:

summary cards
grouped views
analytics dashboard
 State Flow
Upload Image
    ↓
API Call
    ↓
Receive Response
    ↓
Update React State
    ↓
Re-render UI
 Docker Setup
Run backend
docker-compose up --build

Includes:

Django backend
PostgreSQL database
 Key Design Decisions
Django REST Framework for API structure
JWT authentication for security
Pillow for offline image analysis (no external APIs)
Docker for reproducible environment
Modular service-based architecture
 Limitations
Image labeling is heuristic-based (not AI model)
Media stored locally (not cloud storage)
No real-time updates (WebSockets not used)
 Future Improvements
Integrate AI Vision API (Gemini / AWS Rekognition)
Add real-time dashboard updates
Use Cloudinary / S3 for media storage
Add role-based access control
Add WebSocket live analytics
```

# Summary

This project demonstrates:

Full-stack development
REST API design
Authentication system
Image processing pipeline
Dockerized deployment
Analytics system design"# Image-Analytics" 
