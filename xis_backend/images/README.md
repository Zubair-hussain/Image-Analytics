# Images App (XIS Backend)

## Overview
The `images/` app is the **core business logic module** of the XIS Image Analytics Platform.

It handles:
- Image upload processing
- Image metadata storage
- Image analysis (custom vision logic)
- API endpoints for frontend consumption
- Analytics aggregation (daily + label-based stats)

This module transforms raw image uploads into structured, analyzable data.

---

## Folder Structure


images/
│── migrations/
│── models.py
│── serializers.py
│── services.py
│── views.py
│── urls.py
│── init.py


---

## Core Responsibilities

### 1. Data Model (`models.py`)
Defines the Image database schema:

- filename → original file name
- size → file size in KB
- label → AI-generated category
- timestamp → upload time
- width / height → image dimensions
- image → uploaded media file

Supports:
- Indexing on `label` and `timestamp`
- Default ordering by latest uploads

---

### 2. API Serialization (`serializers.py`)
Handles API data formatting.

Includes:
- `ImageSerializer` → full image metadata response
- `ImageUploadSerializer` → upload validation layer
- Safe image URL generation for frontend access
- File type validation (JPG, PNG, WebP, GIF)

Ensures:
- Clean API responses
- Secure upload handling
- Media URL resolution

---

### 3. Image Analysis Engine (`services.py`)
This is the **intelligence layer of the system**.

It processes uploaded images using Pillow:

### Extracted Features:
- File size (KB)
- Width & Height
- Aspect ratio
- Orientation (portrait / landscape / square)
- Brightness
- Contrast
- Saturation
- Dominant RGB color

### Label Generation System:
Rule-based classification:
- Bright Scene
- Dark Scene
- Monochrome
- Vibrant
- Warm Tones
- Cool Tones
- High-Contrast
- Nature / Green
- Balanced

👉 This acts as a **lightweight AI vision system without external APIs**

---

### 4. API Layer (`views.py`)
Exposes REST endpoints for frontend integration.

#### Core Endpoints:

### Upload Image

POST /images/upload/

- Accepts image file
- Runs analysis engine
- Stores processed metadata

---

### List Images

GET /images/

Supports:
- Pagination
- Label filtering
- Date range filtering

---

### Analytics

#### Total Images

GET /images/count/


#### Group by Label

GET /images/group-by-label/


#### Group by Day

GET /images/group-by-day/


---

## Data Flow Architecture


Frontend Upload
↓
Image Upload API (views.py)
↓
Validation (serializers.py)
↓
Image Analysis Engine (services.py)
↓
Database Storage (models.py)
↓
Analytics APIs (views.py)
↓
Frontend Dashboard


---

## Key Design Decisions

### 1. No External AI APIs
- Uses Pillow-based analysis instead of cloud AI
- Reduces cost and improves portability
- Fully offline compatible

---

### 2. Separation of Concerns
- models → data structure
- serializers → API formatting
- services → business logic (image analysis)
- views → API endpoints

---

### 3. Performance Optimization
- Image downsampling (100x100) for faster processing
- Database indexing on label & timestamp
- Pagination for large datasets

---

### 4. Analytics Ready Design
Data is structured for:
- dashboards
- charts
- time-series analysis
- category distribution

---

## Summary

The `images/` app is the **core intelligence layer** of the system.

It converts raw image uploads into:
- structured metadata
- classified labels
- analytics-ready datasets

This enables the frontend to function as a **real-time image intelligence dashboard**.
