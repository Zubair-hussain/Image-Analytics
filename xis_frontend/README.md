# XIS Image Analytics Platform - Frontend

## Overview
This is the **Next.js (React) frontend** for the XIS Image Analytics Platform.  
It provides a modern dashboard to upload images, view analytics, and interact with backend APIs that automatically analyze images.

The frontend is designed as a **real-time analytics dashboard** with a premium UI and smooth UX for image ingestion and visualization.

---

## Tech Stack
- Next.js (App Router / React 18)
- TypeScript
- Tailwind / Custom CSS (Glass UI)
- REST API integration
- Client-side state management (React hooks)

---

## Features

### 1. Image Upload System
- Drag & drop / modal-based upload
- Preview before submission
- Sends image as `FormData` to backend
- Displays loading state during upload

### 2. Auto Image Analysis Display
After upload, backend returns:
- filename
- size (KB)
- label (auto-generated category)
- width / height
- timestamp

Frontend automatically renders this data in dashboard.

---

### 3. Dashboard Analytics UI
Displays:
- Total image count
- Images grouped by label
- Images grouped by date
- Image table with thumbnails (if enabled)

---

### 4. Image Table View
Each record shows:
- Image thumbnail (optional enhancement)
- Filename
- Label
- Size
- Upload timestamp

Supports:
- Pagination (if enabled)
- Filter by label
- Filter by date range

---

### 5. API Integration Layer

Located in:

/lib/api.ts


Handles:

#### Upload Image
```ts
api.upload(file: File)
Fetch Images
api.getImages()
Group by Label
api.groupByLabel()
Group by Day
api.groupByDay()
Auth Login
api.login(username, password)

```

```

Stores JWT token in:

localStorage / cookies
Authentication Flow
User logs in via /auth/login
Backend returns JWT token
Token is stored in frontend
All API requests include:
Authorization: Bearer <token>
Protected pages redirect if token is missing
UI Flow
Upload Flow
Click Add Image
→ Select image
→ Preview displayed
→ Upload triggered
→ Backend analyzes image
→ Response returned
→ Dashboard refresh
Dashboard Flow
Page Load
→ Fetch images
→ Fetch analytics
→ Render table + charts
→ User filters data
Environment Variables

```
```

Create .env.local:

NEXT_PUBLIC_API_URL=http://localhost:8000
Folder Structure
/components
   AddImageModal.tsx
   ImageTable.tsx
   Dashboard.tsx

/lib
   api.ts

/app
   page.tsx
   layout.tsx
Key Design Decisions
```
---

1. Client-side upload handling

Used FormData instead of JSON to support image files.

2. Backend-driven analytics

No heavy processing in frontend — all image analysis done in backend.

3. Stateless UI

Frontend does not store raw images permanently — only renders API response.

4. Modular API layer

## All backend communication centralized in /lib/api.ts.

Error Handling

Handled cases:

```
Upload failure
Unauthorized access (401)
Empty fields validation
Network errors
Improvements (Future Scope)
Image preview caching
Infinite scroll for large datasets
Chart visualization (Recharts)
Real-time updates (WebSockets / polling)
Better auth persistence (refresh token system)
Notes for Evaluators

```


This frontend is built to demonstrate:

* Clean API integration
* Real-world dashboard architecture
* Separation of concerns
* Production-ready UI flow
* Scalable component design
