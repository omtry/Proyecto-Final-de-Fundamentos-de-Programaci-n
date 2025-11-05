## BK Login App (Expo + Web + Firebase)

### Setup

1. Crea un proyecto en Firebase y habilita Authentication (Email/Password y Google) y Firestore.
2. Crea una app web en Firebase y copia la configuración.
3. Crea un archivo `.env` en la raíz con:
```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

### Ejecutar

```bash
npm run web
# o
npm start
```

La pantalla de login permite email/contraseña y Google. Al primer inicio guarda `uid`, `email`, `displayName` en Firestore. La sesión se mantiene activa.

## Reservations API (Python Backend)

### Setup Reservations API

1. Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Configure Firebase Admin SDK:
   - Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable to your service account key path
   - Or set `FIREBASE_PROJECT_ID` for default credentials

3. Run the Python API server:
```bash
python backend/app.py
```

The API will run on `http://localhost:3003`

### Reservations API Endpoints

- `GET /api/reservations?month=YYYY-MM` - Get reservations for a month
- `POST /api/reservations` - Create a new reservation (with conflict detection)
- `POST /api/reservations/check` - Check availability
- `GET /api/reservations/monthly-summary?month=YYYY-MM` - Get monthly summary

See [RESERVATIONS_API.md](RESERVATIONS_API.md) for complete API documentation.

### Features

- **Transactional Conflict Detection**: Uses Firestore transactions to prevent overlapping reservations
- **Sidebar Component**: Right-side sidebar displays all reservations for selected month
- **Real-time Updates**: Sidebar polls for updates every 30 seconds
- **Availability Checking**: Form validates availability before submission

### Testing

Run tests:
```bash
python -m unittest backend.tests.test_reservations
```

