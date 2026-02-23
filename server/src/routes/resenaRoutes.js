import express from 'express';
import {
    getResenasByTaller,
    createResena,
    responderResena,
    votarResena,
    reportarResena
} from '../controllers/resenaController.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * Rutas públicas
 */
router.get('/taller/:tallerId', getResenasByTaller);

/**
 * Rutas protegidas (requieren autenticación)
 */
router.post('/', verificarToken, createResena);
router.put('/:id/responder', verificarToken, responderResena);
router.post('/:id/votar', verificarToken, votarResena);
router.post('/:id/reportar', verificarToken, reportarResena);

export default router;
