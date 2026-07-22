# ActiveMesh — Progress Tracker

## Current Branch
`feature/project-setup`

## Last Completed Phase
Phase 0 — Project Setup (in progress)

## Phase Status

| Phase | Branch                       | Status     | Description                          |
|-------|------------------------------|------------|--------------------------------------|
| 0     | feature/project-setup        | 🔄 Active   | Monorepo scaffold, tooling, layouts  |
| 1     | feature/auth                 | ⏳ Pending  | JWT auth, all auth pages             |
| 2     | feature/data-models          | ⏳ Pending  | All Mongoose schemas + seed          |
| 3     | feature/gym-listing          | ⏳ Pending  | Search, filters, gym cards           |
| 4     | feature/gym-detail           | ⏳ Pending  | Gallery, map, QR, check-in           |
| 5     | feature/memberships          | ⏳ Pending  | Subscribe, upgrade, cancel           |
| 6     | feature/user-dashboard       | ⏳ Pending  | Stats, visits, favourites            |
| 7     | feature/booking-system       | ⏳ Pending  | Book/cancel classes                  |
| 8     | feature/owner-dashboard      | ⏳ Pending  | Analytics, gym management            |
| 9     | feature/admin-dashboard      | ⏳ Pending  | Users, gyms, platform analytics      |
| 10    | feature/polish-and-bonus     | ⏳ Pending  | Dark mode, QR scanner, Docker, docs  |

## Next Step
Commit Phase 0, then start `feature/auth` (Phase 1)

## Key Config
- **Client**: `http://localhost:5173` (`cd client && npm run dev`)
- **Server**: `http://localhost:5000` (`cd server && npm run dev`)
- **MongoDB URI**: `mongodb://localhost:27017/activemesh` (set in `server/.env`)
- **JWT secrets**: `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `QR_SECRET` in `server/.env`

## Architecture Notes
- Monorepo: `client/` (Vite + React + Tailwind) + `server/` (Express + Mongoose)
- API proxy: Vite proxies `/api` → `localhost:5000` (no CORS issues in dev)
- Auth: Access token (15min) in-memory via axios header; Refresh token (7d) in httpOnly cookie
- Response envelope: `{ success, data, message, errors }`
- ESM modules (`"type": "module"`) on the server

## Completed Phases Detail

### Phase 0 — Project Setup
- ✅ Git branches: `main`, `development`, `feature/project-setup`
- ✅ Client: Vite + React 18 + Tailwind CSS v4 + React Router v6 + Axios
- ✅ Server: Express + Mongoose + JWT + bcryptjs + dotenv + cors + helmet
- ✅ Design system: CSS variables, dark mode, reusable component classes
- ✅ App router with full route structure (all 10 modules registered as stubs)
- ✅ AuthContext, ThemeContext, ProtectedRoute, PublicRoute
- ✅ Axios instance with silent token refresh on 401
- ✅ Navbar (responsive, dark mode, role-aware), Footer
- ✅ HomePage (full hero, stats, features, CTA)
- ✅ Error middleware (Mongoose + JWT error handling)
- ✅ JWT auth middleware + role-based authorize
- ✅ User model (bcrypt, roles, refresh/reset tokens)
- ✅ All route stubs (server starts cleanly)
- ✅ .gitignore, README.md, .env.example
