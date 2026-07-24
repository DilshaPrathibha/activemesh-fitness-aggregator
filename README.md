# ActiveMesh — Fitness Aggregator Platform

> Australia's premier fitness aggregator platform — find gyms, book classes, manage memberships, and track your fitness journey.

🌐 **Live Demo**: [https://activemesh.vercel.app](https://activemesh.vercel.app)

## Tech Stack

| Layer    | Technology                                                 |
|----------|-------------------------------------------------------------|
| Frontend | React 19, Vite 8, Tailwind CSS v4, React Router v7, Axios  |
| Backend  | Node.js, Express.js (ESM modules)                           |
| Database | MongoDB, Mongoose (with geospatial + TTL indexes)           |
| Auth     | JWT (access 15min + refresh 7d in httpOnly cookie)          |
| Extras   | QR Code generation, html5-qrcode camera scanner, Lucide     |

## Project Structure

```
Activemesh-fitness-platform/
├── client/          # React + Vite frontend (Tailwind v4)
├── server/          # Node + Express backend (ESM)
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # Express routers
│   │   ├── middleware/     # Auth, error handling
│   │   └── utils/         # JWT helpers, email, seed
│   └── server.js          # Entry point
└── docs/            # API docs, DB schema, screenshots
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (or Atlas URI)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/DilshaPrathibha/Activemesh-fitness-platform.git
cd Activemesh-fitness-platform

# 2. Setup server
cd server
cp .env.example .env    # fill in your values (see .env.example)
npm install
npm run dev             # starts on http://localhost:5000

# 3. Setup client (new terminal)
cd ../client
npm install
npm run dev             # starts on http://localhost:5173
```

### Seed the Database

```bash
node server/src/utils/seed.js
```

This creates 5 Australian gyms, 3 membership plans, and demo users:

| Role       | Email                     | Password    |
|------------|---------------------------|-------------|
| Admin      | admin@activemesh.com.au   | Admin@1234  |
| Gym Owner  | owner@activemesh.com.au   | Owner@1234  |
| Member     | member@activemesh.com.au  | Member@1234 |

### Build for Production

```bash
# Windows (PowerShell)
$env:NODE_OPTIONS="--max-old-space-size=4096"; npm run build

# Linux / macOS
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## Implemented Modules

| Module | Feature                          | Status    |
|--------|----------------------------------|-----------| 
| 1      | JWT Auth (register/login/reset)  | ✅ Done   |
| 2      | Mongoose data models + seed      | ✅ Done   |
| 3      | Gym listing, search, filters     | ✅ Done   |
| 4      | Gym detail, QR pass, check-in    | ✅ Done   |
| 5      | One gym per day rule             | ✅ Done   |
| 6      | Membership plans & subscriptions | ✅ Done   |
| 7      | User dashboard & profile         | ✅ Done   |
| 8      | Class booking system             | ✅ Done   |
| 9      | Gym owner dashboard & analytics  | ✅ Done   |
| 10     | Admin dashboard                  | ✅ Done   |

## Key Pages

| URL            | Description                            | Access          |
|----------------|----------------------------------------|-----------------| 
| `/`            | Landing page                           | Public          |
| `/gyms`        | Search & filter gyms                   | Public          |
| `/gyms/:id`    | Gym detail, timetable, QR check-in     | Public / Member |
| `/dashboard`   | Member dashboard (stats, bookings)     | Member+         |
| `/memberships` | Subscribe / upgrade / cancel plan      | Member+         |
| `/bookings`    | My class bookings                      | Member+         |
| `/profile`     | Edit name, phone, avatar               | Member+         |
| `/owner`       | Owner analytics & gym management       | Owner / Admin   |
| `/scan`        | Camera QR scanner for gym check-ins    | Owner / Admin   |
| `/admin`       | Platform stats, user & gym management  | Admin only      |

## Screenshots

### Landing Page
![Landing Page](docs/Screenshots/Screenshot%202026-07-24%20150147.png)

### Gym Search & Listing
![Gym Search](docs/Screenshots/Screenshot%202026-07-24%20150332.png)

### Gym Detail — Class Timetable & Booking
![Gym Timetable](docs/Screenshots/Screenshot%202026-07-24%20150447.png)

### QR Pass (60-second expiry)
![QR Pass Modal](docs/Screenshots/Screenshot%202026-07-24%20150506.png)

### User Dashboard
![User Dashboard](docs/Screenshots/Screenshot%202026-07-24%20150053.png)

### My Bookings
![My Bookings](docs/Screenshots/Screenshot%202026-07-24%20150121.png)

### Membership Plans
![Membership Plans](docs/Screenshots/Screenshot%202026-07-24%20150126.png)

### Gym Owner Dashboard
![Owner Dashboard](docs/Screenshots/Screenshot%202026-07-24%20150311.png)

### Admin Dashboard
![Admin Dashboard](docs/Screenshots/Screenshot%202026-07-24%20150215.png)

## API Documentation

Base URL: `http://localhost:5000/api`

All responses use the envelope format:
```json
{ "success": true, "data": {}, "message": "...", "errors": [] }
```

Protected routes require: `Authorization: Bearer <accessToken>`

### Auth

| Method | Endpoint                    | Auth | Description            |
|--------|-----------------------------|------|------------------------|
| POST   | /auth/register              | No   | Create user account    |
| POST   | /auth/login                 | No   | Login, returns tokens  |
| POST   | /auth/logout                | Yes  | Revoke refresh token   |
| POST   | /auth/refresh               | No   | Refresh access token   |
| GET    | /auth/me                    | Yes  | Get current user       |
| POST   | /auth/forgot-password       | No   | Send reset email       |
| POST   | /auth/reset-password/:token | No   | Reset password         |

### Gyms

| Method | Endpoint          | Auth | Description             |
|--------|-------------------|------|-------------------------|
| GET    | /gyms             | No   | List/search gyms        |
| GET    | /gyms/:id         | No   | Get gym detail          |
| GET    | /gyms/nearby      | No   | Geo search (lat/lng/km) |
| GET    | /gyms/:id/classes | No   | List gym classes        |

### Check-In & QR

| Method | Endpoint       | Auth | Description             |
|--------|----------------|------|-------------------------|
| POST   | /qr/generate   | Yes  | Generate 60s QR pass    |
| POST   | /checkin       | Yes  | Validate QR + check in  |
| GET    | /checkin/today | Yes  | Today's check-in status |

### Membership Plans

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET    | /plans   | No   | List plans  |

### Subscriptions

| Method | Endpoint                     | Auth | Description         |
|--------|------------------------------|------|---------------------|
| GET    | /subscriptions/me            | Yes  | My subscription     |
| POST   | /subscriptions               | Yes  | Subscribe to plan   |
| PUT    | /subscriptions/:id/upgrade   | Yes  | Upgrade plan        |
| PUT    | /subscriptions/:id/downgrade | Yes  | Downgrade plan      |
| PUT    | /subscriptions/:id/cancel    | Yes  | Cancel subscription |

### Bookings

| Method | Endpoint      | Auth | Description         |
|--------|---------------|------|---------------------|
| GET    | /bookings/me  | Yes  | My bookings (paged) |
| POST   | /bookings     | Yes  | Book a class        |
| DELETE | /bookings/:id | Yes  | Cancel booking      |

### User

| Method | Endpoint                    | Auth | Description           |
|--------|-----------------------------|------|-----------------------|
| GET    | /users/me/dashboard         | Yes  | Dashboard aggregation |
| PUT    | /users/me/profile           | Yes  | Update profile        |
| POST   | /users/me/favourites/:gymId | Yes  | Add favourite gym     |
| DELETE | /users/me/favourites/:gymId | Yes  | Remove favourite gym  |

### Owner (`gym_owner` or `admin`)

| Method | Endpoint                  | Auth | Description        |
|--------|---------------------------|------|--------------------|
| GET    | /owner/gyms               | Yes  | My gyms            |
| PUT    | /owner/gyms/:id           | Yes  | Update gym details |
| POST   | /owner/gyms/:id/classes   | Yes  | Add class to gym   |
| GET    | /owner/analytics/:gymId   | Yes  | Gym analytics data |

### Admin (`admin` role only)

| Method | Endpoint                        | Auth | Description               |
|--------|---------------------------------|------|---------------------------|
| GET    | /admin/stats                    | Yes  | Platform-wide stats       |
| GET    | /admin/users                    | Yes  | All users (paged, search) |
| GET    | /admin/gyms                     | Yes  | All gyms (paged, filter)  |
| PATCH  | /admin/gyms/:id/approve         | Yes  | Approve (verify) a gym    |
| PATCH  | /admin/users/:id/deactivate     | Yes  | Deactivate a user         |
| PATCH  | /admin/users/:id/activate       | Yes  | Reactivate a user         |

## Database Schema

7 MongoDB collections:

### users
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "passwordHash": "string (select:false)",
  "role": "user | gym_owner | admin",
  "avatar": "string | null",
  "phone": "string | null",
  "favouriteGyms": ["ObjectId (ref: Gym)"],
  "isActive": "boolean",
  "createdAt": "Date"
}
```

### gyms
```json
{
  "_id": "ObjectId",
  "name": "string",
  "address": "string",
  "city": "string",
  "state": "string (AU)",
  "location": { "type": "Point", "coordinates": [lng, lat] },
  "facilities": ["string"],
  "gallery": ["string (URL)"],
  "openingHours": { "mon": "...", ... },
  "owner": "ObjectId (ref: User)",
  "rating": "number",
  "isVerified": "boolean",
  "isActive": "boolean"
}
```

### classes
```json
{
  "_id": "ObjectId",
  "gym": "ObjectId (ref: Gym)",
  "name": "string",
  "instructor": "string",
  "schedule": { "dayOfWeek": "number", "startTime": "string", "duration": "number" },
  "capacity": "number",
  "enrolled": ["ObjectId (ref: User)"]
}
```

### bookings
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User)",
  "class": "ObjectId (ref: Class)",
  "gym": "ObjectId (ref: Gym)",
  "date": "Date",
  "status": "confirmed | cancelled"
}
```
Unique index: `{ user, class, date }` — prevents double-booking.

