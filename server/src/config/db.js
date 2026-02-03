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

// Cargamos las variables de entorno (como DB_USER, DB_PASSWORD, etc.)
dotenv.config();

// ===== CREAMOS LA CONEXIÓN A LA BASE DE DATOS =====
// Sequelize necesita 3 parámetros básicos: nombre BD, usuario, contraseña
const sequelize = new Sequelize(
  process.env.DB_NAME || 'motoya_db',     // Nombre de la base de datos
  process.env.DB_USER || 'root',          // Usuario de MySQL
  process.env.DB_PASSWORD || '',          // Contraseña de MySQL
  {
    // === OPCIONES DE CONEXIÓN ===
    host: process.env.DB_HOST || 'localhost',  // Dónde está MySQL (localhost = esta PC)
    port: process.env.DB_PORT || 3306,         // Puerto de MySQL (3306 es el estándar)
    dialect: 'mysql',                          // Tipo de base de datos (mysql, postgres, etc.)

    // Opciones específicas de MySQL
    dialectOptions: {
      charset: 'utf8mb4'  // Codificación que soporta emojis y caracteres especiales
    },

    // logging: si queremos ver las queries SQL en consola
    // Solo lo activamos en desarrollo para aprender/debuggear
    logging: process.env.NODE_ENV === 'development' ? console.log : false,

    // === POOL DE CONEXIONES ===
    // En lugar de abrir/cerrar una conexión por cada petición (lento),
    // mantenemos varias conexiones abiertas y las reutilizamos (rápido)
    pool: {
      max: 10,        // Máximo 10 conexiones abiertas al mismo tiempo
      min: 0,         // Mínimo 0 (se crean cuando se necesitan)
      acquire: 30000, // 30 segundos máximo para conseguir una conexión
      idle: 10000     // 10 segundos máximo de inactividad antes de cerrar
    },

    // === CONFIGURACIÓN DE MODELOS ===
    // Estas opciones se aplican a todas las tablas/modelos
    define: {
      timestamps: true,           // Agregar created_at y updated_at automáticamente
      underscored: true,          // Usar snake_case (created_at) en vez de camelCase (createdAt)
      createdAt: 'created_at',    // Nombre de la columna para fecha de creación
      updatedAt: 'updated_at'     // Nombre de la columna para fecha de actualización
    }
  }
);

// ============================================
// FUNCIONES ÚTILES PARA LA BASE DE DATOS
// ============================================

// === FUNCIÓN PARA VERIFICAR LA CONEXIÓN ===
// Esta función intenta conectarse a MySQL para ver si todo está bien configurado
export async function testConnection() {
  try {
    // authenticate() intenta conectarse a la BD
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL exitosa (Sequelize)');
    return true;  // Devuelve true si la conexión fue exitosa
  } catch (error) {
    // Si hay un error (contraseña incorrecta, BD no existe, etc.)
    console.error('❌ Error conectando a MySQL:', error.message);
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
