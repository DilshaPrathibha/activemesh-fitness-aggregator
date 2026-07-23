# ActiveMesh — Progress Tracker

## Current Branch
`main` (v1.0.0 — ALL PHASES COMPLETE ✅)

## Last Completed Phase
Phase 10 — Polish & Bonus ✅

## Phase Status

| Phase | Branch                       | Status       | Description                          |
|-------|------------------------------|--------------|--------------------------------------|
| 0     | feature/project-setup        | ✅ Merged     | Monorepo scaffold, tooling, layouts  |
| 1     | feature/auth                 | ✅ Merged     | JWT auth, all auth pages             |
| 2     | feature/data-models          | ✅ Merged     | All Mongoose schemas + seed          |
| 3     | feature/gym-listing          | ✅ Merged     | Search, filters, gym cards           |
| 4     | feature/gym-detail           | ✅ Merged     | Gallery, map, QR, check-in           |
| 5     | feature/memberships          | ✅ Merged     | Subscribe, upgrade, cancel           |
| 6     | feature/user-dashboard       | ✅ Merged     | Stats, visits, favourites            |
| 7     | feature/booking-system       | ✅ Merged     | Book/cancel classes                  |
| 8     | feature/owner-dashboard      | ✅ Merged     | Analytics, gym management            |
| 9     | feature/admin-dashboard      | ✅ Merged     | Users, gyms, platform analytics      |
| 10    | feature/polish-and-bonus     | ✅ Merged     | Mobile nav, QR scanner, docs, README |

---

## Key Config

- **Client**: `http://localhost:5173` → run: `cd client && npm run dev`
- **Server**: `http://localhost:5000` → run: `cd server && npm run dev`
- **MongoDB URI**: `mongodb://localhost:27017/activemesh` (in `server/.env`)
- **Seed DB**: `node server/src/utils/seed.js` (creates admin/owner/member accounts + 5 gyms)
- **JWT secrets**: `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `QR_SECRET` in `server/.env`
- **CLIENT_URL**: `http://localhost:5173` in `server/.env` (used for password reset email link)
- **Build**: always use `$env:NODE_OPTIONS="--max-old-space-size=4096"; npm run build` to avoid OOM

## Architecture Notes

- Monorepo: `client/` (Vite + React 19 + Tailwind v4) + `server/` (Express + Mongoose ESM)
- API proxy: Vite proxies `/api` → `localhost:5000` (no CORS issues in dev)
- Auth: Access token (15min) in-memory via axios header; Refresh token (7d) in httpOnly cookie
- Response envelope: `{ success, data, message, errors }`
- ESM modules (`"type": "module"`) on the server — use `import`, never `require`
- Lucide-react: verify icon names before use (some names differ from docs)
- CSS classes used: `card`, `input`, `label`, `btn-primary`, `btn-secondary`, `btn-danger`, `badge`, `skeleton` (defined in `client/src/index.css`)

---

## GitFlow Rules

- `main` — production only (never commit directly)
- `development` — integration branch
- `feature/*` — implement here, then `--no-ff` merge into development

## Seed Login Credentials

| Role       | Email                         | Password     |
|------------|-------------------------------|--------------|
| Admin      | admin@activemesh.com.au       | Admin@1234   |
| Gym Owner  | owner@activemesh.com.au       | Owner@1234   |
| Member     | member@activemesh.com.au      | Member@1234  |

---

## Completed Phases Detail

### Phase 0 — Project Setup
- ✅ Git branches: `main`, `development`, `feature/project-setup`
- ✅ Client: Vite + React 19 + Tailwind CSS v4 + React Router v7 + Axios + react-hot-toast
- ✅ Server: Express + Mongoose + JWT + bcryptjs + dotenv + cors + helmet + cookie-parser + express-rate-limit
- ✅ Design system: CSS variables, dark mode via ThemeContext, reusable component classes
- ✅ App router with full route structure (all 10 modules registered)
- ✅ AuthContext (`login`, `register`, `logout`, `user`), ThemeContext
- ✅ ProtectedRoute (redirects to /login if no token), PublicRoute (redirects to /dashboard if logged in)
- ✅ Axios instance with silent token refresh on 401 (`client/src/api/axios.js`)
- ✅ Navbar (responsive, dark mode toggle, role-aware links), Footer
- ✅ HomePage (hero, stats counter, features section, CTA)
- ✅ Error middleware (Mongoose + JWT + validation error handling)
- ✅ JWT auth middleware + role-based `authorize()` middleware
- ✅ User model (bcrypt, roles: user/gym_owner/admin, refresh/reset tokens)
- ✅ All route stubs (server starts cleanly on `npm run dev`)
- ✅ .gitignore, README.md, .env.example (client + server)

### Phase 1 — Authentication
- ✅ `server/src/utils/jwt.js` — generateAccessToken, generateRefreshToken, generateQRToken, cookie helpers
- ✅ `server/src/utils/email.js` — Nodemailer HTML password reset email
- ✅ `server/src/controllers/authController.js` — register, login, logout, refresh, getMe, forgotPassword, resetPassword
- ✅ `server/src/middleware/validateRequest.js` — express-validator error envelope middleware
- ✅ `server/src/routes/authRoutes.js` — rate limited, validated endpoints
- ✅ `client/src/pages/auth/LoginPage.jsx` — email/password, show/hide, forgot link
- ✅ `client/src/pages/auth/RegisterPage.jsx` — name, email, role selector, confirm password
- ✅ `client/src/pages/auth/ForgotPasswordPage.jsx` — email enumeration safe, success state
- ✅ `client/src/pages/auth/ResetPasswordPage.jsx` — token from URL params

