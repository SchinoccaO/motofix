/**
 * Test de conexión a MySQL (XAMPP)
 * Ejecutar desde server/: node scripts/test-mysql.js
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '../.env') });

async function testConnection() {
    console.log('🔍 Probando conexión a MySQL (XAMPP)...\n');
    console.log('Configuración:');
    console.log(`  Host: ${process.env.DB_HOST}`);
    console.log(`  Port: ${process.env.DB_PORT}`);
    console.log(`  User: ${process.env.DB_USER}`);
    console.log(`  Database: ${process.env.DB_NAME}\n`);

    try {
        // Crear conexión
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME
        });

        console.log('✅ Conexión exitosa a MySQL!\n');

        // Probar algunas queries
        console.log('📊 Verificando datos en la base de datos:\n');

        // Contar usuarios
        const [usuarios] = await connection.execute('SELECT COUNT(*) as total FROM usuarios');
        console.log(`  👤 Usuarios: ${usuarios[0].total}`);

        // Contar talleres
        const [talleres] = await connection.execute('SELECT COUNT(*) as total FROM talleres');
        console.log(`  🏪 Talleres: ${talleres[0].total}`);

        // Contar reseñas
        const [resenas] = await connection.execute('SELECT COUNT(*) as total FROM resenas');
        console.log(`  ⭐ Reseñas: ${resenas[0].total}\n`);

        // Mostrar algunos talleres
        console.log('📋 Talleres disponibles:');
        const [talleresData] = await connection.execute(
            'SELECT id, nombre, ciudad, calificacion_promedio FROM talleres LIMIT 3'
        );

        talleresData.forEach(taller => {
            console.log(`  ${taller.id}. ${taller.nombre} (${taller.ciudad}) - ⭐ ${taller.calificacion_promedio}`);
        });

        await connection.end();

        console.log('\n═══════════════════════════════════════');
        console.log('✅ TODO FUNCIONA CORRECTAMENTE');
        console.log('═══════════════════════════════════════');
        console.log('El backend está listo para conectarse a MySQL\n');

    } catch (error) {
        console.error('\n❌ Error al conectar a MySQL:');
        console.error(`  Código: ${error.code}`);
        console.error(`  Mensaje: ${error.message}\n`);

        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('💡 Solución: Verifica usuario y contraseña en .env');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('💡 Solución: Asegúrate de que XAMPP MySQL esté corriendo');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('💡 Solución: La base de datos no existe. Ejecuta schema.sql');
        }

        process.exit(1);
    }
}

testConnection();
