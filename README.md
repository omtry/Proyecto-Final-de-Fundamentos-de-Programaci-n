# 🎓 BK Mentorías — Sistema de Reservas de Salas

**BK Mentorías** es una aplicación desarrollada con **React Native** que permite gestionar y reservar **salas de mentoría** de forma sencilla, rápida y accesible.  
El sistema facilita la conexión entre estudiantes y mentores, permitiendo coordinar reuniones académicas en horarios disponibles.

---

## 🧭 Descripción general

El proyecto fue diseñado como una herramienta para **organizar mentorías académicas**, optimizando el uso de las salas y el tiempo de los participantes.  
Los usuarios pueden iniciar sesión, consultar disponibilidad y reservar una sala de mentoría según la fecha y hora deseada.

---

## ✨ Funcionalidades principales

- 🔐 **Autenticación de usuarios** mediante Firebase (Email/Password y Google)
- 🗓️ **Reserva de salas** por fecha y hora
- 📋 **Visualización de disponibilidad** en tiempo real
- 💾 **Registro automático de usuarios** en Firestore
- 🔄 **Persistencia de sesión**
---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso principal |
|-------------|----------------|
| **React Native (Expo)** | Desarrollo de la interfaz y compatibilidad multiplataforma |
| **Firebase Authentication** | Inicio de sesión y control de acceso |
| **Firebase Firestore** | Base de datos para reservas y usuarios |
| **React Navigation / Expo Router** | Navegación entre pantallas |

---

## ⚙️ Configuración del proyecto

1. Crea un proyecto en **Firebase**.  
2. Habilita los métodos de autenticación:
   - **Email/Password**
   - **Google**
3. Activa **Cloud Firestore** para almacenar usuarios y reservas.
4. Crea una **app web** dentro de tu proyecto de Firebase y configura las credenciales necesarias en un archivo `.env`.

> ⚠️ **Importante:** No compartas tu archivo `.env` en repositorios públicos.  
> Mantén tus credenciales seguras utilizando `.gitignore`.

---

## ▶️ Ejecución

Instala las dependencias del proyecto:

```bash
npm install