import express from 'express';
import {
    getTalleres,
    getTallerById,
    createTaller,
    updateTaller,
    deleteTaller
} from '../controllers/tallerController.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * Rutas públicas
 */
router.get('/', getTalleres);
router.get('/:id', getTallerById);

/**
 * Rutas protegidas (requieren autenticación)
 */
router.post('/', verificarToken, createTaller);
router.put('/:id', verificarToken, updateTaller);
router.delete('/:id', verificarToken, deleteTaller);

export default router;
