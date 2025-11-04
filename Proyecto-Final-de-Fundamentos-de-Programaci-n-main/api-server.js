const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Base de datos simulada (en producción usarías una base de datos real)
let salas = [
    {
        id: 1,
        nombre: 'Sala 201',
        tipo: 'Corporate',
        descripcion: 'Sala ideal para sesiones de estrategia empresarial y planificación. Equipada con pizarra digital y herramientas de visualización avanzadas.',
        capacidad: 6,
        imagen: '/img/sala-201.jpeg',
        disponible: true,
        equipamiento: ['Pizarra digital', 'Proyector', 'Sistema de audio', 'WiFi']
    },
    {
        id: 2,
        nombre: 'Sala 202',
        tipo: 'Cognata',
        descripcion: 'Espacio dedicado a mentoría financiera y gestión de inversiones. Perfecta para análisis de mercado y planificación económica.',
        capacidad: 6,
        imagen: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
        imagen: '/img/sala-204.jpeg',
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

let reservas = [
    {
        id: 1,
        userId: 'user_123',
        salaId: 1,
        salaNombre: 'Sala 201',
        fecha: '2024-01-15',
        horario: '10:00',
        duracion: 2,
        proposito: 'Sesión de Mentoría',
        participantes: 4,
        notas: 'Reunión de planificación estratégica',
        estado: 'confirmada',
        fechaCreacion: '2024-01-10T10:00:00Z'
    },
    {
        id: 2,
        userId: 'user_123',
        salaId: 3,
        salaNombre: 'Sala 203',
        fecha: '2024-01-16',
        horario: '14:00',
        duracion: 1.5,
        proposito: 'Trabajo en Grupo',
        participantes: 3,
        notas: 'Sesión de brainstorming',
        estado: 'confirmada',
        fechaCreacion: '2024-01-11T14:00:00Z'
    }
];

let usuarios = [
    {
        id: 'user_123',
        email: 'usuario@ejemplo.com',
        nombre: 'Usuario Demo',
        telefono: '+1234567890',
        fechaRegistro: '2024-01-01T00:00:00Z'
    }
];

// ==================== RUTAS DE PÁGINAS ====================

// Servir archivos HTML
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

app.get('/room-details', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'detalles_salas.html'));
});

app.get('/reservations', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'reservas.html'));
});

// Servir archivos estáticos
app.use('/js', express.static(path.join(__dirname, 'frontend', 'js')));
app.use('/img', express.static(path.join(__dirname, 'frontend', 'img')));

// ==================== API ENDPOINTS ====================

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API Server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// ==================== SALAS ====================

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

// ==================== HORARIOS ====================

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

// ==================== RESERVAS ====================

// Crear nueva reserva
app.post('/api/reservas', (req, res) => {
    try {
        const { salaId, fecha, horario, duracion, proposito, participantes, notas, userId } = req.body;
        
        // Validación de campos requeridos
        if (!salaId || !fecha || !horario || !duracion || !proposito || !participantes || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos'
            });
        }
        
        // Validar que la sala existe
        const sala = salas.find(s => s.id === salaId);
        if (!sala) {
            return res.status(404).json({
                success: false,
                message: 'Sala no encontrada'
            });
        }
        
        // Validar duración máxima (2 horas)
        if (parseFloat(duracion) > 2) {
            return res.status(400).json({
                success: false,
                message: 'La reserva no puede exceder 2 horas.'
            });
        }
        
        // Validar horario
        const [startHour, startMinute] = horario.split(':').map(Number);
        const durationHours = parseFloat(duracion);
        const endHour = startHour + durationHours;
        
        // Límite: las salas deben terminar a las 6:00 PM (18:00), por lo que la última hora para reservar es 5:00 PM
        if (endHour > 18 || (endHour === 18 && startMinute > 0)) {
            return res.status(400).json({
                success: false,
                message: 'La reserva excede el horario permitido. Las salas cierran a las 6:00 PM, por lo que la última hora para reservar es 5:00 PM.'
            });
        }
        
        // Verificar que el usuario no tenga otra reserva activa
        const reservaActiva = reservas.find(r => 
            r.userId === userId && 
            r.estado === 'confirmada'
        );
        
        if (reservaActiva) {
            return res.status(400).json({
                success: false,
                message: 'Ya tienes una reserva activa. Solo puedes tener una reserva a la vez.'
            });
        }
        
        // Verificar disponibilidad (simplificado)
        const conflicto = reservas.find(r => 
            r.salaId === salaId && 
            r.fecha === fecha && 
            r.estado === 'confirmada'
        );
        
        if (conflicto) {
            return res.status(409).json({
                success: false,
                message: 'La sala ya está reservada para esa fecha'
            });
        }
        
        // Crear nueva reserva
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

// Obtener todas las reservas (admin)
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

// Actualizar reserva
app.put('/api/reservas/:id', (req, res) => {
    try {
        const reservaId = parseInt(req.params.id);
        const { estado, notas } = req.body;
        
        const reservaIndex = reservas.findIndex(r => r.id === reservaId);
        if (reservaIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }
        
        // Actualizar campos permitidos
        if (estado) reservas[reservaIndex].estado = estado;
        if (notas !== undefined) reservas[reservaIndex].notas = notas;
        
        res.json({
            success: true,
            message: 'Reserva actualizada exitosamente',
            data: reservas[reservaIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la reserva',
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

// ==================== USUARIOS ====================

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

// Actualizar perfil de usuario
app.put('/api/usuarios/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, telefono } = req.body;
        
        const usuarioIndex = usuarios.findIndex(u => u.id === id);
        if (usuarioIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        // Actualizar campos
        if (nombre) usuarios[usuarioIndex].nombre = nombre;
        if (telefono) usuarios[usuarioIndex].telefono = telefono;
        
        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            data: usuarios[usuarioIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el perfil',
            error: error.message
        });
    }
});

// ==================== VALIDACIONES ====================

// Validar horario de reserva
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
        const durationHours = parseFloat(duration);
        const endHour = startHour + durationHours;
        
        // Verificar que no exceda las 6:00 PM
        if (endHour > 18 || (endHour === 18 && startMinute > 0)) {
            return res.json({
                valid: false,
                message: 'La reserva excede el horario permitido. Las salas cierran a las 6:00 PM, por lo que la última hora para reservar es 5:00 PM.'
            });
        }
        
        // Verificar duración máxima (2 horas)
        if (durationHours > 2) {
            return res.json({
                valid: false,
                message: 'La reserva no puede exceder 2 horas.'
            });
        }
        
        // Verificar horario mínimo (7:00 AM)
        if (startHour < 7) {
            return res.json({
                valid: false,
                message: 'El horario mínimo de reserva es 7:00 AM'
            });
        }
        
        return res.json({
            valid: true,
            message: 'Horario válido'
        });
    } catch (error) {
        res.status(500).json({
            valid: false,
            message: 'Error interno del servidor'
        });
    }
});

// ==================== ESTADÍSTICAS ====================

// Obtener estadísticas generales
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

// ==================== MANEJO DE ERRORES ====================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado',
        path: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
    console.log(`📚 API Endpoints:`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Salas: http://localhost:${PORT}/api/salas`);
    console.log(`   Reservas: http://localhost:${PORT}/api/reservas`);
    console.log(`   Horarios: http://localhost:${PORT}/api/horarios`);
    console.log(`   Stats: http://localhost:${PORT}/api/stats`);
    console.log(`🌐 Frontend: http://localhost:${PORT}/`);
});

module.exports = app;
