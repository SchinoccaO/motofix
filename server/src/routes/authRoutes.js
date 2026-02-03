// ============================================
// ARCHIVO DE RUTAS DE AUTENTICACIÓN (authRoutes)
// ============================================
// Este archivo define las URLs (endpoints) relacionados con autenticación
// Las rutas conectan una URL con una función del controlador

import express from 'express';
// Importamos las funciones del controlador (la lógica de cada endpoint)
import {
    registrar,
    login,
    obtenerPerfil,
    actualizarPerfil
} from '../controllers/authController.js';
// Importamos el middleware que verifica si el usuario está autenticado
import { verificarToken } from '../middlewares/auth.js';

// Creamos un router (objeto que maneja rutas)
const router = express.Router();

// ============================================
// RUTAS PÚBLICAS (no requieren autenticación)
// ============================================
// Cualquiera puede acceder a estas rutas sin estar logueado

// POST /api/auth/register - Registrar un nuevo usuario
// Cuando alguien hace POST a /api/auth/register, se ejecuta la función 'registrar'
router.post('/register', registrar);

// POST /api/auth/login - Iniciar sesión
// Cuando alguien hace POST a /api/auth/login, se ejecuta la función 'login'
router.post('/login', login);

// ============================================
// RUTAS PROTEGIDAS (requieren token JWT)
// ============================================
// Estas rutas solo funcionan si el usuario envía un token válido
// verificarToken es un MIDDLEWARE que se ejecuta ANTES del controlador
// Si el token es válido, continúa; si no, devuelve error 401

// GET /api/auth/perfil - Ver mi perfil
// Primero verifica el token, luego ejecuta obtenerPerfil
router.get('/perfil', verificarToken, obtenerPerfil);

// PUT /api/auth/perfil - Actualizar mi perfil
// Primero verifica el token, luego ejecuta actualizarPerfil
router.put('/perfil', verificarToken, actualizarPerfil);

// Exportamos el router para usarlo en index.js
export default router;
