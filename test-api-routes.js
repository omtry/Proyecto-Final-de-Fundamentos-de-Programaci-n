// Script para probar las rutas de API
const http = require('http');

const BASE_URL = 'http://localhost:3001';

function testRoute(route, expectedStatus = 200) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${route}`;
    console.log(`\n🔍 Probando: ${url}`);
    
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const contentType = res.headers['content-type'];
        const statusCode = res.statusCode;
        
        console.log(`   Status: ${statusCode}`);
        console.log(`   Content-Type: ${contentType}`);
        
        if (statusCode === expectedStatus) {
          if (contentType && contentType.includes('application/json')) {
            try {
              const json = JSON.parse(data);
              console.log(`   ✅ Respuesta JSON válida`);
              if (json.success && json.data) {
                console.log(`   📊 Datos recibidos: ${Array.isArray(json.data) ? json.data.length + ' items' : '1 item'}`);
              }
              resolve({ success: true, data: json });
            } catch (e) {
              console.log(`   ❌ Error parseando JSON: ${e.message}`);
              reject(e);
            }
          } else {
            console.log(`   ⚠️  Respuesta no es JSON: ${data.substring(0, 100)}`);
            reject(new Error('Respuesta no es JSON'));
          }
        } else {
          console.log(`   ❌ Status esperado ${expectedStatus}, recibido ${statusCode}`);
          reject(new Error(`Status ${statusCode} no esperado`));
        }
      });
    }).on('error', (err) => {
      console.log(`   ❌ Error de conexión: ${err.message}`);
      reject(err);
    });
  });
}

async function runTests() {
  console.log('🚀 Iniciando pruebas de API...\n');
  
  try {
    // Test 1: Health check
    await testRoute('/api/health');
    
    // Test 2: Obtener salas
    await testRoute('/api/salas');
    
    // Test 3: Obtener horarios
    await testRoute('/api/horarios');
    
    // Test 4: Obtener stats
    await testRoute('/api/stats');
    
    console.log('\n✅ Todas las pruebas pasaron!');
    process.exit(0);
  } catch (error) {
    console.log(`\n❌ Prueba falló: ${error.message}`);
    console.log('\n💡 Asegúrate de que:');
    console.log('   1. El servidor esté corriendo (node server.js)');
    console.log('   2. El servidor esté en el puerto 3001');
    console.log('   3. Los cambios en server.js hayan sido guardados');
    process.exit(1);
  }
}

runTests();

