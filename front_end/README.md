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

