require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Reserva = require('./models/Reserva');

const app = express();

// ==================== CONFIGURACIÓN ====================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Mentorias';
const PORT = process.env.PORT || 3001;

// ==================== CONEXIÓN A MONGODB ====================
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar MongoDB:', err));

// ==================== MIDDLEWARES ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/js', express.static(path.join(__dirname, 'frontend', 'js')));

// Helper para servir páginas del frontend
const servePage = (filename) => (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', filename), (err) => {
    if (err) {
      console.error(`Error serving ${filename}:`, err);
      res.status(500).send('Error loading page');
    }
  });
};

// ==================== RUTAS FRONTEND ====================
app.get('/', servePage('index.html'));
app.get('/about', servePage('about.html'));
app.get('/rooms', servePage('rooms.html'));
app.get('/profile', servePage('profile.html'));
app.get('/register', servePage('register.html'));
app.get('/login', servePage('login.html'));
app.get('/room-details', servePage('detalles_salas.html'));
app.get('/reservations', servePage('reservas.html'));
app.get('/auth/google/callback', servePage(path.join('auth', 'google', 'callback.html')));

// ==================== SALAS (CATÁLOGO) ====================
const salas = [
  {
    id: 1,
    nombre: 'Sala 201',
    tipo: 'Focus',
    descripcion: 'Sala para mentorías uno a uno y trabajo concentrado.',
    capacidad: 4,
    imagen: '/img/201.jpeg',
    disponible: true,
    equipamiento: ['Pizarra blanca', 'WiFi']
  },
  {
    id: 2,
    nombre: 'Sala 202',
    tipo: 'Team',
    descripcion: 'Sala para trabajo en equipo y pequeñas reuniones.',
    capacidad: 6,
    imagen: '/img/202.jpeg',
    disponible: true,
    equipamiento: ['Pantalla', 'Pizarra', 'WiFi']
  },
  {
    id: 3,
    nombre: 'Sala 203',
    tipo: 'Think',
    descripcion: 'Sala para sesiones de ideas y resolución de problemas.',
    capacidad: 6,
    imagen: '/img/sala-203.jpeg',
    disponible: true,
    equipamiento: ['Pizarra', 'WiFi', 'Mesa colaborativa']
  },
  {
    id: 4,
    nombre: 'Sala 204',
    tipo: 'Tech',
    descripcion: 'Sala con PCs para mentorías de programación.',
    capacidad: 6,
    imagen: '/img/sala-204.jpeg',
    disponible: true,
    equipamiento: ['Computadoras', 'Monitores', 'WiFi']
  },
  {
    id: 5,
    nombre: 'Sala 205',
    tipo: 'Corporate',
    descripcion: 'Sala para presentaciones y videoconferencias.',
    capacidad: 6,
    imagen: '/img/sala-205.jpeg',
    disponible: true,
    equipamiento: ['Proyector', 'Audio', 'WiFi']
  },
  {
    id: 6,
    nombre: 'Sala 206',
    tipo: 'Innovate',
    descripcion: 'Sala creativa para diseño y proyectos.',
    capacidad: 6,
    imagen: '/img/sala-206.jpeg',
    disponible: true,
    equipamiento: ['Pizarras', 'WiFi']
  },
  {
    id: 7,
    nombre: 'Sala 207',
    tipo: 'Lab',
    descripcion: 'Sala tipo laboratorio para pruebas técnicas.',
    capacidad: 4,
    imagen: '/img/sala-207.jpeg',
    disponible: true,
    equipamiento: ['Mesas', 'WiFi']
  }
];

// ==================== HELPERS DE RESERVAS ====================

// Calcula la hora de fin dado un horario "HH:MM" y duración en horas
function calcularHoraFin(horario, duracionHoras) {
  const [h, m] = horario.split(':').map(Number);
  const total = h * 60 + m + Number(duracionHoras) * 60;
  const hh = String(Math.floor(total / 60)).padStart(2, '0');
  const mm = String(total % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

// Determina si una reserva está activa en este momento
function esReservaActiva(reserva) {
  const ahora = new Date();
  const fechaActual = ahora.toISOString().split('T')[0];
  const horaActual = ahora.toTimeString().slice(0, 5); // "HH:MM"

  if (reserva.fecha !== fechaActual || reserva.estado !== 'confirmada') return false;

  const horaFin = reserva.horaFin || calcularHoraFin(reserva.horario, reserva.duracion);
  return horaActual >= reserva.horario && horaActual < horaFin;
}

// Reservas activas de un usuario (usa Mongo)
async function getReservasActivasUsuario(userId) {
  const reservas = await Reserva.find({
    userId,
    estado: 'confirmada'
  }).lean();

  return reservas.filter(r => esReservaActiva(r));
}

// Verifica si hay conflicto de horario en una sala
async function tieneConflictoHorario({ salaId, fecha, horario, duracion, excluirReservaId = null }) {
  const horaFin = calcularHoraFin(horario, duracion);

  const query = {
    salaId,
    fecha,
    estado: 'confirmada'
  };

  if (excluirReservaId) {
    query.id = { $ne: excluirReservaId };
  }

  const reservasSala = await Reserva.find(query).lean();

  return reservasSala.some(r => {
    const rHoraFin = r.horaFin || calcularHoraFin(r.horario, r.duracion);

    return (
      (horario >= r.horario && horario < rHoraFin) ||  // inicio dentro
      (horaFin > r.horario && horaFin <= rHoraFin) ||  // fin dentro
      (horario <= r.horario && horaFin >= rHoraFin)    // solapa totalmente
    );
  });
}

// ==================== RUTAS API ====================

// Test simple
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date() });
});

