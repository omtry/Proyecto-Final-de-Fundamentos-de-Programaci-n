<h1 align="center">🎓 Proyecto Final de Fundamentos de Programación</h1>
<h3 align="center">💻 Sistema de Reservas de Salas de Mentorías Universitarias</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/React-Frontend-61DBFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Database-MongoDB-success?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
</p>

---

## 🧠 Descripción

Este proyecto es una **aplicación web Full Stack** desarrollada con **Node.js**, **Express** y **React**.  
Su propósito es permitir la **reserva, administración y control de salas de mentorías** para Key Institute,  
optimizando el uso de espacios para reuniones entre estudiantes y mentores.

---

## 🚀 Tecnologías Principales

### 🔧 Backend
- **Node.js + Express.js**
- **MongoDB (Mongoose)**
- **Autenticación JWT + Google OAuth**
- **dotenv**, **cors**, **bcrypt**
- Pruebas con **Jest / Supertest**

### 💻 Frontend
- **React + TypeScript**
- **Axios** para peticiones HTTP
- **Firebase Authentication**
- **React Router DOM**
- **TailwindCSS / Bootstrap** para diseño responsivo

---

## 🗂️ Estructura del Proyecto

```bash
Proyecto-Final-de-Fundamentos-de-Programacion/
├── backend/                  # Lógica del servidor (Express)
│   ├── controllers/          # Controladores de rutas
│   ├── models/               # Modelos de datos (Mongoose)
│   ├── routes/               # Endpoints de la API
│   ├── config/               # Configuración de base de datos y entorno
│   └── server.js             # Punto de entrada del backend
│
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── hooks/            # Hooks personalizados
│   │   ├── pages/            # Vistas principales
│   │   └── services/         # Comunicación con el backend
│   └── package.json
│
├── app/                      # Integración global del sistema
├── assets/                   # Recursos estáticos
├── config/                   # Configuraciones (Firebase, OAuth)
├── constants/                # Variables globales
├── integrated-server.js      # Versión combinada backend + frontend
├── firebase.ts               # Configuración de Firebase
├── package.json
└── README.md


## ⚙️ Instalación y Configuración

### 🔹 1. Clonar el repositorio
```bash
git clone https://github.com/omtry/Proyecto-Final-de-Fundamentos-de-Programaci-n.git
cd Proyecto-Final-de-Fundamentos-de-Programaci-n

---
### 🔹 2. Instalar dependencias
Backend
cd backend
npm install

Frontend
cd ../frontend
npm install
---
## 🔹 3. Ejecución del Proyecto
🧩 Ejecutar el Backend
cd backend
npm run dev

🧩 Ejecutar el Frontend
cd frontend
npm run dev
---

💡 Mejoras Futuras

🚀 Integrar notificaciones por correo electrónico
📊 Agregar estadísticas de uso de salas
🔐 Mejorar el control de roles y permisos
