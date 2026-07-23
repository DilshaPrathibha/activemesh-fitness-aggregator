# ActiveMesh API Documentation

Base URL: `http://localhost:5000/api`

All responses follow the envelope:
```json
{ "success": true, "data": {}, "message": "...", "errors": [] }
```

Authentication: `Authorization: Bearer <accessToken>` header required on protected routes.

---

## Auth

| Method | Endpoint                     | Auth | Description              |
|--------|------------------------------|------|--------------------------|
| POST   | /auth/register               | No   | Create user account      |
| POST   | /auth/login                  | No   | Login, returns tokens    |
| POST   | /auth/logout                 | Yes  | Revoke refresh token     |
| POST   | /auth/refresh                | No   | Refresh access token     |
| GET    | /auth/me                     | Yes  | Get current user         |
| POST   | /auth/forgot-password        | No   | Send reset email         |
| POST   | /auth/reset-password/:token  | No   | Reset password           |

## Gyms

| Method | Endpoint                | Auth | Description              |
|--------|-------------------------|------|--------------------------|
| GET    | /gyms                   | No   | List/search gyms         |
| GET    | /gyms/:id               | No   | Get gym detail           |
| GET    | /gyms/nearby            | No   | Geo search (lat/lng/km)  |
| GET    | /gyms/:id/classes       | No   | List gym classes         |

## Check-In & QR

| Method | Endpoint           | Auth | Description              |
|--------|--------------------|------|--------------------------|
| POST   | /qr/generate       | Yes  | Generate 60s QR pass     |
| POST   | /checkin           | Yes  | Validate QR + check in   |
| GET    | /checkin/today     | Yes  | Today's check-in status  |

## Membership Plans

| Method | Endpoint  | Auth | Description  |
|--------|-----------|------|--------------|
| GET    | /plans    | No   | List plans   |

## Subscriptions

| Method | Endpoint                          | Auth | Description          |
|--------|-----------------------------------|------|----------------------|
| GET    | /subscriptions/me                 | Yes  | My subscription      |
| POST   | /subscriptions                    | Yes  | Subscribe to plan    |
| PUT    | /subscriptions/:id/upgrade        | Yes  | Upgrade plan         |
| PUT    | /subscriptions/:id/downgrade      | Yes  | Downgrade plan       |
| PUT    | /subscriptions/:id/cancel         | Yes  | Cancel subscription  |

## Bookings

| Method | Endpoint           | Auth | Description         |
|--------|--------------------|------|---------------------|
| GET    | /bookings/me       | Yes  | My bookings (paged) |
| POST   | /bookings          | Yes  | Book a class        |
| DELETE | /bookings/:id      | Yes  | Cancel booking      |

## User

| Method | Endpoint                         | Auth | Description          |
|--------|----------------------------------|------|----------------------|
| GET    | /users/me/dashboard              | Yes  | Dashboard aggregation|
| PUT    | /users/me/profile                | Yes  | Update profile       |
| POST   | /users/me/favourites/:gymId      | Yes  | Add favourite gym    |
| DELETE | /users/me/favourites/:gymId      | Yes  | Remove favourite gym |

## Owner (`gym_owner` or `admin` role)

| Method | Endpoint                         | Auth | Description          |
|--------|----------------------------------|------|----------------------|
| GET    | /owner/gyms                      | Yes  | My gyms              |
| PUT    | /owner/gyms/:id                  | Yes  | Update gym details   |
| POST   | /owner/gyms/:id/classes          | Yes  | Add class to gym     |
| GET    | /owner/analytics/:gymId          | Yes  | Gym analytics data   |

## Admin (`admin` role only)

| Method | Endpoint                         | Auth | Description              |
|--------|----------------------------------|------|--------------------------|
| GET    | /admin/stats                     | Yes  | Platform-wide stats      |
| GET    | /admin/users                     | Yes  | All users (paged, search)|
| GET    | /admin/gyms                      | Yes  | All gyms (paged, filter) |
| PATCH  | /admin/gyms/:id/approve          | Yes  | Approve (verify) a gym   |
| PATCH  | /admin/users/:id/deactivate      | Yes  | Deactivate a user        |
| PATCH  | /admin/users/:id/activate        | Yes  | Reactivate a user        |

### Query params for `/admin/users`

| Param    | Type   | Description                             |
|----------|--------|-----------------------------------------|
| `page`   | number | Page number (default 1)                 |
| `limit`  | number | Results per page (max 50, default 20)   |
| `role`   | string | Filter by role: `user`, `gym_owner`     |
| `search` | string | Search name or email (case-insensitive) |

### Query params for `/admin/gyms`

| Param      | Type    | Description                        |
|------------|---------|------------------------------------|
| `page`     | number  | Page number (default 1)            |
| `limit`    | number  | Results per page (max 50)          |
| `verified` | boolean | `true` or `false` to filter        |
