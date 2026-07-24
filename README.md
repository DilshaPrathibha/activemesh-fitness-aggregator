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
![Gym Search](docs/Screenshots/Screenshot%202026-07-24%20150412.png)

### Gym Detail — Overview
![Gym Detail Overview](docs/Screenshots/Screenshot%202026-07-24%20150429.png)

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

See [docs/api.md](docs/api.md) for all endpoints.

## Database Schema

See [docs/schema.md](docs/schema.md) for all Mongoose schemas and indexes.

## GitFlow

- `main` — production-ready releases
- `development` — integration branch
- `feature/*` — one branch per phase, merged `--no-ff` into development

## License

MIT