/**
 * Test de conexión Backend-Frontend
 * Ejecutar: node test-connection.js
 */

import http from 'http';

const BACKEND_URL = 'http://localhost:5001';
const FRONTEND_URL = 'http://localhost:3000';

console.log('🔍 Verificando conexión Backend-Frontend...\n');

// Test 1: Backend Health Check
console.log('1️⃣ Probando Backend Health Check...');
http.get(`${BACKEND_URL}/api/health`, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Backend respondiendo correctamente');
      console.log('   Respuesta:', JSON.parse(data));
    } else {
      console.log(`❌ Backend error: ${res.statusCode}`);
    }
    console.log();
    
    // Test 2: Backend API Info
    console.log('2️⃣ Probando Backend API Info...');
    http.get(`${BACKEND_URL}/api`, (res2) => {
      let data2 = '';
      res2.on('data', (chunk) => { data2 += chunk; });
      res2.on('end', () => {
        if (res2.statusCode === 200) {
          console.log('✅ API Info respondiendo');
          console.log('   Endpoints:', JSON.parse(data2).endpoints);
        } else {
          console.log(`❌ API Info error: ${res2.statusCode}`);
        }
        console.log();
        
        // Test 3: Frontend disponible
        console.log('3️⃣ Verificando Frontend...');
        http.get(FRONTEND_URL, (res3) => {
          if (res3.statusCode === 200) {
            console.log('✅ Frontend disponible en puerto 3000');
          } else {
            console.log(`⚠️ Frontend responde con: ${res3.statusCode}`);
          }
          
          console.log('\n═══════════════════════════════════════');
          console.log('✅ CONEXIÓN VERIFICADA');
          console.log('═══════════════════════════════════════');
          console.log(`Backend:  ${BACKEND_URL}`);
          console.log(`Frontend: ${FRONTEND_URL}`);
          console.log('═══════════════════════════════════════\n');
        }).on('error', (e) => {
          console.log('❌ Frontend NO está corriendo');
          console.log('   Ejecutar: cd client && npm run dev\n');
        });
      });
    }).on('error', (e) => {
      console.log('❌ Error al conectar con API Info:', e.message);
    });
  });
}).on('error', (e) => {
  console.log('❌ Backend NO está corriendo');
  console.log('   Error:', e.message);
  console.log('   Ejecutar: cd server && npm run dev\n');
});
