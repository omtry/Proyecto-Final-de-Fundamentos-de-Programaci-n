const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Archivos de persistencia
const DATA_DIR = path.join(__dirname, 'data');
const RESERVAS_FILE = path.join(DATA_DIR, 'reservas.json');

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

// Funciones de persistencia
async function ensureDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
        console.error('Error creating data directory:', error);
    }
}

async function loadReservas() {
    try {
        await ensureDataDir();
        const reservasData = await fs.readFile(RESERVAS_FILE, 'utf8');
        if (reservasData && reservasData.trim()) {
            reservas = JSON.parse(reservasData);
            // Asegurar que reservas sea un array
            if (!Array.isArray(reservas)) {
                console.warn('⚠️ Datos de reservas no son un array, inicializando vacío');
                reservas = [];
            }
            console.log(`✅ Cargadas ${reservas.length} reservas desde archivo`);
        } else {
            console.log('📝 Archivo de reservas está vacío, iniciando con datos vacíos');
            reservas = [];
            await saveReservas();
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('📝 Archivo de reservas no existe, creando nuevo archivo');
        } else {
            console.error('❌ Error leyendo archivo de reservas:', error.message);
        }
        reservas = [];
        await saveReservas();
    }
}

async function saveReservas() {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
        try {
            await ensureDataDir();
            
            // Verificar que reservas es un array válido
            if (!Array.isArray(reservas)) {
                console.error('❌ ERROR: reservas no es un array!', typeof reservas);
                throw new Error('reservas no es un array válido');
            }
            
            const dataToSave = JSON.stringify(reservas, null, 2);
            
            // Verificar que hay datos para guardar
            if (!dataToSave || dataToSave.trim() === '') {
                console.error('❌ ERROR: No hay datos para guardar');
                throw new Error('Datos vacíos para guardar');
            }
            
            // Escribir archivo (con reintentos automáticos)
            await fs.writeFile(RESERVAS_FILE, dataToSave, 'utf8');
            
            // Verificar inmediatamente que se escribió correctamente
            const verifyData = await fs.readFile(RESERVAS_FILE, 'utf8');
            const verifyReservas = JSON.parse(verifyData);
            
            if (!Array.isArray(verifyReservas)) {
                throw new Error('Los datos guardados no son un array válido');
            }
            
            if (verifyReservas.length !== reservas.length) {
                console.error(`⚠️ Intento ${attempts + 1}/${maxAttempts}: Verificación falló. Esperado: ${reservas.length}, Obtenido: ${verifyReservas.length}`);
                attempts++;
                if (attempts < maxAttempts) {
                    // Esperar un poco antes de reintentar (backoff exponencial)
                    await new Promise(resolve => setTimeout(resolve, 100 * attempts));
                    continue;
                } else {
                    throw new Error(`No se pudo verificar el guardado después de ${maxAttempts} intentos`);
                }
            }
            
            // Si llegamos aquí, el guardado fue exitoso
            console.log(`💾 Reservas guardadas en disco correctamente: ${reservas.length} reservas (intento ${attempts + 1})`);
            return; // Salir exitosamente
            
        } catch (error) {
            attempts++;
            if (attempts >= maxAttempts) {
                console.error('❌ Error guardando reservas después de todos los intentos:', error);
                console.error('   Stack:', error.stack);
                throw error; // Re-throw después de todos los intentos
            }
            console.error(`⚠️ Error en intento ${attempts}/${maxAttempts}, reintentando...`, error.message);
            // Esperar antes de reintentar
            await new Promise(resolve => setTimeout(resolve, 100 * attempts));
        }
    }
}

// Base de datos para reservas (se carga desde archivo al iniciar)
let reservas = [];

