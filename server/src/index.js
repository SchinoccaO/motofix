import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize, { testConnection } from './config/db.js';
import './models/index.js'; // Cargar modelos y relaciones
import authRoutes from './routes/authRoutes.js';
import tallerRoutes from './routes/tallerRoutes.js';
import resenaRoutes from './routes/resenaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Manejar rechazos de promesas y excepciones no capturadas
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada sin manejar:', reason);
    console.error('Promesa:', promise);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Excepción no capturada:', error);
    process.exit(1);
});

// Middlewares
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:5173', 'http://localhost:3001'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de talleres
app.use('/api/talleres', tallerRoutes);

// Rutas de reseñas
app.use('/api/resenas', resenaRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'MotoYA API is running',
        database: 'MySQL + Sequelize',
        timestamp: new Date().toISOString()
    });
});

// Routes (placeholder)
app.get('/api', (req, res) => {
    res.json({
        message: 'Bienvenido a la API de MotoYA',
        version: '1.0.0',
        orm: 'Sequelize',
        endpoints: {
            auth: '/api/auth (register, login, perfil)',
            talleres: '/api/talleres',
            usuarios: '/api/usuarios',
            resenas: '/api/resenas'
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint no encontrado',
        path: req.originalUrl
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Iniciar servidor
async function startServer() {
    try {
        // Verificar conexión a DB
        await testConnection();

        // NO sincronizar modelos - las tablas ya existen y evita errores de índices
        // await sequelize.sync({
        //     alter: false,
        //     force: false
        // });
        console.log('✅ Usando tablas existentes en la base de datos');

        const server = app.listen(PORT, () => {
            console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📦 ORM: Sequelize`);
            console.log(`💾 Base de datos: ${process.env.DB_NAME}`);
            console.log(`\n✅ Backend listo para recibir peticiones\n`);
        });

        // Manejar errores del servidor
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Puerto ${PORT} ya está en uso`);
            } else {
                console.error('❌ Error del servidor:', error);
            }
            process.exit(1);
        });

        // Manejar cierre graceful
        process.on('SIGTERM', () => {
            console.log('👋 Señal SIGTERM recibida, cerrando servidor...');
            server.close(() => {
                console.log('✅ Servidor cerrado');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();
