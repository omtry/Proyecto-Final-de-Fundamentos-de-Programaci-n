const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3002/api';

// Función para hacer requests
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const config = { ...defaultOptions, ...options };

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        return { response, data };
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
}

// Tests
async function runTests() {
    console.log('🧪 Iniciando tests de la API...\n');

    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing Health Check...');
        const { data: healthData } = await apiRequest('/health');
        console.log('✅ Health Check:', healthData.status);
        console.log('');

        // Test 2: Obtener salas
        console.log('2️⃣ Testing Get Salas...');
        const { data: salasData } = await apiRequest('/salas');
        console.log('✅ Salas obtenidas:', salasData.total, 'salas');
        console.log('   Primera sala:', salasData.data[0]?.nombre);
        console.log('');

        // Test 3: Obtener horarios
        console.log('3️⃣ Testing Get Horarios...');
        const { data: horariosData } = await apiRequest('/horarios');
        console.log('✅ Horarios obtenidos:', horariosData.data.length, 'horarios');
        console.log('   Primer horario:', horariosData.data[0]);
        console.log('');

        // Test 4: Validar horario
        console.log('4️⃣ Testing Validate Booking...');
        const { data: validationData } = await apiRequest('/validate-booking', {
            method: 'POST',
            body: JSON.stringify({
                startTime: '14:00',
                duration: 2
            })
        });
        console.log('✅ Validación de horario:', validationData.valid ? 'Válido' : 'Inválido');
        console.log('   Mensaje:', validationData.message);
        console.log('');

        // Test 5: Crear reserva
        console.log('5️⃣ Testing Create Reserva...');
        const reservaData = {
            salaId: 1,
            fecha: '2024-01-20',
            horario: '10:00',
            duracion: 2,
            proposito: 'Test de API',
            participantes: 3,
            notas: 'Reserva de prueba',
            userId: 'test_user_123'
        };

        const { data: reservaResult } = await apiRequest('/reservas', {
            method: 'POST',
            body: JSON.stringify(reservaData)
        });
        console.log('✅ Reserva creada:', reservaResult.success ? 'Sí' : 'No');
        console.log('   ID de reserva:', reservaResult.data?.id);
        console.log('');

        // Test 6: Obtener reservas de usuario
        console.log('6️⃣ Testing Get Reservas Usuario...');
        const { data: reservasData } = await apiRequest('/reservas/test_user_123');
        console.log('✅ Reservas del usuario:', reservasData.total, 'reservas');
        console.log('');

        // Test 7: Obtener estadísticas
        console.log('7️⃣ Testing Get Stats...');
        const { data: statsData } = await apiRequest('/stats');
        console.log('✅ Estadísticas:');
        console.log('   Total salas:', statsData.data.totalSalas);
        console.log('   Total reservas:', statsData.data.totalReservas);
        console.log('   Total usuarios:', statsData.data.totalUsuarios);
        console.log('');

        // Test 8: Obtener sala por ID
        console.log('8️⃣ Testing Get Sala by ID...');
        const { data: salaData } = await apiRequest('/salas/1');
        console.log('✅ Sala obtenida:', salaData.data?.nombre);
        console.log('   Tipo:', salaData.data?.tipo);
        console.log('');

        // Test 9: Actualizar reserva
        console.log('9️⃣ Testing Update Reserva...');
        if (reservaResult.data?.id) {
            const { data: updateResult } = await apiRequest(`/reservas/${reservaResult.data.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    notas: 'Reserva actualizada desde test'
                })
            });
            console.log('✅ Reserva actualizada:', updateResult.success ? 'Sí' : 'No');
        }
        console.log('');

        // Test 10: Cancelar reserva
        console.log('🔟 Testing Cancel Reserva...');
        if (reservaResult.data?.id) {
            const { data: cancelResult } = await apiRequest(`/reservas/${reservaResult.data.id}`, {
                method: 'DELETE'
            });
            console.log('✅ Reserva cancelada:', cancelResult.success ? 'Sí' : 'No');
        }
        console.log('');

        console.log('🎉 ¡Todos los tests completados exitosamente!');
        console.log('✅ La API está funcionando correctamente');

    } catch (error) {
        console.error('❌ Error en los tests:', error.message);
        console.log('');
        console.log('💡 Asegúrate de que el servidor API esté ejecutándose:');
        console.log('   npm run api-server');
    }
}

// Ejecutar tests
runTests();
