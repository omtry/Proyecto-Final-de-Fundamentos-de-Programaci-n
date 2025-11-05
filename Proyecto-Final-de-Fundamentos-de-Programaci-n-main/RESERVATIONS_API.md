# Reservations API Documentation

## Overview

The Reservations API provides endpoints for managing room reservations with Firestore backend and transactional conflict detection.

## Base URL

```
http://localhost:3003/api
```

## Setup

### Prerequisites

1. Python 3.8+
2. Firebase Admin SDK credentials
3. Firestore database configured

### Installation

```bash
cd backend
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file or set environment variables:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
FIREBASE_PROJECT_ID=your-project-id
PORT=3003
```

### Running the Server

```bash
python backend/app.py
```

Or using Flask:

```bash
export FLASK_APP=backend/app.py
flask run --port=3003
```

## Endpoints

### Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Reservations API is running",
  "service": "KeySpaces Reservations API"
}
```

---

### Get Reservations

```http
GET /api/reservations?roomId={roomId}&month={YYYY-MM}
```

**Query Parameters:**
- `roomId` (optional): Filter by room ID
- `month` (optional): Filter by month in YYYY-MM format

**Example:**
```http
GET /api/reservations?month=2024-01
GET /api/reservations?roomId=1&month=2024-01
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "reservation-id",
      "roomId": "1",
      "userId": "user123",
      "start": "2024-01-15T10:00:00+00:00",
      "end": "2024-01-15T12:00:00+00:00",
      "createdAt": "2024-01-10T10:00:00+00:00",
      "metadata": {}
    }
  ],
  "total": 1
}
```

---

### Create Reservation

```http
POST /api/reservations
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "roomId": "1",
  "userId": "user123",
  "start": "2024-01-15T10:00:00Z",
  "end": "2024-01-15T12:00:00Z",
  "metadata": {
    "proposito": "Sesión de mentoría",
    "participantes": 4
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Reservation created successfully",
  "data": {
    "id": "reservation-id",
    "roomId": "1",
    "userId": "user123",
    "start": "2024-01-15T10:00:00+00:00",
    "end": "2024-01-15T12:00:00+00:00",
    "createdAt": "2024-01-10T10:00:00+00:00",
    "metadata": {}
  }
}
```

**Conflict Response (409):**
```json
{
  "success": false,
  "message": "Reservation conflicts with existing reservation(s)",
  "conflicting_reservations": [
    {
      "id": "existing-reservation-id",
      "roomId": "1",
      "start": "2024-01-15T11:00:00+00:00",
      "end": "2024-01-15T13:00:00+00:00",
      "userId": "user456"
    }
  ]
}
```

**Validation Errors (400):**
```json
{
  "success": false,
  "message": "roomId is required"
}
```

---

### Check Availability

```http
POST /api/reservations/check
Content-Type: application/json
```

**Request Body:**
```json
{
  "roomId": "1",
  "start": "2024-01-15T10:00:00Z",
  "end": "2024-01-15T12:00:00Z"
}
```

**Available Response:**
```json
{
  "available": true
}
```

**Not Available Response:**
```json
{
  "available": false,
  "conflicting_reservations": [
    {
      "id": "existing-reservation-id",
      "start": "2024-01-15T11:00:00+00:00",
      "end": "2024-01-15T13:00:00+00:00"
    }
  ]
}
```

---

### Monthly Summary

```http
GET /api/reservations/monthly-summary?month={YYYY-MM}
```

**Example:**
```http
GET /api/reservations/monthly-summary?month=2024-01
```

**Response:**
```json
{
  "success": true,
  "data": {
    "month": "2024-01",
    "total_reservations": 25,
    "unique_rooms": 7,
    "unique_users": 15,
    "by_room": {
      "1": 5,
      "2": 4,
      "3": 3
    }
  }
}
```

## Data Schema

### Firestore Collection: `reservations`

**Document Structure:**
```json
{
  "roomId": "string",
  "userId": "string",
  "start": "ISO 8601 UTC datetime",
  "end": "ISO 8601 UTC datetime",
  "createdAt": "ISO 8601 UTC datetime",
  "metadata": {
    "proposito": "string",
    "participantes": number
  }
}
```

## Conflict Detection

Reservations are considered conflicting if:
```
existing.start < new.end && existing.end > new.start
```

This covers all overlap scenarios:
- Partial overlap (new starts before existing ends)
- Complete containment (new within existing or vice versa)
- Exact overlap

The API uses Firestore transactions to ensure atomic conflict checking and creation.

## Validation Rules

1. **Required Fields**: `roomId`, `userId`, `start`, `end`
2. **Datetime Format**: ISO 8601 UTC (e.g., `2024-01-15T10:00:00Z`)
3. **Start < End**: Start time must be before end time
4. **UTC Normalization**: All datetimes are normalized to UTC server-side

## Error Codes

- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `409`: Conflict (overlapping reservation exists)
- `500`: Internal Server Error

## Postman Examples

### Create Reservation

```bash
curl -X POST http://localhost:3003/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "roomId": "1",
    "userId": "user123",
    "start": "2024-01-15T10:00:00Z",
    "end": "2024-01-15T12:00:00Z",
    "metadata": {
      "proposito": "Sesión de mentoría"
    }
  }'
```

### Check Availability

```bash
curl -X POST http://localhost:3003/api/reservations/check \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "1",
    "start": "2024-01-15T10:00:00Z",
    "end": "2024-01-15T12:00:00Z"
  }'
```

### Get Monthly Reservations

```bash
curl http://localhost:3003/api/reservations?month=2024-01
```

## Testing

Run unit tests:

```bash
cd backend
python -m pytest tests/test_reservations.py -v
```

Or use unittest:

```bash
python -m unittest backend.tests.test_reservations
```

## Manual QA Checklist

- [ ] Create reservation with valid data
- [ ] Attempt to create overlapping reservation (should return 409)
- [ ] Check availability for available slot (should return available: true)
- [ ] Check availability for conflicting slot (should return available: false)
- [ ] Get reservations for a month
- [ ] Get reservations filtered by room
- [ ] Verify sidebar updates after creating reservation
- [ ] Verify form disables booking button for conflicting slots
- [ ] Test with different time zones (should normalize to UTC)
- [ ] Test edge cases: adjacent reservations, exact overlaps

## Frontend Integration

The frontend component `SidebarReservations` automatically fetches and displays reservations for the selected month.

**Usage:**
```javascript
const sidebar = new SidebarReservations('sidebarContainer', {
  currentMonth: '2024-01',
  apiBaseUrl: 'http://localhost:3003',
  pollInterval: 30000  // Refresh every 30 seconds
});
```

## Notes

- All datetimes are stored and processed in UTC
- The API uses Firestore transactions for atomic conflict detection
- Reservations are grouped by room in the sidebar display
- Real-time updates can be achieved via polling or Firestore listeners


