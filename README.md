# Bookey - Sistema de Reservas de Salas de Mentoría

Sistema completo de reservas de salas de mentoría desarrollado con Express.js, HTML/CSS/JavaScript y Firebase Authentication.

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar el servidor
```bash
npm start
# o
npm run server
# o
node server.js
```

### 3. Acceder a la aplicación
Abre tu navegador en: **http://localhost:3001**

## 📁 Estructura del Proyecto

```
Proyecto-Final-de-Fundamentos-de-Programaci-n/
├── frontend/                    # Frontend HTML/CSS/JavaScript
│   ├── js/
│   │   ├── api.js              # Cliente API para comunicación con backend
│   │   ├── auth.js             # Sistema de autenticación (Firebase + Google OAuth)
│   │   ├── reservasPolling.js  # Polling de reservas
│   │   └── reservasValidator.js # Validación de reservas
│   ├── auth/
│   │   └── google/
│   │       └── callback.html   # Callback de Google OAuth
│   ├── img/                    # Imágenes de las salas
│   ├── index.html              # Página principal
│   ├── about.html              # Acerca de
│   ├── login.html              # Login/Registro
│   ├── register.html           # Registro
│   ├── rooms.html              # Lista de salas
│   ├── reservas.html           # Sistema de reservas
│   ├── profile.html            # Perfil de usuario
│   ├── admin.html              # Panel de administración
│   └── disponibilidad.html    # Disponibilidad de salas
├── data/
│   └── reservas.json          # Persistencia de reservas
├── server.js                   # Servidor Express.js principal
├── package.json                # Dependencias del proyecto
└── README.md                   # Este archivo
```

## 🌐 Rutas del Sitio Web

- **Home**: `http://localhost:3001/` - Página principal
- **About**: `http://localhost:3001/about` - Acerca de nosotros
- **Rooms**: `http://localhost:3001/rooms` - Lista de salas disponibles
- **Login**: `http://localhost:3001/login` - Iniciar sesión
- **Register**: `http://localhost:3001/register` - Registro de usuarios
- **Profile**: `http://localhost:3001/profile` - Perfil de usuario
- **Reservations**: `http://localhost:3001/reservations` - Sistema de reservas
- **Admin**: `http://localhost:3001/admin` - Panel de administración
- **Disponibilidad**: `http://localhost:3001/disponibilidad` - Disponibilidad de salas

## 📡 API REST Endpoints

### Health Check
```http
GET /api/health
```

### Salas
```http
GET /api/salas              # Obtener todas las salas
GET /api/salas/:id           # Obtener sala por ID
```

### Horarios
```http
GET /api/horarios            # Obtener horarios disponibles
```

### Reservas
```http
GET /api/reservas            # Obtener todas las reservas
GET /api/reservas/:userId     # Obtener reservas de un usuario
GET /api/reservas/usuario/:userId/activas  # Reservas activas del usuario
POST /api/reservas            # Crear nueva reserva
DELETE /api/reservas/:id      # Cancelar reserva
```

### Disponibilidad
```http
GET /api/disponibilidad?fecha=YYYY-MM-DD  # Disponibilidad de salas
```

### Usuarios
```http
GET /api/usuarios/:id        # Obtener perfil de usuario
GET /api/user/:userId         # Información de usuario (incluyendo rol)
```

### Estadísticas
```http
GET /api/stats               # Estadísticas generales
```

### Administración
```http
POST /api/admin/salas        # Crear nueva sala (solo admin)
DELETE /api/admin/salas/:id  # Eliminar sala (solo admin)
```

### Validaciones
```http
POST /api/validate-booking   # Validar horario de reserva
```

