# 🩸 Community Blood Donation Campaign Management System

A full-stack production-ready **MERN** web platform designed to streamline community blood donation drives, connect eligible donors with local healthcare initiatives, regulate campaign capacity in real time, and digitally certify verified donation records.

---

## 🏛️ Architectural Overview

This system follows a clean **Separation of Concerns (SoC)** layered architecture:

```
[ React 18+ Client (Vite) ]
          │  Axios (JWT Bearer Auth)
          ▼
   [ Express Router ] ──────► [ Helmet & Rate Limiter ]
          │
   [ Auth & Role Guards ]
          │
   [ Express-Validator Rules ]
          │
     [ Controllers ] ────────► HTTP Requests / Response Envelopes
          │
    [ Service Layer ] ───────► Business Rules (Capacity, Duplicate Guards)
          │
   [ Mongoose Models ] ──────► Schemas, Compound Indexes, Hooks
          │
  [ MongoDB Database ] ──────► Aggregation Pipelines ($group, $match)
```

---

## 🚀 Key Features

### 1. 👥 Role-Based Access Control (RBAC)
- **Public / Guests**: Browse active drives, filter by compatible blood groups (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`), search by city or venue, view requirements.
- **Donors**:
  - Secure registration & login with password hashing (`bcryptjs`) and stateless `JWT`.
  - Book donation slots with capacity enforcement.
  - Guard against duplicate registration for the same campaign (backed by a MongoDB compound unique index `{ donor: 1, campaign: 1 }`).
  - View personal appointment status (`PENDING`, `APPROVED`, `COMPLETED`, `CANCELLED`).
  - Access verified donation history with quantity (ml) and medical stamps.
- **Admins**:
  - Live administrative dashboard powered by **MongoDB aggregation pipelines** (`bloodGroupDistribution`, campaign status counts, units collected).
  - Campaign CRUD operations (schedule, update times, edit venues, cancel).
  - Review donor registrations (Approve / Reject).
  - Digital verification of completed donations (automatically updates donor profile with lifetime donation counts and latest donation date).
  - Manage the donor community registry and account activation statuses.

---

## 🛠️ Technology Stack

### Frontend
- **React 18+** with **Vite**
- **Tailwind CSS v4** for responsive, mobile-first healthcare aesthetics
- **React Router v6/v7** for nested routes and protected role-based guards
- **Axios** with centralized request/response interceptors
- **Lucide React** for clean medical and administrative iconography

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose ODM**
- **Authentication**: `jsonwebtoken` (JWT) & `bcryptjs`
- **Security**: `helmet`, `cors`, `express-rate-limit`
- **Validation**: `express-validator`

---

## 📂 Project Directory Structure

```
blood-donation/
│
├── client/                      # Vite + React Frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── campaign/        # CampaignCard
│   │   │   └── layout/          # Navbar, Footer
│   │   ├── context/             # AuthContext (JWT session state)
│   │   ├── layouts/             # PublicLayout
│   │   ├── pages/
│   │   │   ├── admin/           # AdminDashboard, Campaigns, Registrations, Donors
│   │   │   ├── auth/            # LoginPage, RegisterPage
│   │   │   ├── donor/           # DonorDashboard, Profile, DonationHistory
│   │   │   └── public/          # HomePage, CampaignListPage, CampaignDetailPage, AboutPage
│   │   ├── routes/              # AppRoutes, ProtectedRoute (RBAC)
│   │   ├── services/            # Axios API clients (auth, campaigns, registrations, etc.)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── vite.config.js
│
├── server/                      # Node.js + Express REST API
│   ├── src/
│   │   ├── config/              # database.js, env.js
│   │   ├── controllers/         # auth, user, campaign, registration, donation, dashboard
│   │   ├── middleware/          # auth, role, validation, rateLimit, error
│   │   ├── models/              # User, Campaign, Registration, Donation
│   │   ├── routes/              # auth, user, campaign, registration, donation, dashboard
│   │   ├── seed/                # seed.js (Full demo data initializer)
│   │   ├── services/            # Pure business logic and DB operations
│   │   ├── utils/               # ApiError, asyncHandler, jwt, pagination
│   │   ├── validators/          # Input schema validations
│   │   ├── app.js               # Express application configuration
│   │   └── server.js            # Database connection & HTTP listener
│   ├── .env.example
│   └── package.json
│
├── docs/
│   └── PRD_and_SRD.md           # Product and System Requirements Document
├── package.json
└── README.md
```

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js** (v18 or LTS recommended)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI

### 2. Backend Configuration
Navigate to the `server/` directory:
```bash
cd server
npm install
```

Create a `.env` file (or copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/blood_donation_db
JWT_SECRET=super_secret_jwt_key_community_blood_donation_2026_dev_only
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Seed Demo Data
To populate demo administrator, donors, campaigns, registrations, and verified donation records:
```bash
npm run seed
```

#### Demo Credentials:
- **Administrator**:
  - Email: `admin@example.com`
  - Password: `AdminPassword123!`
- **Donor**:
  - Email: `rahul@example.com`
  - Password: `DonorPassword123!`

### 4. Start the Backend Server
```bash
npm run dev
# Server will listen on http://localhost:5000
# Health check available at: http://localhost:5000/health
```

### 5. Start the React Frontend
In a new terminal:
```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🛡️ Business Rules Implemented

1. **Unique Campaign Registration**: A donor cannot submit multiple registrations for the same campaign (guaranteed by compound unique index `{ donor: 1, campaign: 1 }`).
2. **Capacity Guarding**: Registrations are rejected if the campaign's `registeredCount >= capacity`.
3. **Status Restraints**: Users cannot register for `CANCELLED` or `COMPLETED` drives.
4. **Privilege Isolation**: Public self-registration assigns the `DONOR` role. Only seeded administrators hold elevated credentials.
5. **Medical Record Integrity**: Once an admin logs a donation as `COMPLETED`, the donor's `donationCount` increments and `lastDonationDate` updates automatically.

---

## 📄 License
ISC License. Built for community welfare and healthcare automation.
