# ActiveMesh — Fitness Aggregator Platform

> Australia's premier fitness aggregator platform — find gyms, book classes, track your fitness journey.

## Tech Stack

| Layer    | Technology                                    |
|----------|-----------------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend  | Node.js, Express.js                           |
| Database | MongoDB, Mongoose                             |
| Auth     | JWT (access + refresh token), bcryptjs        |
| Extras   | QR Code, Google Maps, Recharts, Docker        |

## Project Structure

```
Activemesh-fitness-platform/
├── client/          # React + Vite frontend
├── server/          # Node + Express backend
├── docs/            # API docs, DB schema, screenshots
└── PROGRESS.md      # Phase tracker
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/DilshaPrathibha/Activemesh-fitness-platform.git
cd Activemesh-fitness-platform

# 2. Setup server
cd server
cp .env.example .env    # fill in your values
npm install
npm run dev

# 3. Setup client (new terminal)
cd client
npm install
npm run dev
```

Client: http://localhost:5173  
API: http://localhost:5000

## Modules

| Module | Feature                        | Status  |
|--------|-------------------------------|---------|
| 1      | User Authentication            | ⏳ Phase 1 |
| 2      | Gym Listing & Search           | ⏳ Phase 3 |
| 3      | Gym Detail                     | ⏳ Phase 4 |
| 4      | QR Pass                        | ⏳ Phase 4 |
| 5      | One Gym Per Day Rule           | ⏳ Phase 4 |
| 6      | Membership Plans               | ⏳ Phase 5 |
| 7      | User Dashboard                 | ⏳ Phase 6 |
| 8      | Booking System                 | ⏳ Phase 7 |
| 9      | Gym Owner Dashboard            | ⏳ Phase 8 |
| 10     | Admin Dashboard                | ⏳ Phase 9 |

## API Documentation

See [docs/api.md](docs/api.md)

## Database Schema

See [docs/schema.md](docs/schema.md)

## GitFlow

- `main` — production-ready
- `development` — integration branch
- `feature/*` — one branch per phase

## License

MIT