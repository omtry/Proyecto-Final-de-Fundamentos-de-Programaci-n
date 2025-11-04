# BK Login App - HTML/CSS/JS Version

## 🚀 Aplicación completa en HTML/CSS/JavaScript con Firebase

### ✅ Características Implementadas

- **Frontend**: HTML/CSS/JavaScript puro
- **Backend**: Node.js + Express
- **Base de datos**: Firebase Firestore
- **Autenticación**: Firebase Auth (Email/Password + Google)
- **UI**: Diseño idéntico al original con formas azules y tema oscuro

### 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Node.js, Express.js
- **Firebase**: Auth, Firestore
- **Styling**: CSS Grid, Flexbox, Animaciones CSS

### 📁 Estructura del Proyecto

```
bk-app/
├── public/
│   ├── index.html          # Pantalla de login y dashboard
│   └── styles.css          # Estilos CSS
├── server.js               # Servidor Express
├── package.json            # Dependencias
└── README-HTML.md          # Esta documentación
```

### 🚀 Cómo Ejecutar

#### Opción 1: Solo Frontend (HTML estático)
```bash
# Abrir directamente en navegador
# Abre: public/index.html
```

#### Opción 2: Con Servidor Express
```bash
# Instalar dependencias (ya hecho)
npm install

# Ejecutar servidor
npm run server

# Abrir: http://localhost:3000
```

#### Opción 3: Desarrollo completo
```bash
# Ejecutar servidor + Expo (si necesitas)
npm run dev
```

### 🔥 Configuración Firebase

Las credenciales ya están configuradas en `public/index.html`:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDE4G922U64anqvonQe-_b4iuzXYa3u_as",
    authDomain: "keyspaces-2b692.firebaseapp.com",
    projectId: "keyspaces-2b692",
    storageBucket: "keyspaces-2b692.appspot.com",
    messagingSenderId: "197899248871",
    appId: "1:197899248871:web:1b9652b572badd2dc42e42"
};
```

### ✨ Funcionalidades

#### 🔐 Autenticación
- **Login con Email/Contraseña**: Validación y manejo de errores
- **Login con Google**: Popup de Google OAuth
- **Logout**: Cerrar sesión y limpiar estado
- **Persistencia**: Mantiene sesión activa

#### 💾 Base de Datos
- **Firestore**: Guarda perfil de usuario al primer login
- **Datos guardados**: uid, email, displayName, createdAt
- **Colección**: `users/{uid}`

#### 🎨 Interfaz
- **Diseño idéntico**: Formas azules, tema oscuro, logo BK
- **Responsive**: Adaptable a móvil y desktop
- **Animaciones**: Transiciones suaves y efectos hover
- **Dashboard**: Pantalla de bienvenida después del login

### 🔧 API Endpoints

```bash
GET  /                    # Página principal
GET  /api/health         # Estado del servidor
GET  /api/user/:uid      # Datos de usuario (placeholder)
```

### 🎯 Ventajas de HTML/CSS/JS

1. **Compatibilidad**: Funciona en cualquier navegador
2. **Rendimiento**: Carga rápida, sin bundling
3. **Simplicidad**: Fácil de mantener y debuggear
4. **Firebase**: Integración directa con SDK web
5. **Deploy**: Se puede subir a cualquier hosting estático

### 📱 Pruebas

1. **Abre `public/index.html`** directamente en el navegador
2. **O ejecuta `npm run server`** y ve a `http://localhost:3000`
3. **Prueba login** con email/contraseña o Google
4. **Verifica dashboard** después del login exitoso

### 🚀 Deploy

#### Opción 1: Hosting Estático
- Sube la carpeta `public/` a Netlify, Vercel, o GitHub Pages
- Solo necesitas `index.html` y `styles.css`

#### Opción 2: Servidor Express
- Deploy en Heroku, Railway, o DigitalOcean
- Ejecuta `npm run server` en producción

### 🎉 ¡Listo!

La aplicación está completamente funcional con:
- ✅ Login con email/contraseña
- ✅ Login con Google  
- ✅ Guardado en Firestore
- ✅ Dashboard después del login
- ✅ Logout funcional
- ✅ Diseño idéntico al original
- ✅ Backend Express opcional
