# ActiveMesh — Database Schema

## Collections

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
  "refreshToken": "string (select:false)",
  "resetToken": "string (select:false)",
  "resetExpiry": "Date (select:false)",
  "isActive": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### gyms
```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "address": "string",
  "suburb": "string",
  "city": "string",
  "state": "string",
  "postcode": "string",
  "location": { "type": "Point", "coordinates": [lng, lat] },
  "phone": "string",
  "email": "string",
  "website": "string",
  "facilities": ["string"],
  "gallery": ["string (URL)"],
  "openingHours": { "mon": "...", ... },
  "owner": "ObjectId (ref: User)",
  "rating": "number",
  "reviewCount": "number",
  "isVerified": "boolean",
  "isActive": "boolean",
  "createdAt": "Date"
}
```

### classes
```json
{
  "_id": "ObjectId",
  "gym": "ObjectId (ref: Gym)",
  "name": "string",
  "instructor": "string",
  "description": "string",
  "schedule": { "dayOfWeek": "number", "startTime": "string", "duration": "number" },
  "capacity": "number",
  "enrolled": ["ObjectId (ref: User)"],
  "isActive": "boolean"
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
  "status": "confirmed | cancelled",
  "createdAt": "Date"
}
```
Unique index: `{ user, class, date }`

### membershipplans
```json
{
  "_id": "ObjectId",
  "name": "string",
  "price": "number",
  "duration": "number (days)",
  "gymAccess": "single | network",
  "features": ["string"],
  "isActive": "boolean"
}
```

### subscriptions
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User)",
  "plan": "ObjectId (ref: MembershipPlan)",
  "gym": "ObjectId (ref: Gym) | null",
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
  "date": "Date (UTC date only, no time)",
  "qrToken": "string",
  "validatedAt": "Date"
}
```
Index: `{ user, date }` — used for one-gym-per-day enforcement.

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
TTL Index on `expiresAt` for automatic cleanup.

## Indexes

| Collection   | Index                          | Type    | Purpose                  |
|--------------|-------------------------------|---------|--------------------------|
| users        | email                         | Unique  | Fast login lookup        |
| gyms         | location                      | 2dsphere| Geo queries              |
| gyms         | name, description             | Text    | Full-text search         |
| checkins     | (user, date)                  | Compound| One-gym-per-day check    |
| bookings     | (user, class, date)           | Unique  | Prevent double booking   |
| qrpasses     | expiresAt                     | TTL     | Auto-expire QR passes    |