### Phase 2 — Data Models
- ✅ `server/src/models/Gym.js` — 2dsphere geospatial index, full-text index, AU state enum
- ✅ `server/src/models/Class.js` — capacity/enrolled, virtual availableSlots
- ✅ `server/src/models/MembershipPlan.js` — slug, price, duration, single/network access
- ✅ `server/src/models/Subscription.js` — payment history, compound index
- ✅ `server/src/models/CheckIn.js` — (user, date) compound index for one-gym-per-day
- ✅ `server/src/models/QRPass.js` — MongoDB TTL index (auto-expire after 60s)
- ✅ `server/src/models/Booking.js` — unique (user, class, date) prevents double-booking
- ✅ `server/src/utils/seed.js` — 5 AU gyms, 3 users, 3 plans, 30 classes

### Phase 3 — Gym Listing
- ✅ `server/src/controllers/gymController.js` — text search, city/state/rating/facilities filter, pagination, nearby (geospatial)
- ✅ `server/src/routes/gymRoutes.js` — GET /, GET /nearby, GET /:id, GET /:id/classes
- ✅ `client/src/pages/gyms/GymSearchPage.jsx` — debounced search, filter panel, pagination
- ✅ `client/src/components/gyms/GymCard.jsx` — image with hover zoom, rating, facility chips, verified badge
- ✅ `client/src/components/gyms/GymCardSkeleton.jsx` — loading skeleton

### Phase 4 — Gym Detail + QR + Check-in
- ✅ `server/src/controllers/qrController.js` — generate 60s JWT QR pass, stored in DB, validateQRToken helper
- ✅ `server/src/controllers/checkInController.js` — one-gym-per-day rule, same gym re-entry allowed
- ✅ `server/src/controllers/classController.js` — gym classes with availableSlots
- ✅ `server/src/routes/qrRoutes.js` — POST /generate (protected)
- ✅ `server/src/routes/checkInRoutes.js` — GET /today, POST / (both protected)
- ✅ `client/src/pages/gyms/GymDetailPage.jsx` — tabbed layout (Overview/Timetable/Gallery/Location), gallery carousel, QR button, favourites
- ✅ `client/src/components/gyms/QRPassModal.jsx` — real QR code image, circular SVG countdown, expire/refresh state

### Phase 5 — Memberships
- ✅ `server/src/controllers/subscriptionController.js` — getPlans, getMySubscription, subscribe (cancels existing), upgrade, downgrade, cancel
- ✅ `server/src/routes/planRoutes.js` — GET / (public)
- ✅ `server/src/routes/subscriptionRoutes.js` — CRUD (all protected)
- ✅ `client/src/pages/memberships/MembershipPlansPage.jsx` — gradient plan cards, current subscription banner, subscribe/switch/cancel

### Phase 6 — User Dashboard
- ✅ `server/src/controllers/userController.js` — dashboard aggregation (subscription, check-ins, bookings, favourites, stats)
- ✅ `server/src/routes/userRoutes.js` — /me/dashboard, /me/profile, /me/favourites/:gymId (all protected)
- ✅ `client/src/pages/dashboard/UserDashboardPage.jsx` — stat cards, membership card, recent check-ins, upcoming classes, saved gyms
- ✅ `client/src/pages/profile/ProfilePage.jsx` — name/phone/avatar update

### Phase 7 — Booking System
- ✅ `server/src/controllers/bookingController.js` — create (capacity check + unique index guard), cancel (removes from enrolled), list with pagination
- ✅ `server/src/routes/bookingRoutes.js` — GET /me, POST /, DELETE /:id (all protected)
- ✅ `client/src/pages/bookings/MyBookingsPage.jsx` — status filter tabs, date calendar blocks, category badges, cancel with confirmation

### Phase 8 — Owner Dashboard
- ✅ `server/src/controllers/ownerController.js` — getOwnerGyms, updateGym, addGymClass, getGymAnalytics (MongoDB aggregation for daily check-ins)
- ✅ `server/src/routes/ownerRoutes.js` — role-guarded (gym_owner or admin)
- ✅ `client/src/pages/owner/OwnerDashboardPage.jsx` — gym selector, stat cards, SVG bar chart, quick action links

### Phase 9 — Admin Dashboard
- ✅ `server/src/controllers/adminController.js` — getPlatformStats, getAllUsers (paginated + search + role filter), getAllGyms (paginated + verified filter), approveGym, deactivateUser, activateUser
- ✅ `server/src/routes/adminRoutes.js` — all protected + authorize('admin')
- ✅ `client/src/pages/admin/AdminDashboardPage.jsx` — tabbed: platform stats (chart + stat cards), user table (search/filter/activate/deactivate), gym table (filter/approve)

### Phase 10 — Polish & Bonus
- ✅ All routes confirmed mounted in `server.js`
- ✅ `client/src/components/navigation/Navbar.jsx` — full mobile nav with all role-aware links (Dashboard, Bookings, Profile, Owner, QR Scanner, Admin, Sign out)
- ✅ `client/src/pages/gyms/QRScannerPage.jsx` — html5-qrcode camera scanner, submit token to check-in API, success/fail states
- ✅ `/scan` route added to `App.jsx` (protected: gym_owner + admin)
- ✅ QR Scanner link in navbar dropdown for owners/admins
- ✅ `docs/api.md` — updated with all 10 phases' endpoints
- ✅ `README.md` — complete setup guide, all modules, credentials, build instructions
- ✅ `development` → `main` final release merge (v1.0.0)
