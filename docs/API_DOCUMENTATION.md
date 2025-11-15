# LuxeDrive Car Rental API Documentation

**Base URL**: `https://zjiycdqtwkrvrojebclv.supabase.co/functions/v1`

**Authentication**: Most endpoints require JWT authentication via `Authorization: Bearer <token>` header.

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Cars](#cars)
3. [Bookings](#bookings)
4. [Pricing](#pricing)
5. [Promo Codes](#promo-codes)
6. [Agencies](#agencies)
7. [Reviews](#reviews)
8. [Error Responses](#error-responses)

---

## 🔐 Authentication

### Register User

```http
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "data": {
    "name": "John Doe",
    "phone": "+91 98765 43210"
  }
}
```

**Response (201 Created)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "v1.MjYyNzI4MTc...",
  "user": {
    "id": "c7e3f6a0-1234-4567-89ab-abcdef123456",
    "email": "user@example.com",
    "user_metadata": {
      "name": "John Doe",
      "phone": "+91 98765 43210"
    }
  }
}
```

### Login

```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

### Refresh Token

```http
POST /auth/v1/token?grant_type=refresh_token
Content-Type: application/json

{
  "refresh_token": "v1.MjYyNzI4MTc..."
}
```

---

## 🚗 Cars

### List Cars (Public)

```http
GET /functions/v1/list-cars?transmission=automatic&minPrice=2000&maxPrice=8000&seats=5&sortBy=price_asc&page=1&limit=12
```

**Query Parameters:**

| Parameter     | Type   | Description                                    | Example         |
|---------------|--------|------------------------------------------------|-----------------|
| transmission  | string | Filter by transmission (automatic/manual)      | `automatic`     |
| minPrice      | number | Minimum price per day (INR)                    | `2000`          |
| maxPrice      | number | Maximum price per day (INR)                    | `8000`          |
| seats         | number | Minimum seats required                         | `5`             |
| fuelType      | string | Filter by fuel type (petrol/diesel/electric)   | `electric`      |
| search        | string | Full-text search on model/make                 | `Tesla Model`   |
| sortBy        | string | Sort order (price_asc/price_desc/rating_desc)  | `price_asc`     |
| page          | number | Page number (default: 1)                       | `1`             |
| limit         | number | Results per page (default: 12)                 | `12`            |

**Response (200 OK)**:
```json
{
  "cars": [
    {
      "id": "car_123",
      "model": "Model 3",
      "make": "Tesla",
      "year": 2024,
      "seats": 5,
      "luggage": 2,
      "transmission": "automatic",
      "fuelType": "electric",
      "features": ["Autopilot", "Premium Sound", "Heated Seats"],
      "pricePerDay": 6500,
      "currency": "INR",
      "images": ["https://..."],
      "ratingAvg": 4.8,
      "ratingCount": 234,
      "agency": {
        "id": "agency_123",
        "name": "LuxeDrive Rentals",
        "rating_avg": 4.9
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 48,
    "totalPages": 4
  }
}
```

### Get Car Details (Public)

```http
GET /rest/v1/cars?id=eq.car_123&select=*,agency:agencies(*)
Authorization: apikey YOUR_ANON_KEY
```

---

## 💰 Pricing

### Calculate Price

```http
POST /functions/v1/calculate-price
Content-Type: application/json

{
  "carId": "car_123",
  "start": "2025-12-05T10:00:00Z",
  "end": "2025-12-07T10:00:00Z",
  "addons": ["addon_gps", "addon_insurance"],
  "promoCode": "WELCOME10"
}
```

**Response (200 OK)**:
```json
{
  "days": 2,
  "basePrice": 13000,
  "addonsPrice": 400,
  "subtotal": 13400,
  "discount": 1340,
  "discountPercent": 10,
  "taxes": 2170.80,
  "taxPercent": 18,
  "deposit": 2846.16,
  "depositPercent": 20,
  "totalAmount": 14230.80,
  "currency": "INR",
  "breakdown": {
    "carPricePerDay": 6500,
    "carTotal": 13000,
    "addons": [
      {
        "name": "GPS Navigation",
        "pricePerDay": 500,
        "total": 1000
      },
      {
        "name": "Premium Insurance",
        "pricePerDay": 1200,
        "total": 2400
      }
    ]
  }
}
```

---

## 📅 Bookings

### Create Booking (Authenticated)

```http
POST /functions/v1/create-booking
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "carId": "car_123",
  "startDatetime": "2025-12-05T10:00:00Z",
  "endDatetime": "2025-12-07T10:00:00Z",
  "pickupLocation": "Bandra West, Mumbai 400050",
  "dropoffLocation": "Bandra West, Mumbai 400050",
  "addons": ["addon_gps", "addon_insurance"],
  "promoCode": "WELCOME10"
}
```

**Response (201 Created)**:
```json
{
  "booking": {
    "id": "booking_123",
    "status": "pending",
    "totalAmount": 14230.80,
    "depositAmount": 2846.16,
    "currency": "INR",
    "expiresAt": "2025-12-01T10:15:00Z"
  },
  "message": "Booking created. Complete payment within 15 minutes."
}
```

**Error Responses:**

- **409 Conflict**: Car not available for selected dates
- **401 Unauthorized**: Missing or invalid authentication
- **404 Not Found**: Car not found or inactive

### Get User Bookings (Authenticated)

```http
GET /rest/v1/bookings?user_id=eq.USER_ID&select=*,car:cars(*),agency:agencies(*)&order=created_at.desc
Authorization: Bearer YOUR_JWT_TOKEN
```

### Cancel Booking (Authenticated)

```http
PATCH /rest/v1/bookings?id=eq.BOOKING_ID
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "status": "cancelled"
}
```

---

## 🎟️ Promo Codes

### Validate Promo Code

```http
GET /rest/v1/promo_codes?code=eq.WELCOME10&select=*
Authorization: apikey YOUR_ANON_KEY
```

**Response (200 OK)**:
```json
{
  "id": "promo_123",
  "code": "WELCOME10",
  "description": "Welcome offer - 10% off on your first booking",
  "discount_type": "percent",
  "discount_value": 10,
  "active": true,
  "usage_limit": 1000,
  "usage_count": 234,
  "per_user_limit": 1,
  "starts_at": "2025-01-01T00:00:00Z",
  "ends_at": null
}
```

---

## 🏢 Agencies

### List Agencies (Public)

```http
GET /rest/v1/agencies?select=*,location:locations(*)&order=rating_avg.desc
Authorization: apikey YOUR_ANON_KEY
```

### Get Agency Details (Public)

```http
GET /rest/v1/agencies?id=eq.AGENCY_ID&select=*,cars:cars(*),location:locations(*)
Authorization: apikey YOUR_ANON_KEY
```

---

## ⭐ Reviews

### Create Review (Authenticated, only after completed booking)

```http
POST /rest/v1/reviews
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "car_id": "car_123",
  "booking_id": "booking_123",
  "rating": 5,
  "comment": "Excellent car! Smooth ride and great service."
}
```

### Get Car Reviews (Public)

```http
GET /rest/v1/reviews?car_id=eq.CAR_ID&select=*,user:profiles(name)&order=created_at.desc
Authorization: apikey YOUR_ANON_KEY
```

---

## ⚠️ Error Responses

All endpoints follow a consistent error format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**HTTP Status Codes:**

| Code | Meaning                  | Example                                 |
|------|--------------------------|-----------------------------------------|
| 400  | Bad Request              | Missing required fields                 |
| 401  | Unauthorized             | Missing or invalid authentication token |
| 403  | Forbidden                | Insufficient permissions                |
| 404  | Not Found                | Resource doesn't exist                  |
| 409  | Conflict                 | Car unavailable / double booking        |
| 500  | Internal Server Error    | Server-side error                       |

---

## 🔒 Security Features

1. **Row Level Security (RLS)**: All tables have RLS policies enforcing data access rules
2. **JWT Authentication**: Short-lived access tokens (15 minutes) + refresh tokens (30 days)
3. **Role-Based Access**: Separate roles for users, hosts, and admins
4. **Input Validation**: All user inputs validated before processing
5. **Rate Limiting**: Configurable via Supabase dashboard
6. **CORS Protection**: CORS headers properly configured

---

## 💡 Best Practices

1. Always store JWT tokens securely (httpOnly cookies recommended)
2. Use refresh tokens to get new access tokens before expiry
3. Implement exponential backoff for failed requests
4. Cache car listings with short TTL (30 seconds)
5. Use pagination for large result sets
6. Validate promo codes before submitting bookings
7. Check car availability before showing booking form

---

## 📊 Rate Limits

- **Authentication endpoints**: 5 requests/minute per IP
- **Booking creation**: 10 requests/minute per user
- **General API**: 100 requests/minute per user

---

## 🚀 Quick Start Example (cURL)

```bash
# 1. Register user
curl -X POST 'https://zjiycdqtwkrvrojebclv.supabase.co/auth/v1/signup' \
  -H 'Content-Type: application/json' \
  -H 'apikey: YOUR_ANON_KEY' \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "data": {"name": "Test User"}
  }'

# 2. Calculate price
curl -X POST 'https://zjiycdqtwkrvrojebclv.supabase.co/functions/v1/calculate-price' \
  -H 'Content-Type: application/json' \
  -d '{
    "carId": "car_123",
    "start": "2025-12-05T10:00:00Z",
    "end": "2025-12-07T10:00:00Z",
    "promoCode": "WELCOME10"
  }'

# 3. Create booking (requires auth)
curl -X POST 'https://zjiycdqtwkrvrojebclv.supabase.co/functions/v1/create-booking' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "carId": "car_123",
    "startDatetime": "2025-12-05T10:00:00Z",
    "endDatetime": "2025-12-07T10:00:00Z",
    "pickupLocation": "Mumbai Airport",
    "dropoffLocation": "Mumbai Airport"
  }'
```

---

For more details, visit the backend Cloud interface or check the database schema documentation.
