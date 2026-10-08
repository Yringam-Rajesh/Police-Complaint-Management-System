# Multilingual Police Complaint Management & Assistance System

A production-style full-stack MVP built with React, Node.js, Express, MongoDB, JWT and Tailwind CSS.

> This project uses a generic police-inspired emblem for educational/demo purposes. It is not an official government application.

## Features

- Citizen registration and login
- Police officer and admin login
- JWT authentication
- Role-based access control
- Complaint creation and tracking
- Officer assignment with active workload limit
- Investigation notes
- Complaint status history / audit trail
- Admin dashboard and analytics
- Multilingual complaint fields
- Evidence metadata support
- Responsive Tailwind UI

## Stack

Frontend:
- React
- Vite
- Tailwind CSS
- React Router
- Axios

Backend:
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- express-validator
- helmet
- cors
- express-rate-limit

## Run locally

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Set `MONGO_URI` and `JWT_SECRET` in `.env`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on the Vite development URL.

## Demo admin

The backend creates an admin automatically on first startup if these variables are present:

```env
ADMIN_ID=ADMIN001
ADMIN_PASSWORD=Admin@12345
ADMIN_SECRET_CODE=POLICE-DEMO-2026
```

Change these values before any real deployment.

## Important

This is an educational portfolio MVP. A real government/public-safety deployment would require formal security review, privacy/legal review, authorized identity verification, secure infrastructure, accessibility compliance, audit controls, incident response, and approved government integrations.

## Features added in the extended MVP
- Admin login success popup and police-officer appointment confirmation popup.
- Citizen login welcome popup and complaint submission confirmation with generated complaint ID and details.
- Password visibility controls on login fields.
- Citizen complaint details page with assigned officer name, department/branch, mobile, email, status and history.
- Optional image/video evidence uploads for complaints; assigned police officers can view the evidence.
- Citizen additional-information workflow when police set a complaint to `NEED_MORE_INFORMATION`.
- English, Telugu and Hindi dashboard UI language switching.
- Browser speech-to-text for English, Telugu and Hindi complaint descriptions.
- Automatic Telugu/Hindi-to-English translation on complaint submission using MyMemory's public translation endpoint; if translation is unavailable, the original text is retained.

### Evidence storage note
Evidence is stored in the backend `uploads/` directory for local development and is ignored by Git. For production, replace local disk storage with a secure object-storage provider and add authentication/authorization checks around signed file URLs.