Para más detalles, consulta [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 🔐 Sistema de Autenticación

El sistema utiliza **Firebase Authentication** con soporte para:

- ✅ Login con Email/Contraseña
- ✅ Login con Google OAuth 2.0
- ✅ Registro de usuarios
- ✅ Recuperación de contraseña
- ✅ Persistencia de sesión
- ✅ Protección de rutas

### Configuración Firebase

Las credenciales de Firebase ya están configuradas en `frontend/js/auth.js`:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDE4G922U64anqvonQe-_b4iuzXYa3u_as",
    authDomain: "keyspaces-2b692.firebaseapp.com",
    projectId: "keyspaces-2b692",
    // ...
};
```

Para configurar Google OAuth, consulta [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)

## 🏢 Sistema de Salas

El sistema incluye 7 salas de mentoría:

1. **Sala 201** - Corporate
2. **Sala 202** - Cognata
3. **Sala 203** - Importe
4. **Sala 204** - Cognata
5. **Sala 205** - Corporate
6. **Sala 206** - Innovate
7. **Sala 207** - Focus

Cada sala tiene:
- Capacidad: 6 personas
- Equipamiento específico
- Descripción detallada
- Imagen

## 📅 Sistema de Reservas

### Características:
- ✅ Validación de horarios (7:00 AM - 4:00 PM)
- ✅ Prevención de conflictos de horario
- ✅ Una reserva activa por usuario
- ✅ Cancelación de reservas
- ✅ Persistencia en archivo JSON
- ✅ Validación de disponibilidad en tiempo real

### Flujo de Reserva:
1. Usuario debe estar autenticado
2. Selecciona una sala disponible
3. Elige fecha, horario y duración
4. Completa información de la reserva
5. Sistema valida disponibilidad
6. Reserva confirmada

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Autenticación**: Firebase Authentication
- **Base de Datos**: Firebase Firestore (usuarios) + JSON (reservas)
- **Middleware**: CORS, Express JSON

## 📦 Dependencias

```json
{
  "express": "^4.21.2",
  "cors": "^2.8.5",
  "firebase": "^12.4.0"
}
```

## 🚀 Comandos Disponibles

```bash
# Iniciar servidor
npm start
npm run server
node server.js

# Modo desarrollo (mismo comando)
npm run dev
```

## 🔧 Configuración

### Variables de Entorno

El servidor usa el puerto **3001** por defecto. Puedes cambiarlo con:

```bash
PORT=3001 node server.js
```

## 📚 Documentación Adicional

- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Documentación completa de la API
- [README-WEBSITE.md](README-WEBSITE.md) - Guía del sitio web
- [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) - Configuración de Google OAuth
- [SISTEMA_AUTENTICACION_FINAL.md](SISTEMA_AUTENTICACION_FINAL.md) - Sistema de autenticación
- [TEST_LOGIN.md](TEST_LOGIN.md) - Guía de pruebas de login
- [ERRORES_CORREGIDOS.md](ERRORES_CORREGIDOS.md) - Historial de correcciones
- [MEJORAS_IMPLEMENTADAS.md](MEJORAS_IMPLEMENTADAS.md) - Historial de mejoras

## 🐛 Solución de Problemas

### El servidor no inicia
- Verifica que el puerto 3001 esté disponible
- Ejecuta `npm install` para instalar dependencias

### Error de autenticación
- Verifica que Firebase esté configurado correctamente
- Revisa la consola del navegador para errores

### Las reservas no se guardan
- Verifica que la carpeta `data/` exista y tenga permisos de escritura
- Revisa los logs del servidor para errores

### CORS errors
- El servidor tiene CORS habilitado por defecto
- Verifica que estés accediendo desde `http://localhost:3001`

## 📝 Notas Importantes

1. **Base de Datos**: Actualmente usa datos en memoria y archivos JSON. Para producción, se recomienda integrar con una base de datos real (MongoDB, PostgreSQL, etc.)

2. **Autenticación**: El sistema usa Firebase Authentication. Las credenciales están configuradas en el código.

3. **Persistencia**: Las reservas se guardan en `data/reservas.json`. Los usuarios se guardan en Firebase Firestore.

4. **Seguridad**: En producción, implementa:
   - Rate limiting
   - Validación de tokens JWT
   - Sanitización de inputs
   - HTTPS

## 🎯 Funcionalidades Principales

- ✅ Sistema completo de autenticación
- ✅ Gestión de salas
- ✅ Sistema de reservas con validaciones
- ✅ Panel de administración
- ✅ Perfil de usuario
- ✅ Disponibilidad en tiempo real
- ✅ API REST completa
- ✅ Interfaz responsive

## 📄 Licencia

Ver [LICENSE](LICENSE) para más detalles.

## 👥 Contribuidores

Proyecto Final de Fundamentos de Programación

---

**Bookey** - Sistema de Reservas de Salas de Mentoría
