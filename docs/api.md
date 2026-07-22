# ActiveMesh API Documentation

Base URL: `http://localhost:5000/api`

All responses follow the envelope:
```json
{ "success": true, "data": {}, "message": "...", "errors": [] }
```

Authentication: `Authorization: Bearer <accessToken>` header required on protected routes.

---

## Auth

| Method | Endpoint                    | Auth | Description              |
|--------|----------------------------|------|--------------------------|
| POST   | /auth/register             | No   | Create user account      |
| POST   | /auth/login                | No   | Login, returns tokens    |
| POST   | /auth/logout               | Yes  | Revoke refresh token     |
| POST   | /auth/refresh              | No   | Refresh access token     |
| GET    | /auth/me                   | Yes  | Get current user         |
| POST   | /auth/forgot-password      | No   | Send reset email         |
| POST   | /auth/reset-password/:token| No   | Reset password           |

## Gyms

| Method | Endpoint                    | Auth | Description              |
|--------|----------------------------|------|--------------------------|
| GET    | /gyms                      | No   | List/search gyms         |
| GET    | /gyms/:id                  | No   | Get gym detail           |
| GET    | /gyms/nearby               | No   | Geo search               |

## Check-In & QR

| Method | Endpoint                    | Auth | Description              |
|--------|----------------------------|------|--------------------------|
| POST   | /qr/generate               | Yes  | Generate 60s QR pass     |
| POST   | /checkin                   | Yes  | Validate QR + check in   |
| GET    | /checkin/today             | Yes  | Today's check-in         |

## Memberships

| Method | Endpoint                        | Auth | Description          |
|--------|---------------------------------|------|----------------------|
| GET    | /plans                          | No   | List plans           |
| GET    | /subscriptions/me               | Yes  | My subscription      |
| POST   | /subscriptions                  | Yes  | Subscribe            |
| PUT    | /subscriptions/:id/upgrade      | Yes  | Upgrade plan         |
| PUT    | /subscriptions/:id/downgrade    | Yes  | Downgrade plan       |
| PUT    | /subscriptions/:id/cancel       | Yes  | Cancel subscription  |

## Bookings

| Method | Endpoint                    | Auth | Description              |
|--------|----------------------------|------|--------------------------|
| GET    | /gyms/:id/classes          | Yes  | List gym classes         |
| POST   | /bookings                  | Yes  | Book a class             |
| DELETE | /bookings/:id              | Yes  | Cancel booking           |
| GET    | /bookings/me               | Yes  | My bookings              |

## User

| Method | Endpoint                        | Auth | Description          |
|--------|---------------------------------|------|----------------------|
| GET    | /users/me/dashboard             | Yes  | Dashboard data       |
| POST   | /users/me/favourites/:gymId     | Yes  | Add favourite gym    |
| DELETE | /users/me/favourites/:gymId     | Yes  | Remove favourite gym |

## Owner (gym_owner role)

| Method | Endpoint                        | Auth | Description          |
|--------|---------------------------------|------|----------------------|
| GET    | /owner/gyms                     | Yes  | My gyms              |
| PUT    | /owner/gyms/:id                 | Yes  | Update gym           |
| POST   | /owner/gyms/:id/classes         | Yes  | Add class            |
| GET    | /owner/analytics/:gymId         | Yes  | Gym analytics        |

## Admin (admin role)

| Method | Endpoint                    | Auth | Description              |
|--------|----------------------------|------|--------------------------|
| GET    | /admin/users               | Yes  | List users               |
| GET    | /admin/gyms                | Yes  | List/approve gyms        |
| GET    | /admin/subscriptions       | Yes  | All subscriptions        |
| GET    | /admin/analytics           | Yes  | Platform analytics       |
