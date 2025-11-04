const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Serve HTML files with error handling
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'about.html'), (err) => {
    if (err) {
      console.error('Error serving about.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.get('/rooms', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'rooms.html'), (err) => {
    if (err) {
      console.error('Error serving rooms.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'profile.html'), (err) => {
      if (err) {
        console.error('Error serving profile.html:', err);
        res.status(500).send('Error loading page');
      }
    });
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'register.html'), (err) => {
      if (err) {
        console.error('Error serving register.html:', err);
        res.status(500).send('Error loading page');
      }
    });
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'), (err) => {
      if (err) {
        console.error('Error serving login.html:', err);
        res.status(500).send('Error loading page');
      }
    });
});

// Serve static files from frontend/js
app.use('/js', express.static(path.join(__dirname, 'frontend', 'js')));

// Serve API client from the new frontend structure
app.use('/js', express.static(path.join(__dirname, 'frontend', 'js')));

// NEW ROUTES - Add these
app.get('/room-details', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'detalles_salas.html'), (err) => {
    if (err) {
      console.error('Error serving detalles_salas.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.get('/reservations', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'reservas.html'), (err) => {
    if (err) {
      console.error('Error serving reservas.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

// Ruta para página de prueba de conexión
app.get('/test-connection', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'test-connection.html'), (err) => {
    if (err) {
      console.error('Error serving test-connection.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

// Google OAuth callback route
app.get('/auth/google/callback', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'auth', 'google', 'callback.html'), (err) => {
    if (err) {
      console.error('Error serving callback.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

// API test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date() });
});

// API route to validate booking time
app.post('/api/validate-booking', (req, res) => {
  try {
    const { startTime, duration } = req.body;
    
    if (!startTime || !duration) {
      return res.status(400).json({ 
        valid: false, 
        message: 'Hora de inicio y duración son requeridos' 
      });
    }
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const durationHours = parseInt(duration);
    
    // Calculate end time
    const endHour = startHour + durationHours;
    
    // Check if end time exceeds 4:00 PM (16:00)
    if (endHour > 16) {
      return res.json({
        valid: false,
        message: 'La reserva excede el horario permitido. Solo puedes reservar hasta las 4:00 PM.'
      });
    }
    
    return res.json({ valid: true });
  } catch (error) {
    console.error('Error validating booking:', error);
    return res.status(500).json({ 
      valid: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
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