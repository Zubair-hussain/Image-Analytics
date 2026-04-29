#  XIS Backend - Image Analytics API

This is the **backend service** for the XIS Image Analytics Platform.  
It provides authentication, image upload, automated image analysis, and analytics APIs.

Built with **Django + Django REST Framework + PostgreSQL + Docker**.

---

#  Tech Stack

- Django 5.x
- Django REST Framework
- PostgreSQL
- Pillow (Image Processing)
- SimpleJWT Authentication
- Gunicorn (Production Server)
- Docker

---

#  Backend Architecture


Client (Frontend)
↓
REST API (JWT Auth)
↓
Django Backend (DRF)
↓
Services Layer (Image Analysis)
↓
PostgreSQL Database
↓
Media Storage (uploads/)


---

#  Core Features

##  Image Management
- Upload images via API
- Store metadata (filename, size, label, dimensions)
- Auto-analyze images on upload
- Return structured response

---

##  Image Analysis System

Uses **Pillow-based heuristics**:

- Brightness detection
- Aspect ratio analysis
- Color intensity analysis

### Generated Labels:
- Bright Landscape
- Dark Portrait
- Vibrant Macro
- Monochrome
- High Contrast
- Warm Tone
- Cool Tone

---

##  Analytics APIs

- Total image count
- Group by label
- Group by day
- Filter by date range

---

##  Authentication

- JWT-based authentication
- Secure protected endpoints
- Token required for all image APIs

---

#  API ENDPOINTS

##  Authentication

### Login
```http id="k5t6wq"
POST /auth/login/

Request Body

{
  "username": "xis",
  "password": "your_password"
}

Response

{
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token"
}
```
```
Image APIs
Upload Image
POST /images/upload/
Authorization: Bearer <token>

Form Data

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
 Project Structure
core/
 ├── settings.py
 ├── urls.py
 ├── wsgi.py

images/
 ├── models.py
 ├── views.py
 ├── serializers.py
 ├── services.py
 ├── urls.py
 └── migrations/

manage.py
Dockerfile
docker-compose.yml
requirements.txt
 Docker Setup
Build & Run
docker-compose up --build
Services Included
Django Backend (Gunicorn)
PostgreSQL Database
 Key Design Decisions
Django REST Framework for scalable APIs
JWT authentication for stateless security
Service-based architecture (services.py)
Pillow used for offline image analysis (no external APIs)
Docker used for consistent deployment
Limitations
Image classification is heuristic-based (not AI model)
Media stored locally (not cloud storage)
No real-time WebSocket updates
```

## Future Improvements
Integrate AI Vision API (Gemini / AWS Rekognition)
Add Cloudinary or S3 for media storage
Add real-time analytics dashboard (WebSockets)
Role-based access control (RBAC)
Advanced ML-based image classification

 ## Summary

This backend provides a complete image analytics pipeline including:

* Upload system
* Automated image analysis
* JWT authentication
* Analytics APIs
* Dockerized deployment
* Scalable architecture
