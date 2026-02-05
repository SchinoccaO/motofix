// ============================================
// ARCHIVO PRINCIPAL DEL SERVIDOR (BACKEND)
// ============================================
// Este es el punto de entrada de tu aplicación backend.
// Aquí configuramos Express, los middlewares, las rutas y arrancamos el servidor.

// === IMPORTACIONES ===
// Express: framework para crear el servidor web y manejar peticiones HTTP
import express from 'express';
// CORS: permite que el frontend (cliente) en un puerto diferente acceda al backend
import cors from 'cors';
// dotenv: lee variables de entorno desde el archivo .env
import dotenv from 'dotenv';
// sequelize: nuestra conexión a la base de datos MySQL
// testConnection: función para verificar que la conexión a MySQL funciona
import sequelize, { testConnection } from './config/db.js';
// Importamos los modelos (User, Taller, Resena) y sus relaciones
import './models/index.js';
// Importamos las rutas de cada módulo de la aplicación
import authRoutes from './routes/authRoutes.js';      // Rutas de autenticación (login, register)
import tallerRoutes from './routes/tallerRoutes.js';   // Rutas de talleres (crear, buscar, etc.)
import resenaRoutes from './routes/resenaRoutes.js';   // Rutas de reseñas (crear, leer)

// Cargamos las variables de entorno del archivo .env
dotenv.config();

// === INICIALIZACIÓN DEL SERVIDOR ===
// Creamos la aplicación Express (nuestro servidor)
const app = express();
// Definimos el puerto donde correrá el servidor
// Si existe PORT en .env lo usa, sino usa 3000
const PORT = process.env.PORT || 3000;

// ============================================
// MANEJO DE ERRORES NO CAPTURADOS
// ============================================
// Estos manejadores capturan errores que no fueron atrapados con try/catch
// Es una red de seguridad para que el servidor no se caiga sin avisar

// Cuando una Promesa es rechazada pero no tiene .catch()
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada sin manejar:', reason);
    console.error('Promesa:', promise);
    // En un escenario real, aquí podrías registrar el error en un archivo de logs
});

// Cuando ocurre una excepción que no fue capturada
process.on('uncaughtException', (error) => {
    console.error('❌ Excepción no capturada:', error);
    // Este tipo de error es grave, por eso cerramos el servidor
    process.exit(1);
});

// ============================================
// MIDDLEWARES
// ============================================
// Los middlewares son funciones que procesan las peticiones ANTES de llegar a las rutas
// Se ejecutan en orden (de arriba hacia abajo)

// === MIDDLEWARE DE CORS ===
// CORS = Cross-Origin Resource Sharing
// Permite que tu frontend (http://localhost:5173) haga peticiones a tu backend (http://localhost:3000)
// Sin CORS, el navegador bloquearía estas peticiones por seguridad
const corsOptions = {
    // origin: lista de URLs que PUEDEN acceder a tu API
    origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')  // Si existe en .env, la dividimos por comas
        : ['http://localhost:5173', 'http://localhost:3001'], // Si no, usamos estos por defecto
    credentials: true,          // Permite enviar cookies y headers de autenticación
    optionsSuccessStatus: 200   // Código de respuesta exitosa
};

// Aplicamos el middleware de CORS con las opciones definidas
app.use(cors(corsOptions));

// === MIDDLEWARE PARA PARSEAR JSON ===
// express.json() convierte el body de las peticiones de JSON a objetos JavaScript
// Ejemplo: si llega { "nombre": "Juan" }, lo convierte en req.body.nombre
app.use(express.json());

// === MIDDLEWARE PARA PARSEAR FORMULARIOS ===
// express.urlencoded() procesa datos de formularios HTML
// extended: true permite objetos y arrays anidados
app.use(express.urlencoded({ extended: true }));

// === MIDDLEWARE DE LOGGING (solo en desarrollo) ===
// Este middleware registra cada petición que llega al servidor
// Solo se activa si NODE_ENV es 'development' (para no llenar logs en producción)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        // Imprime el método HTTP (GET, POST, etc.) y la ruta solicitada
        console.log(`${req.method} ${req.path}`);
        // next() le dice a Express que continue con el siguiente middleware/ruta
        next();
    });
}

// ============================================
// RUTAS (ENDPOINTS) DE LA API
// ============================================
// Aquí definimos qué funciones se ejecutan cuando llega una petición a cada URL

// === RUTAS DE AUTENTICACIÓN ===
// Todas las rutas que empiecen con /api/auth van a authRoutes
// Ejemplo: POST /api/auth/register, POST /api/auth/login
app.use('/api/auth', authRoutes);

// === RUTAS DE TALLERES ===
// Todas las rutas que empiecen con /api/talleres van a tallerRoutes
// Ejemplo: GET /api/talleres, POST /api/talleres, GET /api/talleres/123
app.use('/api/talleres', tallerRoutes);

