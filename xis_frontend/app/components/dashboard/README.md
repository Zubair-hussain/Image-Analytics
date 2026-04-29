# XIS Frontend – Dashboard Components

## Overview
This folder contains the **core dashboard UI components** used in the XIS Image Analytics platform.

These components are responsible for:
- Data visualization
- User interaction
- Analytics presentation
- Image management UI

Each component is designed to be **reusable, isolated, and prop-driven**.

---

## Components Breakdown

## 1. StatsCard.tsx

### Purpose
Displays key performance indicators (KPIs) in a compact card format.

### Features
- Total images count
- Classifications count
- Observation days
- Live upload delta
- Icon support
- Accent color themes
- Entry animation delays

### Role in System
Acts as the **summary layer of analytics**, giving instant system insights.

---

## 2. ImagesPerDayChart.tsx

### Purpose
Visualizes **daily image upload trends**.

### Features
- Bar chart visualization (Recharts)
- Tooltip with formatted values
- Highlight for peak activity day
- Responsive container support

### Role in System
Helps analyze **time-based activity patterns**.

---

## 3. ImagesPerLabelChart.tsx

### Purpose
Displays **distribution of images by label/category**.

### Features
- Pie chart visualization
- Color-coded segments
- Custom legend
- Interactive tooltip
- Label-based breakdown

### Role in System
Shows **classification distribution insights**.

---

## 4. ImageTable.tsx

### Purpose
Main data grid for displaying image records.

### Features
- Paginated table system
- Thumbnail preview support
- File metadata display:
  - Filename
  - Size
  - Dimensions
  - Label
  - Timestamp
- Image load fallback handling
- Next/Prev pagination system

### Role in System
Acts as the **data exploration and registry view layer**.

---

## 5. AddImageModal.tsx

### Purpose
Handles **image upload and ingestion workflow**.

### Features
- File upload interface
- Modal UI overlay
- API integration for upload
- Triggers backend image analysis pipeline
- Success callback refresh

### Role in System
Acts as the **data entry point into the analytics pipeline**.

---

## Component Interaction Flow


Dashboard Page
↓
Fetch API Data
↓
Props passed to Components
↓
┌──────────────────────────────┐
│ StatsCard │
│ ImagesPerDayChart │
│ ImagesPerLabelChart │
│ ImageTable │
│ AddImageModal │
└──────────────────────────────┘
↓
User Interaction (upload, paginate)
↓
API calls → Backend → DB → Updated UI


---

## Design Principles

- Modular component isolation
- No direct business logic inside UI
- Reusable visualization components
- Clean separation of concerns
- Real-time responsive updates
- Consistent glassmorphism UI system

---

## Summary

This folder represents the **visual and interactive core of the XIS dashboard**, transforming backend analyt
