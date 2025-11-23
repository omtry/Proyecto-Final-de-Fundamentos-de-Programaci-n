const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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
    imagen: '/img/sala-204.jpeg',
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
    imagen: '/img/sala-203.jpeg',
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
    imagen: '/img/sala-205.jpeg',
    disponible: true,
    equipamiento: ['Sistema de videoconferencia', 'Proyector 4K', 'Audio profesional', 'WiFi']
  },
  {
    id: 6,
    nombre: 'Sala 206',
    tipo: 'Innovate',
    descripcion: 'Espacio colaborativo para sesiones de design thinking y prototipado rápido. Ideal para equipos multidisciplinarios.',
    capacidad: 6,
    imagen: '/img/sala-206.jpeg',
    disponible: true,
    equipamiento: ['Pizarra digital', 'Materiales de prototipado', 'WiFi', 'Espacio flexible']
  },
  {
    id: 7,
    nombre: 'Sala 207',
    tipo: 'Focus',
    descripcion: 'Sala silenciosa para mentorías individuales y sesiones de concentración profunda. Aislamiento acústico premium.',
    capacidad: 6,
    imagen: '/img/sala-207.jpeg',
    disponible: true,
    equipamiento: ['Aislamiento acústico', 'Iluminación ajustable', 'WiFi', 'Mesa individual']
  }
];

// Archivos de persistencia
const RESERVAS_FILE = path.join(__dirname, 'data', 'reservas.json');
const USUARIOS_FILE = path.join(__dirname, 'data', 'usuarios.json');