// ==================== SALAS ====================

// GET /api/salas  -> lista todas las salas
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

// GET /api/salas/:id  -> sala por ID
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


// ==================== HORARIOS ====================

app.get('/api/horarios', (req, res) => {
  try {
    // Reservas desde las 8:00 hasta las 17:00 (5 PM)
    const horarios = [
      '08:00', '09:00', '10:00', '11:00', '12:00',
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


// ==================== VALIDACIÓN DE HORARIO (YA EXISTENTE) ====================

/**
 * Validate booking end time.
 * Request body: { startTime: "HH:mm", duration: number (hours) }
 * The system allows reservations up to 16:00 (4 PM) inclusive.
 */
app.post('/api/validate-booking', (req, res) => {
  try {
    const { startTime, duration } = req.body;

    if (!startTime || (duration === undefined || duration === null)) {
      return res.status(400).json({
        valid: false,
        message: 'Hora de inicio y duración son requeridos',
      });
    }

    const [startHour, startMinute] = startTime.split(':').map(Number);
    if (Number.isNaN(startHour) || Number.isNaN(startMinute)) {
      return res.status(400).json({
        valid: false,
        message: 'Formato de hora inválido. Use HH:mm',
      });
    }

    const durationHours = parseFloat(duration);
    if (Number.isNaN(durationHours) || durationHours <= 0) {
      return res.status(400).json({
        valid: false,
        message: 'Duración inválida',
      });
    }

    // Minutes based check to support fractional durations in hours
    const startMinutesTotal = startHour * 60 + startMinute;
    const endMinutesTotal = startMinutesTotal + Math.round(durationHours * 60);

    // 🔹 Ahora permitimos reservas hasta las 18:00 (6 PM)
    const lastAllowedMinutes = 18 * 60; // 18:00
    if (endMinutesTotal > lastAllowedMinutes) {
      return res.json({
        valid: false,
        message: 'La reserva excede el horario permitido. Solo puedes usar la sala hasta las 6:00 PM.'
      });
    }

    return res.json({ valid: true });
  } catch (error) {
    console.error('Error validating booking:', error);
    return res.status(500).json({
      valid: false,
      message: 'Error interno del servidor',
    });
  }
});


// ==================== RESERVAS ====================

// Crear nueva reserva
app.post('/api/reservas', async (req, res) => {
  try {
    const { salaId, fecha, horario, duracion, proposito, participantes, notas, userId, userName, userEmail } = req.body;

    if (!salaId || !fecha || !horario || !duracion || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos'
      });
    }

    const sala = salas.find(s => s.id === parseInt(salaId));
    if (!sala) {
      return res.status(404).json({
        success: false,
        message: 'Sala no encontrada'
      });
    }

    // Limite de 2 reservas activas por usuario
    const reservasActivas = await getReservasActivasUsuario(userId);
    if (reservasActivas.length >= 2) {
      return res.status(400).json({
        success: false,
        message: 'Ya tienes 2 reservas activas. Debes cancelar una antes de crear otra.'
      });
    }

    // Verificar conflicto de horario
    const hayConflicto = await tieneConflictoHorario({
      salaId: parseInt(salaId),
      fecha,
      horario,
      duracion: parseFloat(duracion)
    });

    if (hayConflicto) {
      return res.status(409).json({
        success: false,
        message: 'La sala ya está reservada en ese horario. Por favor, elige otro horario.'
      });
    }

    // Calcular hora de fin
    const horaFin = calcularHoraFin(horario, duracion);

    const nuevaReserva = await Reserva.create({
      id: Date.now(), // ID numérico para el frontend
      userId,
      userName: userName || 'Usuario',
      userEmail: userEmail || '',
      salaId: parseInt(salaId),
      salaNombre: sala.nombre,
      fecha,
      horario,
      duracion: parseFloat(duracion),
      horaFin,
      proposito: proposito || 'Sesión de mentoría',
      participantes: participantes ? parseInt(participantes) : 1,
      notas: notas || '',
      estado: 'confirmada',
      fechaCreacion: new Date()
    });

    res.json({
      success: true,
      data: nuevaReserva
    });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la reserva',
      error: error.message
    });
  }
});

