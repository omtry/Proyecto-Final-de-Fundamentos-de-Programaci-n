# API Documentation - Bookey

## Descripción
API REST para el sistema de reservas de salas de mentoría Bookey. Proporciona endpoints para gestionar salas, reservas, usuarios y autenticación.

## Base URL
```
http://localhost:3001/api
```

## Endpoints

### 🏥 Health Check
```http
GET /api/health
```
**Respuesta:**
```json
{
  "status": "OK",
  "message": "API Server is running",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "version": "1.0.0"
}
```

### 🏢 Salas

#### Obtener todas las salas
```http
GET /api/salas
```
**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Sala 201",
      "tipo": "Corporate",
      "descripcion": "Sala ideal para sesiones de estrategia...",
      "capacidad": 6,
      "imagen": "https://...",
      "disponible": true,
      "equipamiento": ["Pizarra digital", "Proyector", "WiFi"]
    }
  ],
  "total": 7
}
```

#### Obtener sala por ID
```http
GET /api/salas/:id
```

### ⏰ Horarios

#### Obtener horarios disponibles
```http
GET /api/horarios
```
**Respuesta:**
```json
{
  "success": true,
  "data": ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
}
```

### 📅 Reservas

#### Crear nueva reserva
```http
POST /api/reservas
Content-Type: application/json

{
  "salaId": 1,
  "fecha": "2024-01-20",
  "horario": "10:00",
  "duracion": 2,
  "proposito": "Sesión de mentoría",
  "participantes": 4,
  "notas": "Reunión de planificación",
  "userId": "user_123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Reserva creada exitosamente",
  "data": {
    "id": 1234567890,
    "userId": "user_123",
    "salaId": 1,
    "salaNombre": "Sala 201",
    "fecha": "2024-01-20",
    "horario": "10:00",
    "duracion": 2,
    "proposito": "Sesión de mentoría",
    "participantes": 4,
    "notas": "Reunión de planificación",
    "estado": "confirmada",
    "fechaCreacion": "2024-01-15T10:00:00.000Z"
  }
}
```

#### Obtener reservas de usuario
```http
GET /api/reservas/:userId
```

#### Obtener todas las reservas (admin)
```http
GET /api/reservas
```

#### Actualizar reserva
```http
PUT /api/reservas/:id
Content-Type: application/json

{
  "estado": "cancelada",
  "notas": "Cancelada por el usuario"
}
```

#### Cancelar reserva
```http
DELETE /api/reservas/:id
```

### 👤 Usuarios

#### Obtener perfil de usuario
```http
GET /api/usuarios/:id
```

#### Actualizar perfil de usuario
```http
PUT /api/usuarios/:id
Content-Type: application/json

{
  "nombre": "Nuevo Nombre",
  "telefono": "+1234567890"
}
```

### ✅ Validaciones

#### Validar horario de reserva
```http
POST /api/validate-booking
Content-Type: application/json

{
  "startTime": "14:00",
  "duration": 2
}
```

**Respuesta:**
```json
{
  "valid": true,
  "message": "Horario válido"
}
```

### 📊 Estadísticas

#### Obtener estadísticas generales
```http
GET /api/stats
```
**Respuesta:**
```json
{
  "success": true,
  "data": {
    "totalSalas": 7,
    "salasDisponibles": 7,
    "totalReservas": 15,
    "reservasConfirmadas": 12,
    "totalUsuarios": 25
  }
}
```

## Códigos de Estado HTTP

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Manejo de Errores

Todas las respuestas de error siguen este formato:

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos (solo en desarrollo)"
}
```

## Ejemplos de Uso

### Frontend JavaScript

```javascript
// Obtener salas
const salas = await window.api.getSalas();

// Crear reserva
const reserva = await window.api.crearReserva({
  salaId: 1,
  fecha: '2024-01-20',
  horario: '10:00',
  duracion: 2,
  proposito: 'Sesión de mentoría',
  participantes: 4,
  userId: 'user_123'
});

// Obtener reservas de usuario
const reservas = await window.api.getReservasUsuario('user_123');
```

## Configuración

### Variables de Entorno
- `PORT` - Puerto del servidor (default: 3001)
- `NODE_ENV` - Entorno de ejecución (development/production)

### Instalación
```bash
npm install
```

### Ejecutar servidor
```bash
npm start
# o
npm run server
# o
node server.js
```

## Notas Importantes

1. **Autenticación**: La API no maneja autenticación directamente. Se integra con Firebase Auth del frontend.

2. **Base de Datos**: Actualmente usa datos en memoria. Para producción, se recomienda integrar con una base de datos real (MongoDB, PostgreSQL, etc.).

3. **Validaciones**: 
   - Horarios: 7:00 AM - 4:00 PM
   - Capacidad máxima: 6 personas por sala
   - Duración mínima: 0.5 horas

4. **CORS**: Habilitado para todas las rutas en desarrollo.

5. **Rate Limiting**: No implementado. Se recomienda para producción.

## Próximas Mejoras

- [ ] Integración con base de datos real
- [ ] Autenticación JWT
- [ ] Rate limiting
- [ ] Logging avanzado
- [ ] Tests automatizados
- [ ] Documentación Swagger/OpenAPI
- [ ] Notificaciones por email
- [ ] Sistema de permisos por roles
