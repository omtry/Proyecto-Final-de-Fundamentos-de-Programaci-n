const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ==================== API ENDPOINTS (DEBEN IR ANTES DE STATIC) ====================

// Base de datos simulada (en producción usarías una base de datos real)
let salas = [
  {
    id: 1,
    nombre: 'Sala 201',
    tipo: 'Corporate',
    descripcion: 'Sala ideal para sesiones de estrategia empresarial y planificación. Equipada con pizarra digital y herramientas de visualización avanzadas.',
    capacidad: 6,
    imagen: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    disponible: true,
    equipamiento: ['Pizarra digital', 'Proyector', 'Sistema de audio', 'WiFi']
  },
  {
    id: 2,
    nombre: 'Sala 202',
    tipo: 'Cognata',
    descripcion: 'Espacio dedicado a mentoría financiera y gestión de inversiones. Perfecta para análisis de mercado y planificación económica.',
    capacidad: 6,
    imagen: 'https://images.unsplash.com/photo-1568992688065-536aad8a12f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    disponible: true,
    equipamiento: ['Pantallas LED', 'Sistema de videoconferencia', 'WiFi', 'Aire acondicionado']
  },
  {
    id: 3,
    nombre: 'Sala 203',
    tipo: 'Importe',
    descripcion: 'Sala de resolución de problemas y pensamiento creativo. Ideal para sesiones de innovación y desarrollo de soluciones.',
    capacidad: 6,
    imagen: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    disponible: true,
    equipamiento: ['Pizarra blanca', 'Marcadores', 'WiFi', 'Mesa colaborativa']
  },
  {
    id: 4,
    nombre: 'Sala 204',
    tipo: 'Cognata',
    descripcion: 'Espacio tecnológico para mentoría en programación y desarrollo de software. Equipada con estaciones de trabajo especializadas.',
    capacidad: 6,
    imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    disponible: true,
    equipamiento: ['Computadoras', 'Monitores duales', 'WiFi', 'Software especializado']
  },
  {
    id: 5,
    nombre: 'Sala 205',
    tipo: 'Corporate',
    descripcion: 'Sala multimedia para presentaciones ejecutivas y reuniones de alto nivel. Equipada con sistema de videoconferencia profesional.',
    capacidad: 6,
    imagen: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    disponible: true,
    equipamiento: ['Sistema de videoconferencia', 'Proyector 4K', 'Audio profesional', 'WiFi']
  },
  {
    id: 6,
    nombre: 'Sala 206',
    tipo: 'Innovate',
    descripcion: 'Espacio colaborativo para sesiones de design thinking y prototipado rápido. Ideal para equipos multidisciplinarios.',
    capacidad: 6,
    imagen: 'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    disponible: true,
    equipamiento: ['Pizarra digital', 'Materiales de prototipado', 'WiFi', 'Espacio flexible']
  },
  {
    id: 7,
    nombre: 'Sala 207',
    tipo: 'Focus',
    descripcion: 'Sala silenciosa para mentorías individuales y sesiones de concentración profunda. Aislamiento acústico premium.',
    capacidad: 6,
    imagen: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    disponible: true,
    equipamiento: ['Aislamiento acústico', 'Iluminación ajustable', 'WiFi', 'Mesa individual']
  }
];

let reservas = [];
let usuarios = [];

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Obtener todas las salas
app.get('/api/salas', (req, res) => {
  try {
    res.json({
      success: true,
      data: salas,
      total: salas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las salas',
      error: error.message
    });
  }
});

// Obtener sala por ID
app.get('/api/salas/:id', (req, res) => {
  try {
    const salaId = parseInt(req.params.id);
    const sala = salas.find(s => s.id === salaId);
    
    if (!sala) {
      return res.status(404).json({
        success: false,
        message: 'Sala no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: sala
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la sala',
      error: error.message
    });
  }
});

// Obtener horarios disponibles
app.get('/api/horarios', (req, res) => {
  try {
    const horarios = [
      '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00'
    ];
    
    res.json({
      success: true,
      data: horarios
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener horarios',
      error: error.message
    });
  }
});

// Crear nueva reserva
app.post('/api/reservas', (req, res) => {
  try {
    const { salaId, fecha, horario, duracion, proposito, participantes, notas, userId } = req.body;
    
    if (!salaId || !fecha || !horario || !duracion || !proposito || !participantes || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos'
      });
    }
    
    const sala = salas.find(s => s.id === salaId);
    if (!sala) {
      return res.status(404).json({
        success: false,
        message: 'Sala no encontrada'
      });
    }
    
    const nuevaReserva = {
      id: Date.now(),
      userId,
      salaId,
      salaNombre: sala.nombre,
      fecha,
      horario,
      duracion: parseFloat(duracion),
      proposito,
      participantes: parseInt(participantes),
      notas: notas || '',
      estado: 'confirmada',
      fechaCreacion: new Date().toISOString()
    };
    
    reservas.push(nuevaReserva);
    
    res.status(201).json({
      success: true,
      message: 'Reserva creada exitosamente',
      data: nuevaReserva
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear la reserva',
      error: error.message
    });
  }
});

// Obtener reservas de un usuario
app.get('/api/reservas/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const reservasUsuario = reservas.filter(r => r.userId === userId);
    
    res.json({
      success: true,
      data: reservasUsuario,
      total: reservasUsuario.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las reservas',
      error: error.message
    });
  }
});

// Obtener todas las reservas
app.get('/api/reservas', (req, res) => {
  try {
    res.json({
      success: true,
      data: reservas,
      total: reservas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las reservas',
      error: error.message
    });
  }
});

// Cancelar reserva
app.delete('/api/reservas/:id', (req, res) => {
  try {
    const reservaId = parseInt(req.params.id);
    const reservaIndex = reservas.findIndex(r => r.id === reservaId);
    
    if (reservaIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }
    
    reservas.splice(reservaIndex, 1);
    
    res.json({
      success: true,
      message: 'Reserva cancelada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cancelar la reserva',
      error: error.message
    });
  }
});

// Obtener perfil de usuario
app.get('/api/usuarios/:id', (req, res) => {
  try {
    const { id } = req.params;
    const usuario = usuarios.find(u => u.id === id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: usuario
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el usuario',
      error: error.message
    });
  }
});

// Obtener estadísticas
app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      totalSalas: salas.length,
      salasDisponibles: salas.filter(s => s.disponible).length,
      totalReservas: reservas.length,
      reservasConfirmadas: reservas.filter(r => r.estado === 'confirmada').length,
      totalUsuarios: usuarios.length
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
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

// ==================== SERVIR ARCHIVOS ESTÁTICOS Y HTML ====================

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

app.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'forgot-password.html'), (err) => {
      if (err) {
        console.error('Error serving forgot-password.html:', err);
        res.status(500).send('Error loading page');
      }
    });
});

// Serve static files from frontend/js
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

// Google OAuth callback route
app.get('/auth/google/callback', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'auth', 'google', 'callback.html'), (err) => {
    if (err) {
      console.error('Error serving callback.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

// 404 handler - Devuelve JSON para rutas de API, HTML para páginas
app.use((req, res) => {
  // Si es una ruta de API, devolver JSON
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: 'Endpoint no encontrado',
      path: req.path
    });
  }
  // Si no es API, devolver HTML
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