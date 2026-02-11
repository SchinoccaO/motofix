// ============================================
// CONEXIÓN A LA BASE DE DATOS CON SEQUELIZE
// ============================================
// Este archivo configura la conexión a MySQL usando Sequelize (un ORM)
// ORM = Object-Relational Mapping: nos permite trabajar con la BD usando objetos de JavaScript
// en lugar de escribir SQL manualmente

// Importamos Sequelize, que es la librería que nos conecta con MySQL
import { Sequelize } from 'sequelize';
// Importamos dotenv para leer variables de entorno del archivo .env
import dotenv from 'dotenv';
// Importamos fs y path para leer el certificado CA de TiDB Cloud
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargamos las variables de entorno (como DB_USER, DB_PASSWORD, etc.)
dotenv.config();

// ===== CREAMOS LA CONEXIÓN A LA BASE DE DATOS =====
// Ruta al certificado CA de TiDB Cloud
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const caPath = path.resolve(__dirname, '../../isrgrootx1.pem');

// Usamos DATABASE_URL para conectar a TiDB Cloud
// Removemos ?ssl=true de la URL porque SSL se configura manualmente en dialectOptions
const dbUrl = (process.env.DATABASE_URL || '').replace(/[?&]ssl=true/gi, '');
const sequelize = new Sequelize(dbUrl, {
  dialect: 'mysql',
  port: 4000, // TiDB usa puerto 4000 en vez del 3306 estándar

  // TiDB Cloud requiere SSL con certificado CA
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync(caPath),
      rejectUnauthorized: true
    }
  },

  // logging: solo en desarrollo para debuggear
  logging: process.env.NODE_ENV === 'development' ? console.log : false,

  // === POOL DE CONEXIONES ===
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // === CONFIGURACIÓN DE MODELOS ===
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// ============================================
// FUNCIONES ÚTILES PARA LA BASE DE DATOS
// ============================================

// === FUNCIÓN PARA VERIFICAR LA CONEXIÓN ===
// Esta función intenta conectarse a MySQL para ver si todo está bien configurado
export async function testConnection() {
  try {
    // authenticate() intenta conectarse a la BD
    await sequelize.authenticate();
    console.log('✅ Conexión a TiDB Cloud exitosa (Sequelize)');
    return true;  // Devuelve true si la conexión fue exitosa
  } catch (error) {
    // Si hay un error (contraseña incorrecta, BD no existe, etc.)
    console.error('❌ Error conectando a TiDB Cloud:', error.message);
    return false; // Devuelve false si falló
  }
}

// === FUNCIÓN PARA SINCRONIZAR MODELOS ===
// Esta función crea/actualiza las tablas en MySQL según los modelos que definimos
// NOTA: En este proyecto NO la usamos porque las tablas ya existen (creadas con schema.sql)
export async function syncDatabase(options = {}) {
  try {
    // sync() revisa los modelos y crea/modifica las tablas si es necesario
    // options puede ser:
    //   { force: true }  -> Borra y recrea todas las tablas (¡CUIDADO! Pierdes datos)
    //   { alter: true }  -> Modifica las tablas para que coincidan con los modelos
    await sequelize.sync(options);
    console.log('✅ Base de datos sincronizada');
    return true;
  } catch (error) {
    console.error('❌ Error sincronizando base de datos:', error.message);
    return false;
  }
}

// Exportamos la instancia de sequelize para usarla en otros archivos
// Esto es lo principal: otros archivos importan esto para conectarse a la BD
export default sequelize;