// API para crear reserva
app.post('/api/reservas', async (req, res) => {
    console.log('📥 POST /api/reservas - Nueva solicitud de reserva');
    console.log('📦 Datos recibidos:', JSON.stringify(req.body, null, 2));
    
    try {
        const { salaId, fecha, horario, duracion, proposito, participantes, notas, userId } = req.body;
        
        // Validación de campos requeridos
        if (!salaId || !fecha || !horario || !duracion || !proposito || !participantes || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos'
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
        
        // Normalizar userId y fecha para comparaciones consistentes
        const userIdNormalizado = String(userId).trim();
        const fechaNormalizada = fecha.split('T')[0]; // Tomar solo la parte de fecha (YYYY-MM-DD)
        
        // Verificar que el usuario no tenga más de 3 reservas activas
        // Filtrar reservas confirmadas del usuario
        const reservasUsuario = reservas.filter(r => {
            // Comparar userId como string (normalizado)
            const rUserId = String(r.userId || '').trim();
            const userIdMatch = rUserId === userIdNormalizado;
            const estadoMatch = r.estado === 'confirmada';
            return userIdMatch && estadoMatch;
        });
        
        console.log(`🔍 Usuario "${userIdNormalizado}" tiene ${reservasUsuario.length} reservas activas`);
        console.log(`📋 Reservas encontradas:`, reservasUsuario.map(r => ({ id: r.id, fecha: r.fecha, sala: r.salaNombre })));
        
        // Permitir hasta 3 reservas activas
        if (reservasUsuario.length >= 3) {
            console.log(`❌ Bloqueando: Usuario tiene ${reservasUsuario.length} reservas (máximo 3)`);
            return res.status(400).json({
                success: false,
                message: 'Ya tienes 3 reservas activas. Puedes tener máximo 3 reservas en fechas diferentes. Cancela una reserva para poder crear otra.'
            });
        }
        
        // Verificar que no tenga otra reserva el mismo día (solo una reserva por día)
        const reservaMismoDia = reservasUsuario.find(r => {
            const rFecha = r.fecha ? String(r.fecha).split('T')[0].trim() : '';
            const match = rFecha === fechaNormalizada;
            if (match) {
                console.log(`⚠️ Conflicto encontrado: Ya tiene reserva en ${rFecha} para ${r.salaNombre}`);
            }
            return match;
        });
        
        if (reservaMismoDia) {
            console.log(`❌ Bloqueando: Usuario ya tiene reserva en ${fechaNormalizada}`);
            return res.status(400).json({
                success: false,
                message: `Ya tienes una reserva para el ${fechaNormalizada} (${reservaMismoDia.salaNombre}). Solo puedes reservar una sala por día. Puedes reservar otra sala en una fecha diferente.`
            });
        }
        
        console.log(`✅ Usuario puede crear reserva - no hay conflicto (tiene ${reservasUsuario.length}/3 reservas, fecha ${fechaNormalizada} disponible)`);
        
        // Verificar disponibilidad de la sala (conflicto con otras reservas)
        // Normalizar fecha para comparación
        const fechaNormalizadaConflicto = fecha.split('T')[0];
        const conflicto = reservas.find(r => {
            const rSalaId = parseInt(r.salaId);
            const rFecha = r.fecha ? r.fecha.split('T')[0] : r.fecha;
            return rSalaId === parseInt(salaId) && 
                   rFecha === fechaNormalizadaConflicto && 
                   r.estado === 'confirmada';
        });
        
        if (conflicto) {
            return res.status(409).json({
                success: false,
                message: 'La sala ya está reservada para esa fecha y horario.'
            });
        }
        
        // Obtener nombre de la sala
        const salas = [
            { id: 1, nombre: 'Sala 201' },
            { id: 2, nombre: 'Sala 202' },
            { id: 3, nombre: 'Sala 203' },
            { id: 4, nombre: 'Sala 204' },
            { id: 5, nombre: 'Sala 205' },
            { id: 6, nombre: 'Sala 206' },
            { id: 7, nombre: 'Sala 207' }
        ];
        const sala = salas.find(s => s.id === parseInt(salaId));
        const salaNombre = sala ? sala.nombre : `Sala ${salaId}`;
        
        // Crear nueva reserva
        const nuevaReserva = {
            id: Date.now(),
            userId: userIdNormalizado, // Usar userId normalizado
            salaId: parseInt(salaId),
            salaNombre: salaNombre,
            fecha: fechaNormalizadaConflicto, // Guardar fecha normalizada (sin hora)
            horario,
            duracion: parseFloat(duracion),
            proposito,
            participantes: parseInt(participantes),
            notas: notas || '',
            estado: 'confirmada',
            fechaCreacion: new Date().toISOString()
        };
        
        reservas.push(nuevaReserva);
        
        // Guardar en archivo inmediatamente (con verificación estricta)
        try {
            await saveReservas();
            // Verificar que se guardó correctamente leyendo el archivo
            const verifyData = await fs.readFile(RESERVAS_FILE, 'utf8');
            const verifyReservas = JSON.parse(verifyData);
            if (!Array.isArray(verifyReservas) || verifyReservas.length !== reservas.length) {
                console.error('⚠️ ADVERTENCIA: Verificación falló después de guardar!');
                console.error(`   En memoria: ${reservas.length}, En archivo: ${verifyReservas.length}`);
                // Intentar guardar de nuevo
                await saveReservas();
            } else {
                console.log(`✅ Verificación exitosa: ${verifyReservas.length} reservas guardadas`);
            }
        } catch (saveError) {
            console.error('❌ ERROR CRÍTICO: No se pudo guardar la reserva en disco:', saveError);
            console.error('   La reserva está en memoria pero NO se guardó en disco!');
            // Aún así respondemos éxito porque la reserva está en memoria
        }
        
        // Contar reservas después de agregar la nueva
        const totalReservas = reservas.filter(r => {
            const rUserId = String(r.userId || '').trim();
            return rUserId === userIdNormalizado && r.estado === 'confirmada';
        }).length;
        
        console.log(`✅ Reserva creada exitosamente!`);
        console.log(`   Usuario: ${userIdNormalizado}`);
        console.log(`   Sala: ${salaId} (${salaNombre})`);
        console.log(`   Fecha: ${fechaNormalizadaConflicto}`);
        console.log(`   Horario: ${horario}`);
        console.log(`📊 Total reservas activas del usuario: ${totalReservas}/3`);
        console.log(`📊 Total reservas en memoria: ${reservas.length}`);
        
        res.status(201).json({
            success: true,
            message: 'Reserva creada exitosamente',
            data: nuevaReserva
        });
    } catch (error) {
        console.error('❌ Error al crear reserva:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la reserva',
            error: error.message
        });
    }
});

// API para obtener reservas del usuario
app.get('/api/reservas/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const userIdNormalizado = String(userId).trim();
        
        // Filtrar reservas del usuario
        const reservasUsuario = reservas.filter(r => {
            const rUserId = String(r.userId || '').trim();
            return rUserId === userIdNormalizado;
        });
        
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

// API para obtener todas las reservas
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

// Inicializar servidor
(async () => {
    // Cargar datos persistentes al iniciar
    await loadReservas();
    
    // Iniciar servidor
    app.listen(PORT, () => {
        console.log(`🚀 Integrated BK Server running on http://localhost:${PORT}`);
        console.log(`📱 Mobile app: http://localhost:${PORT}/mobile`);
        console.log(`🌐 Backend HTML: http://localhost:${PORT}/backend`);
        console.log(`📚 Salas API: http://localhost:${PORT}/api/salas`);
        console.log(`💾 Datos persistentes en: ${DATA_DIR}`);
    });
})();
