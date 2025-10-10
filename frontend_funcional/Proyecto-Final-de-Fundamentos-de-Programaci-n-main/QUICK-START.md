# 🚀 Inicio Rápido - Bookey Integrado

## Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar el proyecto integrado
```bash
npm run dev
```

### 3. Acceder a la aplicación
- **Frontend móvil**: http://localhost:3000
- **Backend web**: http://localhost:3000/backend
- **API**: http://localhost:3000/api/health

## Verificar Integración

### Ejecutar pruebas automáticas
```bash
npm run test-integration
```

### Verificar manualmente
1. Abre http://localhost:3000 en tu navegador
2. Navega a la pestaña "Salas"
3. Verifica que se carguen las salas del backend
4. Prueba hacer una reserva

## Estructura del Proyecto

- **Frontend móvil**: `app/` - React Native/Expo
- **Backend web**: `Salas de mentoría/` - HTML/CSS/JS
- **Servidor integrado**: `integrated-server.js` - Express.js
- **Configuración API**: `config/api.ts`
- **Hooks**: `hooks/useSalas.ts`

## URLs Importantes

- **Principal**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Salas**: http://localhost:3000/salas
- **Reservas**: http://localhost:3000/reservas
- **API Salas**: http://localhost:3000/api/salas

## Solución de Problemas

### El servidor no inicia
```bash
# Verificar que el puerto 3000 esté libre
netstat -an | grep 3000

# Matar proceso si es necesario
npx kill-port 3000
```

### El frontend no carga datos
- Verificar que el servidor integrado esté ejecutándose
- Revisar la consola del navegador para errores
- Verificar la configuración de CORS

### Firebase no funciona
- Crear archivo `.env` con credenciales de Firebase
- El sistema funciona sin Firebase (solo sin autenticación)

## Comandos Útiles

```bash
# Solo servidor integrado
npm run integrated-server

# Solo frontend web
npm run web

# Probar integración
npm run test-integration

# Limpiar caché
npm start -- --clear
```
