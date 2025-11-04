# Bookey - Sistema Integrado de Reservas de Salas

Este proyecto integra un frontend móvil (React Native/Expo) con un backend web (HTML/CSS/JavaScript) para crear un sistema completo de reservas de salas de mentoría.

## 🏗️ Arquitectura

### Frontend Móvil (React Native/Expo)
- **Ubicación**: `app/` y `components/`
- **Tecnologías**: React Native, Expo Router, Firebase Auth
- **Funcionalidades**: 
  - Autenticación con Firebase
  - Navegación por tabs
  - Listado de salas
  - Sistema de reservas

### Backend Web (HTML/CSS/JavaScript)
- **Ubicación**: `Salas de mentoría/`
- **Tecnologías**: HTML5, CSS3, JavaScript vanilla
- **Funcionalidades**:
  - Páginas web estáticas
  - Formularios de login/registro
  - Listado de salas
  - Sistema de reservas

### Servidor Integrado
- **Archivo**: `integrated-server.js`
- **Tecnologías**: Express.js, CORS
- **Funcionalidades**:
  - Sirve el frontend móvil
  - Sirve las páginas HTML del backend
  - API REST para comunicación entre frontend y backend
  - Endpoints para salas, reservas y autenticación

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI (para desarrollo móvil)

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Firebase (Opcional)
Si quieres usar autenticación con Firebase, crea un archivo `.env` en la raíz del proyecto:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
EXPO_PUBLIC_FIREBASE_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 3. Ejecutar el proyecto

#### Opción A: Servidor integrado (Recomendado)
```bash
npm run dev
```
Esto ejecutará:
- Servidor integrado en `http://localhost:3000`
- Frontend web en `http://localhost:3000`
- Frontend móvil en `http://localhost:3000/mobile`

#### Opción B: Servidores separados
```bash
# Terminal 1: Servidor integrado
npm run integrated-server

# Terminal 2: Frontend móvil
npm run web
```

## 📱 Uso del Sistema

### Frontend Móvil
1. Abre `http://localhost:3000` en tu navegador
2. Navega por las diferentes pestañas:
   - **Home**: Pantalla principal con información del sistema
   - **Salas**: Listado de salas disponibles con opción de reservar
   - **Profile**: Perfil del usuario

### Backend Web
1. Accede a las páginas HTML directamente:
   - `http://localhost:3000/principal` - Página principal
   - `http://localhost:3000/login` - Login
   - `http://localhost:3000/registro` - Registro
   - `http://localhost:3000/salas` - Listado de salas
   - `http://localhost:3000/reservas` - Sistema de reservas

### API REST
El servidor integrado expone los siguientes endpoints:

- `GET /api/health` - Estado del servidor
- `GET /api/salas` - Listado de salas
- `GET /api/horarios` - Horarios disponibles
- `POST /api/reservas` - Crear reserva
- `GET /api/reservas/:userId` - Reservas del usuario
- `POST /api/auth/login` - Autenticación

## 🔧 Estructura del Proyecto

```
Proyecto-Final-de-Fundamentos-de-Programaci-n-main/
├── app/                          # Frontend móvil (React Native/Expo)
│   ├── (tabs)/                   # Pantallas con navegación por tabs
│   │   ├── index.tsx            # Pantalla principal
│   │   ├── salas.tsx            # Pantalla de salas
│   │   └── two.tsx              # Pantalla de perfil
│   ├── login.tsx                # Pantalla de login
│   └── _layout.tsx              # Layout principal
├── components/                   # Componentes reutilizables
├── config/                      # Configuración
│   └── api.ts                   # Configuración de API
├── hooks/                       # Hooks personalizados
│   └── useSalas.ts              # Hook para manejo de salas
├── Salas de mentoría/           # Backend web (HTML/CSS/JS)
│   ├── principal.html           # Página principal
│   ├── log_in.html              # Login
│   ├── registrarse.html         # Registro
│   ├── list_salas.html          # Listado de salas
│   ├── detalles_salas.html      # Detalles de sala
│   └── reservas.html            # Sistema de reservas
├── integrated-server.js         # Servidor integrado
├── server.js                    # Servidor original
└── package.json                 # Dependencias y scripts
```

## 🌐 URLs de Acceso

- **Frontend Móvil**: `http://localhost:3000`
- **Backend Web**: `http://localhost:3000/backend`
- **API Health**: `http://localhost:3000/api/health`
- **API Salas**: `http://localhost:3000/api/salas`

## 🔄 Integración Frontend-Backend

El frontend móvil consume los datos del backend a través de la API REST:

1. **Configuración**: `config/api.ts` define los endpoints y funciones de comunicación
2. **Hooks**: `hooks/useSalas.ts` maneja el estado y las operaciones de salas
3. **Pantallas**: Las pantallas del frontend móvil usan los hooks para obtener datos
4. **Servidor**: `integrated-server.js` sirve tanto el frontend como el backend y expone la API

## 🛠️ Desarrollo

### Agregar nuevas funcionalidades
1. **Backend**: Agrega nuevas páginas HTML en `Salas de mentoría/`
2. **API**: Agrega nuevos endpoints en `integrated-server.js`
3. **Frontend**: Crea nuevas pantallas en `app/` y actualiza la configuración de API

### Modificar estilos
- **Frontend móvil**: Modifica los archivos `.tsx` en `app/`
- **Backend web**: Modifica los archivos `.html` en `Salas de mentoría/`

## 📝 Notas Importantes

- El sistema mantiene intactos tanto el frontend móvil como el backend web
- La integración se realiza a través del servidor integrado sin modificar la lógica original
- Firebase es opcional - el sistema funciona sin autenticación
- El servidor integrado expone una API REST que permite la comunicación entre ambos sistemas

## 🐛 Solución de Problemas

### El servidor no inicia
- Verifica que el puerto 3000 esté disponible
- Ejecuta `npm install` para asegurar que todas las dependencias estén instaladas

### El frontend móvil no carga datos
- Verifica que el servidor integrado esté ejecutándose
- Revisa la consola del navegador para errores de CORS
- Asegúrate de que la URL de la API sea correcta en `config/api.ts`

### Firebase no funciona
- Crea el archivo `.env` con las credenciales correctas
- Verifica que las credenciales sean válidas
- El sistema funciona sin Firebase, solo sin autenticación
