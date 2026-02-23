import express from 'express';
import rateLimit from 'express-rate-limit';
import {
    registrar,
    login,
    googleLogin,
    vincularGoogle,
    obtenerPerfil,
    actualizarPerfil,
    cambiarContrasena,
    obtenerPerfilPublico
} from '../controllers/authController.js';
import { verificarToken } from '../middlewares/auth.js';
import {
    validateRegister,
    validateLogin,
    validateUpdateProfile,
    validateChangePassword
} from '../middlewares/validate.js';

const router = express.Router();

// Rate limiters
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // 10 intentos por ventana
    message: { error: 'Demasiados intentos de login. Intentá de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5, // 5 registros por hora por IP
    message: { error: 'Demasiados registros desde esta IP. Intentá de nuevo en 1 hora.' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip
});

const passwordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Demasiados intentos de cambio de contraseña. Intentá de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip
});

// Rutas publicas
router.post('/register', registerLimiter, validateRegister, registrar);
router.post('/login', loginLimiter, validateLogin, login);
router.post('/google', loginLimiter, googleLogin);
router.post('/google/link', loginLimiter, vincularGoogle);
router.get('/users/:id', obtenerPerfilPublico);

// Rutas protegidas
router.get('/perfil', verificarToken, obtenerPerfil);
router.put('/perfil', verificarToken, validateUpdateProfile, actualizarPerfil);
router.put('/cambiar-contrasena', verificarToken, passwordLimiter, validateChangePassword, cambiarContrasena);

export default router;