// Obtener todas las reservas
app.get('/api/reservas', async (req, res) => {
  try {
    const reservas = await Reserva.find().sort({ fechaCreacion: -1 });

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

// Reservas activas de un usuario (esta ruta debe ir ANTES de /api/reservas/:userId)
app.get('/api/reservas/usuario/:userId/activas', async (req, res) => {
  try {
    const { userId } = req.params;
    const reservasActivas = await getReservasActivasUsuario(userId);

    res.json({
      success: true,
      data: reservasActivas,
      total: reservasActivas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener reservas activas',
      error: error.message
    });
  }
});

// Obtener reservas de un usuario
app.get('/api/reservas/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const reservasUsuario = await Reserva.find({ userId }).sort({ fechaCreacion: -1 });

    res.json({
      success: true,
      data: reservasUsuario
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las reservas del usuario',
      error: error.message
    });
  }
});

// Actualizar reserva
app.put('/api/reservas/:id', async (req, res) => {
  try {
    const reservaId = parseInt(req.params.id);
    const datos = req.body;

    const reserva = await Reserva.findOne({ id: reservaId });
    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }

    // Si cambia horario/duración/fecha/sala, revisar conflictos
    const salaId = datos.salaId || reserva.salaId;
    const fecha = datos.fecha || reserva.fecha;
    const horario = datos.horario || reserva.horario;
    const duracion = datos.duracion || reserva.duracion;

    const hayConflicto = await tieneConflictoHorario({
      salaId,
      fecha,
      horario,
      duracion,
      excluirReservaId: reservaId
    });

    if (hayConflicto) {
      return res.status(409).json({
        success: false,
        message: 'La sala ya está reservada en ese horario.'
      });
    }

    if (datos.horario || datos.duracion) {
      datos.horaFin = calcularHoraFin(horario, duracion);
    }

    const reservaActualizada = await Reserva.findOneAndUpdate(
      { id: reservaId },
      datos,
      { new: true }
    );

    res.json({
      success: true,
      data: reservaActualizada
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la reserva',
      error: error.message
    });
  }
});

// Eliminar / cancelar reserva
app.delete('/api/reservas/:id', async (req, res) => {
  try {
    const reservaId = parseInt(req.params.id);

    const reservaEliminada = await Reserva.findOneAndDelete({ id: reservaId });

    if (!reservaEliminada) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Reserva eliminada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la reserva',
      error: error.message
    });
  }
});

// ==================== DISPONIBILIDAD ====================

app.get('/api/disponibilidad', async (req, res) => {
  try {
    const fecha = req.query.fecha || new Date().toISOString().split('T')[0];

    const reservasFecha = await Reserva.find({
      fecha,
      estado: 'confirmada'
    }).lean();

    const ahora = new Date();
    const fechaActual = ahora.toISOString().split('T')[0];
    const horaActual = ahora.toTimeString().slice(0, 5);

    const disponibilidad = salas.map(sala => {
      const reservasSala = reservasFecha.filter(r => r.salaId === sala.id);

      let ocupada = false;
      let reservaActual = null;

      if (fecha === fechaActual) {
        reservaActual = reservasSala.find(r => {
          const horaFin = r.horaFin || calcularHoraFin(r.horario, r.duracion);
          return horaActual >= r.horario && horaActual < horaFin;
        });
        ocupada = !!reservaActual;
      }

      const proximaReserva = reservasSala
        .filter(r => r.horario > (fecha === fechaActual ? horaActual : '00:00'))
        .sort((a, b) => a.horario.localeCompare(b.horario))[0] || null;

      return {
        sala: {
          id: sala.id,
          nombre: sala.nombre,
          tipo: sala.tipo,
          capacidad: sala.capacidad
        },
        ocupada,
        reservaActual: reservaActual ? {
          id: reservaActual.id,
          horario: reservaActual.horario,
          horaFin: reservaActual.horaFin || calcularHoraFin(reservaActual.horario, reservaActual.duracion),
          proposito: reservaActual.proposito
        } : null,
        proximaReserva: proximaReserva ? {
          id: proximaReserva.id,
          horario: proximaReserva.horario,
          horaFin: proximaReserva.horaFin || calcularHoraFin(proximaReserva.horario, proximaReserva.duracion),
          proposito: proximaReserva.proposito
        } : null,
        totalReservasHoy: reservasSala.length,
        horariosOcupados: reservasSala.map(r => ({
          inicio: r.horario,
          fin: r.horaFin || calcularHoraFin(r.horario, r.duracion)
        }))
      };
    });

    res.json({
      success: true,
      data: disponibilidad,
      fecha
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la disponibilidad',
      error: error.message
    });
  }
});

// ==================== USER BÁSICO (para verificarAdmin) ====================

app.get('/api/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    res.json({
      success: true,
      data: {
        id: userId,
        role: 'user' // aquí luego puedes agregar lógica para admins
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener información del usuario',
      error: error.message
    });
  }
});

// ==================== STATS Y HEALTH (usados por el frontend) ====================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

app.get('/api/stats', async (req, res) => {
  try {
    const totalReservas = await Reserva.countDocuments();
    const totalUsuarios = (await Reserva.distinct('userId')).length;

    res.json({
      success: true,
      data: {
        totalReservas,
        totalUsuarios
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

// ==================== 404 Y MANEJO DE ERRORES ====================

// 404 handler -> enviar index (SPA) o página principal
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Error handler centralizado
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== INICIO DEL SERVIDOR ====================
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