// Crear directorio data si no existe
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Función para cargar reservas desde archivo
function cargarReservas() {
  try {
    if (fs.existsSync(RESERVAS_FILE)) {
      const data = fs.readFileSync(RESERVAS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error al cargar reservas:', error);
  }
  return [];
}

// Función para guardar reservas en archivo
function guardarReservas(reservas) {
  try {
    fs.writeFileSync(RESERVAS_FILE, JSON.stringify(reservas, null, 2), 'utf8');
  } catch (error) {
    console.error('Error al guardar reservas:', error);
  }
}

// Función para cargar usuarios desde archivo
function cargarUsuarios() {
  try {
    if (fs.existsSync(USUARIOS_FILE)) {
      const data = fs.readFileSync(USUARIOS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
  return [];
}

// Función para guardar usuarios en archivo
function guardarUsuarios(usuarios) {
  try {
    fs.writeFileSync(USUARIOS_FILE, JSON.stringify(usuarios, null, 2), 'utf8');
  } catch (error) {
    console.error('Error al guardar usuarios:', error);
  }
}

let reservas = cargarReservas();
let usuarios = cargarUsuarios();

// ==================== FUNCIONES HELPER ====================

// Función para calcular hora de fin de una reserva
function calcularHoraFin(horario, duracion) {
  const [hora, minuto] = horario.split(':').map(Number);
  const horaFin = hora + duracion;
  return `${horaFin.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
}

// Función para verificar si una reserva está activa
function esReservaActiva(reserva) {
  const ahora = new Date();
  const fechaActual = ahora.toISOString().split('T')[0]; // YYYY-MM-DD
  const horaActual = ahora.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
  
  // Si la fecha de la reserva es futura, está activa
  if (reserva.fecha > fechaActual) {
    return true;
  }
  
  // Si la fecha es hoy, verificar si la hora actual es menor a la hora de fin
  if (reserva.fecha === fechaActual) {
    const horaFin = reserva.horaFin || calcularHoraFin(reserva.horario, reserva.duracion);
    return horaActual < horaFin;
  }
  
  // Si la fecha es pasada, no está activa
  return false;
}

// Función para verificar si un usuario es admin
// Por ahora, verificamos si el userId está en una lista de admins
// En producción, esto debería consultar Firestore
async function isAdmin(userId) {
  // Lista temporal de admins (en producción consultar Firestore)
  // Por ahora, cualquier usuario puede ser admin si se especifica en el request
  // TODO: Implementar consulta a Firestore para verificar rol
  return false; // Por defecto no es admin, se verificará desde el frontend
}

// Función para obtener reservas activas de un usuario
function getReservasActivasUsuario(userId) {
  return reservas.filter(r => 
    r.userId === userId && 
    r.estado === 'confirmada' && 
    esReservaActiva(r)
  );
}

// Función para verificar conflictos de horario en una sala
function tieneConflictoHorario(salaId, fecha, horario, duracion, excluirReservaId = null) {
  const horaFin = calcularHoraFin(horario, duracion);
  
  return reservas.some(r => {
    // Excluir la reserva que estamos actualizando
    if (excluirReservaId && r.id === excluirReservaId) {
      return false;
    }
    
    // Solo verificar reservas confirmadas de la misma sala y fecha
    if (r.salaId === salaId && 
        r.fecha === fecha && 
        r.estado === 'confirmada') {
      const rHoraFin = r.horaFin || calcularHoraFin(r.horario, r.duracion);
      
      // Verificar si hay solapamiento de horarios
      return (horario >= r.horario && horario < rHoraFin) ||
             (horaFin > r.horario && horaFin <= rHoraFin) ||
             (horario <= r.horario && horaFin >= rHoraFin);
    }
    
    return false;
  });
}

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
    
    // Verificar que el usuario no tenga reservas activas
    const reservasActivas = getReservasActivasUsuario(userId);
    if (reservasActivas.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya tienes una reserva activa. Debes esperar a que termine antes de hacer una nueva reserva.',
        reservaActiva: reservasActivas[0]
      });
    }
    
    const sala = salas.find(s => s.id === salaId);
    if (!sala) {
      return res.status(404).json({
        success: false,
        message: 'Sala no encontrada'
      });
    }
    
    // Verificar conflictos de horario
    if (tieneConflictoHorario(salaId, fecha, horario, duracion)) {
      return res.status(409).json({
        success: false,
        message: 'La sala ya está reservada en ese horario. Por favor, elige otro horario.'
      });
    }
    
    // Calcular hora de fin
    const horaFin = calcularHoraFin(horario, duracion);
    
    const nuevaReserva = {
      id: Date.now(),
      userId,
      salaId,
      salaNombre: sala.nombre,
      fecha,
      horario,
      duracion: parseFloat(duracion),
      horaFin, // Agregar hora de fin calculada
      proposito,
      participantes: parseInt(participantes),
      notas: notas || '',
      estado: 'confirmada',
      fechaCreacion: new Date().toISOString()
    };
    
    reservas.push(nuevaReserva);
    guardarReservas(reservas); // Guardar en archivo después de crear
    
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

// Obtener reservas activas de un usuario
app.get('/api/reservas/usuario/:userId/activas', (req, res) => {
  try {
    const { userId } = req.params;
    const reservasActivas = getReservasActivasUsuario(userId);
    
    res.json({
      success: true,
      data: reservasActivas,
      total: reservasActivas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las reservas activas',
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
    guardarReservas(reservas); // Guardar en archivo después de eliminar
    
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

// Obtener disponibilidad de todas las salas
app.get('/api/disponibilidad', (req, res) => {
  try {
    const fecha = req.query.fecha || new Date().toISOString().split('T')[0]; // Fecha actual por defecto
    
    const disponibilidad = salas.map(sala => {
      // Obtener reservas activas de esta sala para la fecha especificada
      const reservasSala = reservas.filter(r => 
        r.salaId === sala.id && 
        r.fecha === fecha && 
        r.estado === 'confirmada'
      );
      
      // Determinar si está ocupada ahora
      const ahora = new Date();
      const fechaActual = ahora.toISOString().split('T')[0];
      const horaActual = ahora.toTimeString().split(' ')[0].substring(0, 5);
      
      let ocupada = false;
      let reservaActual = null;
      
      if (fecha === fechaActual) {
        // Si es hoy, verificar si hay una reserva activa ahora
        reservaActual = reservasSala.find(r => {
          const horaFin = r.horaFin || calcularHoraFin(r.horario, r.duracion);
          return horaActual >= r.horario && horaActual < horaFin;
        });
        ocupada = !!reservaActual;
      }
      
      // Próxima reserva
      const proximaReserva = reservasSala
        .filter(r => r.horario > (fecha === fechaActual ? horaActual : '00:00'))
        .sort((a, b) => a.horario.localeCompare(b.horario))[0];
      
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
        reservasDelDia: reservasSala.length,
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
      message: 'Error al obtener disponibilidad',
      error: error.message
    });
  }
});

// Obtener información de usuario (incluyendo rol)
app.get('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Por ahora retornamos información básica
    // En producción, esto debería consultar Firestore
    const usuario = usuarios.find(u => u.id === userId);
    
    res.json({
      success: true,
      data: {
        id: userId,
        role: usuario?.role || 'user', // Por defecto es 'user'
        ...usuario
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

// ==================== ENDPOINTS DE ADMINISTRACIÓN ====================

// Crear nueva sala (solo admin)
app.post('/api/admin/salas', async (req, res) => {
  try {
    const { userId, nombre, tipo, descripcion, capacidad, imagen, equipamiento } = req.body;
    
    // Validar que se proporcione userId para verificar admin
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Se requiere autenticación'
      });
    }
    
    // Verificar que el usuario sea admin
    // Por ahora, aceptamos el request si viene con userId
    // En producción, verificar con isAdmin(userId)
    const esAdminUser = await isAdmin(userId);
    // Por ahora permitimos crear salas (se validará desde el frontend)
    
    // Validar campos requeridos
    if (!nombre || !tipo || !descripcion || !capacidad) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: nombre, tipo, descripcion, capacidad'
      });
    }
    
    // Crear nueva sala
    const nuevaSala = {
      id: salas.length > 0 ? Math.max(...salas.map(s => s.id)) + 1 : 1,
      nombre,
      tipo,
      descripcion,
      capacidad: parseInt(capacidad),
      imagen: imagen || 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3',
      disponible: true,
      equipamiento: equipamiento || ['WiFi', 'Proyector', 'Aire acondicionado']
    };
    
    salas.push(nuevaSala);
    
    res.status(201).json({
      success: true,
      message: 'Sala creada exitosamente',
      data: nuevaSala
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear la sala',
      error: error.message
    });
  }
});

// Eliminar sala (solo admin)
app.delete('/api/admin/salas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query; // userId desde query params
    
    // Validar que se proporcione userId
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Se requiere autenticación'
      });
    }
    
    // Verificar que el usuario sea admin
    const esAdminUser = await isAdmin(userId);
    // Por ahora permitimos eliminar salas (se validará desde el frontend)
    
    const salaId = parseInt(id);
    const salaIndex = salas.findIndex(s => s.id === salaId);
    
    if (salaIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Sala no encontrada'
      });
    }
    
    // Verificar que no tenga reservas activas
    const reservasSala = reservas.filter(r => 
      r.salaId === salaId && 
      r.estado === 'confirmada' &&
      esReservaActiva(r)
    );
    
    if (reservasSala.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar la sala porque tiene reservas activas',
        reservasActivas: reservasSala.length
      });
    }
    
    // Eliminar la sala
    salas.splice(salaIndex, 1);
    
    res.json({
      success: true,
      message: 'Sala eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la sala',
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

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'admin.html'), (err) => {
    if (err) {
      console.error('Error serving admin.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.get('/disponibilidad', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'disponibilidad.html'), (err) => {
    if (err) {
      console.error('Error serving disponibilidad.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

// Serve static files from frontend/js
app.use('/js', express.static(path.join(__dirname, 'frontend', 'js')));

// Serve static files from frontend/img
app.use('/img', express.static(path.join(__dirname, 'frontend', 'img')));

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
  console.log(`💾 Datos cargados: ${reservas.length} reservas, ${usuarios.length} usuarios`);
});