import express from 'express';
import rateLimit from 'express-rate-limit';
import {
    LOGIN_WINDOW_MS, LOGIN_MAX_ATTEMPTS,
    REGISTER_WINDOW_MS, REGISTER_MAX_ATTEMPTS,
    PASSWORD_WINDOW_MS, PASSWORD_MAX_ATTEMPTS,
    FORGOT_PASSWORD_WINDOW_MS, FORGOT_PASSWORD_MAX_ATTEMPTS,
} from '../config/constants.js';
import {
    registrar,
    login,
    googleLogin,
    vincularGoogle,
    obtenerPerfil,
    actualizarPerfil,
    cambiarContrasena,
    obtenerPerfilPublico,
    forgotPassword,
    resetPassword,
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
// express-rate-limit v8: el keyGenerator personalizado con req.ip requiere el helper
// ipKeyGenerator. Como el comportamiento es idéntico al default, simplemente lo removemos.
const loginLimiter = rateLimit({
    windowMs: LOGIN_WINDOW_MS,
    max: LOGIN_MAX_ATTEMPTS,
    message: { error: 'Demasiados intentos de login. Intentá de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const registerLimiter = rateLimit({
    windowMs: REGISTER_WINDOW_MS,
    max: REGISTER_MAX_ATTEMPTS,
    message: { error: 'Demasiados registros desde esta IP. Intentá de nuevo en 1 hora.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const passwordLimiter = rateLimit({
    windowMs: PASSWORD_WINDOW_MS,
    max: PASSWORD_MAX_ATTEMPTS,
    message: { error: 'Demasiados intentos de cambio de contraseña. Intentá de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
    windowMs: FORGOT_PASSWORD_WINDOW_MS,
    max: FORGOT_PASSWORD_MAX_ATTEMPTS,
    message: { error: 'Demasiados intentos. Esperá 15 minutos antes de volver a intentarlo.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rutas publicas
router.post('/register', registerLimiter, validateRegister, registrar);
router.post('/login', loginLimiter, validateLogin, login);
router.post('/google', loginLimiter, googleLogin);
router.post('/google/link', loginLimiter, vincularGoogle);
router.get('/users/:id', obtenerPerfilPublico);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

// Rutas protegidas
router.get('/perfil', verificarToken, obtenerPerfil);
router.put('/perfil', verificarToken, validateUpdateProfile, actualizarPerfil);
router.put('/cambiar-contrasena', verificarToken, passwordLimiter, validateChangePassword, cambiarContrasena);

export default router;
