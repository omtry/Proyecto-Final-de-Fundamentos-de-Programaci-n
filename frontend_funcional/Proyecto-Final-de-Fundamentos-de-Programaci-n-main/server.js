const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'about.html'));
});

app.get('/rooms', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'rooms.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'profile.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

// NEW ROUTES - Add these
app.get('/room-details', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'detalles_salas.html'));
});

app.get('/reservations', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'reservas.html'));
});

// API test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 BK Server running on http://localhost:${PORT}`);
  console.log(`🌐 Website routes:`);
  console.log(`   Home: http://localhost:${PORT}/`);
  console.log(`   About: http://localhost:${PORT}/about`);
  console.log(`   Rooms: http://localhost:${PORT}/rooms`);
  console.log(`   Profile: http://localhost:${PORT}/profile`);
  console.log(`   Login: http://localhost:${PORT}/login`);
  console.log(`   Register: http://localhost:${PORT}/register`);
  console.log(`   Room Details: http://localhost:${PORT}/room-details`);
  console.log(`   Reservations: http://localhost:${PORT}/reservations`);
  console.log(`📡 API Test: http://localhost:${PORT}/api/test`);
});