// === RUTAS DE RESEÑAS ===
// Todas las rutas que empiecen con /api/resenas van a resenaRoutes
// Ejemplo: POST /api/resenas, GET /api/resenas/taller/123
app.use('/api/resenas', resenaRoutes);

// ============================================
// RUTAS DE UTILIDAD
// ============================================

// === RUTA DE HEALTH CHECK ===
// Esta ruta sirve para verificar que el servidor está funcionando
// Es útil para servicios de monitoreo o para debugging
app.get('/api/health', (req, res) => {
    // Respondemos con un JSON que indica que todo está bien
    res.json({
        status: 'OK',                            // Estado del servidor
        message: 'MotoYA API is running',        // Mensaje descriptivo
        database: 'MySQL + Sequelize',           // Qué base de datos usamos
        timestamp: new Date().toISOString()      // Fecha y hora actual
    });
});

// === RUTA PRINCIPAL (DOCUMENTACIÓN BÁSICA) ===
// Cuando alguien accede a /api, mostramos información sobre la API
app.get('/api', (req, res) => {
    res.json({
        message: 'Bienvenido a la API de MotoYA',
        version: '1.0.0',
        orm: 'Sequelize',
        // Listamos los endpoints disponibles para guiar a los desarrolladores
        endpoints: {
            auth: '/api/auth (register, login, perfil)',
            talleres: '/api/talleres',
            usuarios: '/api/usuarios',
            resenas: '/api/resenas'
        }
    });
});

// ============================================
// MANEJADORES DE ERRORES
// ============================================

// === MANEJADOR 404 (Ruta No Encontrada) ===
// Este middleware se ejecuta si ninguna ruta anterior coincidió con la petición
// El asterisco '*' significa "cualquier ruta"
app.use('*', (req, res) => {
    // Respondemos con código 404 (Not Found)
    res.status(404).json({
        error: 'Endpoint no encontrado',
        path: req.originalUrl  // Mostramos qué ruta intentó acceder el usuario
    });
});

// === MANEJADOR DE ERRORES GLOBAL ===
// Este middleware captura cualquier error que ocurra en las rutas
// Nota: DEBE tener 4 parámetros (err, req, res, next) para que Express lo reconozca
app.use((err, req, res, next) => {
    // Imprimimos el error completo en la consola para debugging
    console.error(err.stack);
    // Respondemos con código 500 (Internal Server Error)
    res.status(500).json({
        error: 'Error interno del servidor',
        // Solo mostramos el mensaje del error en desarrollo (no en producción por seguridad)
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============================================
// FUNCIÓN PARA INICIAR EL SERVIDOR
// ============================================
// Esta es una función asíncrona (async) porque necesita esperar a que la BD se conecte
async function startServer() {
    try {
        // === PASO 1: VERIFICAR CONEXIÓN A LA BASE DE DATOS ===
        // Intentamos conectarnos a MySQL antes de arrancar el servidor
        await testConnection();

        // === PASO 2: CONFIGURAR MODELOS ===
        // NO sincronizamos modelos porque las tablas ya fueron creadas con schema.sql
        // Si descomentáramos esto, Sequelize intentaría crear/modificar tablas automáticamente
        // await sequelize.sync({
        //     alter: false,  // No modificar tablas existentes
        //     force: false   // No borrar y recrear tablas
        // });
        console.log('✅ Usando tablas existentes en la base de datos');

        // === PASO 3: INICIAR EL SERVIDOR ===
        // app.listen() pone el servidor a escuchar en el puerto especificado
        const server = app.listen(PORT, () => {
            // Este callback se ejecuta cuando el servidor está listo
            console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📦 ORM: Sequelize`);
            console.log(`💾 Base de datos: ${process.env.DB_NAME}`);
            console.log(`\n✅ Backend listo para recibir peticiones\n`);
        });

        // === MANEJAR ERRORES DEL SERVIDOR ===
        server.on('error', (error) => {
            // Si el puerto ya está siendo usado por otro programa
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Puerto ${PORT} ya está en uso`);
            } else {
                console.error('❌ Error del servidor:', error);
            }
            // Terminamos el proceso porque no podemos continuar
            process.exit(1);
        });

        // === CIERRE GRACEFUL DEL SERVIDOR ===
        // SIGTERM es una señal que le dice al proceso que debe terminar
        // Esto puede venir del sistema operativo o de servicios como Vercel
        process.on('SIGTERM', () => {
            console.log('👋 Señal SIGTERM recibida, cerrando servidor...');
            // Cerramos el servidor de forma ordenada (terminando conexiones activas)
            server.close(() => {
                console.log('✅ Servidor cerrado');
                process.exit(0);  // Salimos con código 0 (éxito)
            });
        });

    } catch (error) {
        // Si algo falla al iniciar (BD no conecta, etc.)
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);  // Terminamos el proceso con código 1 (error)
    }
}

// ============================================
// EJECUTAR EL SERVIDOR
// ============================================
// Llamamos a la función para que el servidor arranque
startServer();
