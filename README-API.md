# Bookey API - Sistema de Reservas de Salas

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar el servidor API
```bash
npm run api-server
```

### 3. Ejecutar en modo desarrollo (API + Frontend)
```bash
npm run dev-api
```

### 4. Probar la API
```bash
npm run test-api
```

## 📋 Servidores Disponibles

| Servidor | Puerto | Descripción | Comando |
|----------|--------|-------------|---------|
| **API Server** | 3002 | Nueva API REST completa | `npm run api-server` |
| **Integrated Server** | 3000 | Servidor integrado existente | `npm run integrated-server` |
| **Original Server** | 3001 | Servidor original | `npm run server` |

## 🔗 URLs Importantes

### API Endpoints
- **Health Check**: http://localhost:3002/api/health
- **Salas**: http://localhost:3002/api/salas
- **Reservas**: http://localhost:3002/api/reservas
- **Horarios**: http://localhost:3002/api/horarios
- **Estadísticas**: http://localhost:3002/api/stats

### Frontend
- **Página Principal**: http://localhost:3002/
- **Salas**: http://localhost:3002/rooms
- **Perfil**: http://localhost:3002/profile
- **Reservas**: http://localhost:3002/reservations

## 🏗️ Arquitectura

```
Frontend (HTML/CSS/JS)
    ↓ HTTP Requests
API Server (Express.js)
    ↓ Data Management
In-Memory Database
```

## 📁 Estructura de Archivos

```
├── api-server.js          # Servidor API principal
├── frontend/
│   ├── js/
│   │   ├── auth.js        # Autenticación Firebase
│   │   └── api.js         # Cliente API para frontend
│   ├── index.html         # Página principal
│   ├── rooms.html         # Lista de salas
│   ├── profile.html       # Perfil de usuario
│   └── reservas.html      # Formulario de reservas
├── test-api.js           # Tests de la API
└── API_DOCUMENTATION.md  # Documentación completa
```

## 🔧 Funcionalidades

### ✅ Implementadas
- [x] API REST completa
- [x] Gestión de salas
- [x] Sistema de reservas
- [x] Validación de horarios
- [x] Autenticación Firebase
- [x] Frontend dinámico
- [x] Tests automatizados
- [x] Documentación

### 🚧 En Desarrollo
- [ ] Base de datos persistente
- [ ] Notificaciones por email
- [ ] Sistema de roles
- [ ] Reportes avanzados

## 📊 Endpoints Principales

### Salas
```javascript
// Obtener todas las salas
GET /api/salas

// Obtener sala específica
GET /api/salas/:id
```

### Reservas
```javascript
// Crear reserva
POST /api/reservas
{
  "salaId": 1,
  "fecha": "2024-01-20",
  "horario": "10:00",
  "duracion": 2,
  "proposito": "Sesión de mentoría",
  "participantes": 4,
  "userId": "user_123"
}

// Obtener reservas de usuario
GET /api/reservas/:userId

// Cancelar reserva
DELETE /api/reservas/:id
```

### Validaciones
```javascript
// Validar horario
POST /api/validate-booking
{
  "startTime": "14:00",
  "duration": 2
}
```

## 🎯 Uso en Frontend

### Cargar salas dinámicamente
```javascript
// En rooms.html
document.addEventListener('DOMContentLoaded', function() {
    initSalasPage();
});
```

### Crear reserva
```javascript
const reserva = await window.api.crearReserva({
    salaId: 1,
    fecha: '2024-01-20',
    horario: '10:00',
    duracion: 2,
    proposito: 'Sesión de mentoría',
    participantes: 4,
    userId: 'user_123'
});
```

### Cargar perfil de usuario
```javascript
// En profile.html
document.addEventListener('DOMContentLoaded', function() {
    initProfilePage();
});
```

## 🧪 Testing

### Ejecutar tests
```bash
npm run test-api
```

### Tests incluidos
- ✅ Health Check
- ✅ Obtener salas
- ✅ Obtener horarios
- ✅ Validar horarios
- ✅ Crear reservas
- ✅ Obtener reservas
- ✅ Actualizar reservas
- ✅ Cancelar reservas
- ✅ Estadísticas

## 🔒 Seguridad

- **CORS**: Habilitado para desarrollo
- **Autenticación**: Integrada con Firebase Auth
- **Validaciones**: Horarios, capacidad, campos requeridos
- **Rate Limiting**: No implementado (recomendado para producción)

## 📈 Monitoreo

### Health Check
```bash
curl http://localhost:3002/api/health
```

### Estadísticas
```bash
curl http://localhost:3002/api/stats
```

## 🚀 Despliegue

### Variables de Entorno
```bash
PORT=3002
NODE_ENV=production
```

### Comandos de Producción
```bash
# Instalar dependencias
npm install --production

# Ejecutar servidor
npm run api-server
```

## 🐛 Troubleshooting

### Error: "Cannot connect to API"
1. Verificar que el servidor esté ejecutándose: `npm run api-server`
2. Verificar el puerto: http://localhost:3002/api/health
3. Revisar logs del servidor

### Error: "CORS policy"
1. Verificar que CORS esté habilitado en el servidor
2. Verificar que las URLs sean correctas

### Error: "Firebase not initialized"
1. Verificar que Firebase esté configurado correctamente
2. Revisar las credenciales en `auth.js`

## 📞 Soporte

Para problemas o preguntas:
1. Revisar la documentación: `API_DOCUMENTATION.md`
2. Ejecutar tests: `npm run test-api`
3. Verificar logs del servidor
4. Comprobar configuración de Firebase

## 🔄 Próximos Pasos

1. **Integrar base de datos real** (MongoDB/PostgreSQL)
2. **Implementar autenticación JWT**
3. **Agregar notificaciones por email**
4. **Crear sistema de roles y permisos**
5. **Implementar rate limiting**
6. **Agregar logging avanzado**
7. **Crear tests unitarios**
8. **Documentación Swagger/OpenAPI**