### membershipplans
```json
{
  "_id": "ObjectId",
  "name": "string",
  "price": "number",
  "duration": "number (days)",
  "gymAccess": "single | network",
  "features": ["string"]
}
```

### subscriptions
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User)",
  "plan": "ObjectId (ref: MembershipPlan)",
  "status": "active | cancelled | expired",
  "startDate": "Date",
  "renewalDate": "Date",
  "paymentHistory": [{ "amount": "number", "date": "Date", "method": "string" }]
}
```

### checkins
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User)",
  "gym": "ObjectId (ref: Gym)",
  "date": "Date (UTC, no time)",
  "qrToken": "string",
  "validatedAt": "Date"
}
```
Compound index: `{ user, date }` — enforces one-gym-per-day rule.

### qrpasses
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User)",
  "gym": "ObjectId (ref: Gym)",
  "token": "string (signed JWT)",
  "expiresAt": "Date (60s TTL)",
  "used": "boolean"
}
```
TTL index on `expiresAt` — auto-deletes expired passes.

### Indexes Summary

| Collection  | Index                | Type     | Purpose                   |
|-------------|----------------------|----------|---------------------------|
| users       | email                | Unique   | Fast login lookup         |
| gyms        | location             | 2dsphere | Geo queries               |
| gyms        | name, description    | Text     | Full-text search          |
| checkins    | (user, date)         | Compound | One-gym-per-day check     |
| bookings    | (user, class, date)  | Unique   | Prevent double booking    |
| qrpasses    | expiresAt            | TTL      | Auto-expire QR passes     |

## GitFlow

- `main` — production-ready releases
- `development` — integration branch
- `feature/*` — one branch per phase, merged `--no-ff` into development

## License

MIT