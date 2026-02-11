import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize, { testConnection } from './config/db.js';
import './models/index.js'; // Cargar modelos y relaciones
import tallerRoutes from './routes/tallerRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:5174'],
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

// Health check (con verificación de DB para Render)
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: 'OK',
      message: 'MotoFIX API is running',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      message: 'MotoFIX API is running but database is unreachable',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// Routes (placeholder)
app.get('/api', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de MotoFIX',
    version: '1.0.0',
    orm: 'Sequelize',
    endpoints: {
      providers: '/api/providers',
      users: '/api/users',
      reviews: '/api/reviews'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/providers', tallerRoutes);

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
  // Primero arrancamos el servidor HTTP (Render necesita que el puerto esté escuchando)
  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📦 ORM: Sequelize`);
  });

  // Luego intentamos conectar a la DB (sin crashear si falla)
  try {
    await testConnection();
    
    await sequelize.sync({ 
      alter: false,
      force: false 
    });
    console.log('✅ Modelos sincronizados con la base de datos');
    console.log(`💾 Base de datos: ${process.env.DB_NAME || 'TiDB Cloud'}`);
    console.log(`\n✅ Backend listo para recibir peticiones\n`);
  } catch (error) {
    console.error('⚠️ Servidor arrancó pero la DB no está disponible:', error.message);
    console.error('El endpoint /api/health reportará el estado de la DB');
  }
}

startServer();
