import express from 'express';
import {
    registrar,
    login,
    obtenerPerfil,
    actualizarPerfil
} from '../controllers/authController.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', registrar);
router.post('/login', login);

// Rutas protegidas (requieren token)
router.get('/perfil', verificarToken, obtenerPerfil);
router.put('/perfil', verificarToken, actualizarPerfil);

export default router;
