# Configuración de Google OAuth para Bookey

## Pasos para configurar la autenticación de Google

### 1. Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ (o Google Identity)

### 2. Configurar OAuth 2.0

1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "OAuth 2.0 Client IDs"
3. Selecciona "Web application"
4. Configura las URIs autorizadas:
   - **Orígenes autorizados de JavaScript**: `http://localhost:3001` (para desarrollo)
   - **URIs de redirección autorizados**: `http://localhost:3001/auth/google/callback`

### 3. Obtener el Client ID

1. Copia el "Client ID" generado
2. Abre el archivo `frontend/js/auth.js`
3. Busca la configuración de Google OAuth y actualiza el Client ID si es necesario

### 4. Configurar para producción

Para producción, actualiza las URIs en Google Cloud Console:
- **Orígenes autorizados de JavaScript**: `https://tu-dominio.com`
- **URIs de redirección autorizados**: `https://tu-dominio.com/auth/google/callback`

Y actualiza el archivo `auth.js` con la URL de producción si es necesario.

## Estructura de archivos

```
frontend/
├── js/
│   └── auth.js            # Sistema de autenticación (Firebase + Google OAuth)
├── auth/
│   └── google/
│       └── callback.html  # Página de callback de OAuth
└── ...
```

## Funcionalidades implementadas

- ✅ Pop-up real de Google OAuth
- ✅ Gestión de sesiones con localStorage
- ✅ Callback para recibir datos del usuario
- ✅ Persistencia de sesión entre páginas
- ✅ Botón "Volver al menú principal" en reservas
- ✅ Interfaz optimizada y funcional

## Notas importantes

- El pop-up de Google OAuth se abre en una ventana separada
- Los datos del usuario se almacenan en localStorage
- La sesión persiste hasta que el usuario cierre sesión manualmente
- Compatible con todos los navegadores modernos
