import express from 'express';
import {
    registrar,
    login,
    googleLogin,
    obtenerPerfil,
    actualizarPerfil,
    cambiarContrasena,
    obtenerPerfilPublico
} from '../controllers/authController.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

// Rutas publicas
router.post('/register', registrar);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/users/:id', obtenerPerfilPublico);

// Rutas protegidas
router.get('/perfil', verificarToken, obtenerPerfil);
router.put('/perfil', verificarToken, actualizarPerfil);
router.put('/cambiar-contrasena', verificarToken, cambiarContrasena);

export default router;
