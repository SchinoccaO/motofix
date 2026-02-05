// ============================================
// ARCHIVO DE CONFIGURACIÓN DE LA BASE DE DATOS
// ============================================
// Este archivo define las configuraciones para conectarse a la base de datos
// en diferentes ambientes (desarrollo, pruebas, producción)

// Importamos dotenv para leer variables del archivo .env
import dotenv from 'dotenv';
// Importamos path para manejar rutas de archivos
import path from 'path';
// fileURLToPath convierte una URL de archivo a una ruta del sistema
import { fileURLToPath } from 'url';

// En ES6 modules no existe __dirname por defecto, así que lo creamos:
// __filename obtiene la ruta completa de este archivo
const __filename = fileURLToPath(import.meta.url);
// __dirname obtiene la carpeta donde está este archivo
const __dirname = path.dirname(__filename);

// Cargamos las variables de entorno desde el archivo .env
// ../../.env significa: subir 2 niveles desde config/ hasta server/ y leer .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Exportamos un objeto con las configuraciones para cada ambiente
export default {
  // ===== CONFIGURACIÓN PARA DESARROLLO =====
  // Usamos esta configuración cuando desarrollamos en nuestra computadora
  development: {
    username: process.env.DB_USER || 'root',        // Usuario de MySQL (por defecto 'root')
    password: process.env.DB_PASSWORD || '',        // Contraseña de MySQL (vacía por defecto)
    database: process.env.DB_NAME || 'motoya',      // Nombre de la base de datos
    host: process.env.DB_HOST || 'localhost',       // Servidor de la BD (nuestra PC)
    port: process.env.DB_PORT || 3306,              // Puerto de MySQL (3306 es el estándar)
    dialect: 'mysql',                                // Tipo de base de datos que usamos
    logging: console.log                             // Mostrar queries SQL en la consola (para aprender)
  },

  // ===== CONFIGURACIÓN PARA PRUEBAS =====
  // Usamos una base de datos separada para hacer tests sin afectar los datos reales
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME_TEST || 'motoya_test',  // Base de datos diferente para tests
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false                                   // No mostrar queries en tests (más limpio)
  },

  // ===== CONFIGURACIÓN PARA PRODUCCIÓN =====
  // Esta configuración se usa cuando la aplicación está en un servidor real (ej: Vercel, AWS)
  production: {
    username: process.env.DB_USER,                  // En producción, estas variables DEBEN existir
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,                                 // No mostrar queries en producción (seguridad)
    // Pool de conexiones: reutiliza conexiones a la BD en lugar de crear nuevas cada vez
    pool: {
      max: 10,        // Máximo 10 conexiones simultáneas a la base de datos
      min: 0,         // Mínimo 0 conexiones (se crean cuando se necesitan)
      acquire: 30000, // Tiempo máximo (30 seg) para obtener una conexión antes de error
      idle: 10000     // Tiempo máximo (10 seg) que una conexión puede estar inactiva
    }
  }
};
