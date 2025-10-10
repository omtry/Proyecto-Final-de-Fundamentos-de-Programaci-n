// Script de prueba para verificar la integración frontend-backend
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testIntegration() {
  console.log('🧪 Iniciando pruebas de integración...\n');

  try {
    // Test 1: Health check
    console.log('1. Probando health check...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);
    console.log('   Servicios disponibles:', healthData.services);

    // Test 2: API de salas
    console.log('\n2. Probando API de salas...');
    const salasResponse = await fetch(`${BASE_URL}/api/salas`);
    const salasData = await salasResponse.json();
    console.log('✅ Salas obtenidas:', salasData.total, 'salas');
    console.log('   Primera sala:', salasData.data[0]?.nombre);

    // Test 3: API de horarios
    console.log('\n3. Probando API de horarios...');
    const horariosResponse = await fetch(`${BASE_URL}/api/horarios`);
    const horariosData = await horariosResponse.json();
    console.log('✅ Horarios obtenidos:', horariosData.data.length, 'horarios');
    console.log('   Primeros horarios:', horariosData.data.slice(0, 3));

    // Test 4: Crear reserva
    console.log('\n4. Probando creación de reserva...');
    const reservaData = {
      salaId: 1,
      fecha: '2024-01-15',
      horario: '10:00',
      duracion: 2,
      proposito: 'Sesión de Mentoría',
      participantes: 4,
      notas: 'Prueba de integración'
    };

    const reservaResponse = await fetch(`${BASE_URL}/api/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservaData)
    });
    const reservaResult = await reservaResponse.json();
    console.log('✅ Reserva creada:', reservaResult.message);
    console.log('   ID de reserva:', reservaResult.data.id);

    // Test 5: Obtener reservas de usuario
    console.log('\n5. Probando obtención de reservas...');
    const reservasResponse = await fetch(`${BASE_URL}/api/reservas/user_123`);
    const reservasData = await reservasResponse.json();
    console.log('✅ Reservas obtenidas:', reservasData.data.length, 'reservas');

    // Test 6: Páginas HTML del backend
    console.log('\n6. Probando páginas HTML del backend...');
    const pages = ['/principal', '/login', '/registro', '/salas', '/reservas'];
    
    for (const page of pages) {
      try {
        const pageResponse = await fetch(`${BASE_URL}${page}`);
        if (pageResponse.ok) {
          console.log(`✅ Página ${page}: OK`);
        } else {
          console.log(`❌ Página ${page}: Error ${pageResponse.status}`);
        }
      } catch (error) {
        console.log(`❌ Página ${page}: Error de conexión`);
      }
    }

    console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!');
    console.log('\n📱 URLs disponibles:');
    console.log(`   Frontend móvil: ${BASE_URL}`);
    console.log(`   Backend web: ${BASE_URL}/backend`);
    console.log(`   API Health: ${BASE_URL}/api/health`);

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.log('\n💡 Asegúrate de que el servidor integrado esté ejecutándose:');
    console.log('   npm run integrated-server');
  }
}

// Ejecutar las pruebas
testIntegration();
