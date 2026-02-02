import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize, { testConnection } from './config/db.js';
import './models/index.js'; // Cargar modelos y relaciones

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'http://localhost:3001'],
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
    
    // Sincronizar modelos (crear tablas si no existen)
    // ⚠️ alter: true SOLO para desarrollo inicial
    // En producción usar migraciones de Sequelize
    await sequelize.sync({ 
      alter: false, // Cambiado a false para evitar ALTER constantes
      force: false 
    });
    console.log('✅ Modelos sincronizados con la base de datos');
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📦 ORM: Sequelize`);
      console.log(`💾 Base de datos: ${process.env.DB_NAME}`);
      console.log(`\n✅ Backend listo para recibir peticiones\n`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();
