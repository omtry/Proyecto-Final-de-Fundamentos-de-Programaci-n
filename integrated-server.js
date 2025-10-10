const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Servir archivos estáticos del frontend móvil
app.use('/mobile', express.static(path.join(__dirname, 'public')));

// Servir archivos estáticos del backend HTML
app.use('/backend', express.static(path.join(__dirname, 'Salas de mentoría')));

// Ruta principal - redirige al frontend móvil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutas del backend HTML
// API Routes para el frontend móvil
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Integrated BK Server is running',
        timestamp: new Date().toISOString(),
        services: {
            mobile: 'http://localhost:3000/mobile',
            backend: 'http://localhost:3000/backend'
        }
    });
});

// API para obtener salas (para el frontend móvil)
app.get('/api/salas', (req, res) => {
    const salas = [
        {
            id: 1,
            nombre: 'Sala 201',
            tipo: 'Corporate',
            descripcion: 'Sala ideal para sesiones de estrategia empresarial y planificación. Equipada con pizarra digital y herramientas de visualización avanzadas.',
            capacidad: 6,
            imagen: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            disponible: true
        },
        {
            id: 2,
            nombre: 'Sala 202',
            tipo: 'Cognata',
            descripcion: 'Espacio dedicado a mentoría financiera y gestión de inversiones. Perfecta para análisis de mercado y planificación económica.',
            capacidad: 6,
            imagen: 'https://images.unsplash.com/photo-1568992688065-536aad8a12f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            disponible: true
        },
        {
            id: 3,
            nombre: 'Sala 203',
            tipo: 'Importe',
            descripcion: 'Sala de resolución de problemas y pensamiento creativo. Ideal para sesiones de innovación y desarrollo de soluciones.',
            capacidad: 6,
            imagen: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            disponible: true
        },
        {
            id: 4,
            nombre: 'Sala 204',
            tipo: 'Cognata',
            descripcion: 'Espacio tecnológico para mentoría en programación y desarrollo de software. Equipada con estaciones de trabajo especializadas.',
            capacidad: 6,
            imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            disponible: true
        },
        {
            id: 5,
            nombre: 'Sala 205',
            tipo: 'Corporate',
            descripcion: 'Sala multimedia para presentaciones ejecutivas y reuniones de alto nivel. Equipada con sistema de videoconferencia profesional.',
            capacidad: 6,
            imagen: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            disponible: true
        },
        {
            id: 6,
            nombre: 'Sala 206',
            tipo: 'Innovate',
            descripcion: 'Espacio colaborativo para sesiones de design thinking y prototipado rápido. Ideal para equipos multidisciplinarios.',
            capacidad: 6,
            imagen: 'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            disponible: true
        },
        {
            id: 7,
            nombre: 'Sala 207',
            tipo: 'Focus',
            descripcion: 'Sala silenciosa para mentorías individuales y sesiones de concentración profunda. Aislamiento acústico premium.',
            capacidad: 6,
            imagen: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            disponible: true
        }
    ];
    
    res.json({
        success: true,
        data: salas,
        total: salas.length
    });
});

// API para obtener horarios disponibles
app.get('/api/horarios', (req, res) => {
    const horarios = [
        '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00'
    ];
    
    res.json({
        success: true,
        data: horarios
    });
});

// API para crear reserva
app.post('/api/reservas', (req, res) => {
    const { salaId, fecha, horario, duracion, proposito, participantes, notas } = req.body;
    
    // Validación básica
    if (!salaId || !fecha || !horario || !duracion || !proposito || !participantes) {
        return res.status(400).json({
            success: false,
            message: 'Faltan campos requeridos'
        });
    }
    
    // Simular creación de reserva
    const reserva = {
        id: Date.now(),
        salaId,
        fecha,
        horario,
        duracion,
        proposito,
        participantes,
        notas: notas || '',
        estado: 'confirmada',
        fechaCreacion: new Date().toISOString()
    };
    
    res.json({
        success: true,
        message: 'Reserva creada exitosamente',
        data: reserva
    });
});

// API para obtener reservas del usuario
app.get('/api/reservas/:userId', (req, res) => {
    const { userId } = req.params;
    
    // Simular reservas del usuario
    const reservas = [
        {
            id: 1,
            salaId: 1,
            salaNombre: 'Sala 201',
            fecha: '2024-01-15',
            horario: '10:00',
            duracion: 2,
            proposito: 'Sesión de Mentoría',
            participantes: 4,
            estado: 'confirmada'
        },
        {
            id: 2,
            salaId: 3,
            salaNombre: 'Sala 203',
            fecha: '2024-01-16',
            horario: '14:00',
            duracion: 1.5,
            proposito: 'Trabajo en Grupo',
            participantes: 3,
            estado: 'confirmada'
        }
    ];
    
    res.json({
        success: true,
        data: reservas
    });
});

// API para autenticación (complementaria a Firebase)
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Simulación de autenticación
    if (email && password) {
        res.json({
            success: true,
            message: 'Login exitoso',
            user: {
                id: 'user_' + Date.now(),
                email: email,
                nombre: 'Usuario Demo'
            }
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'Email y contraseña requeridos'
        });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Integrated BK Server running on http://localhost:${PORT}`);
    console.log(`📱 Mobile app: http://localhost:${PORT}/mobile`);
    console.log(`🌐 Backend HTML: http://localhost:${PORT}/backend`);
    console.log(`📚 Salas API: http://localhost:${PORT}/api/salas`);
});
