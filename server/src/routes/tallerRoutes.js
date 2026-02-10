import express from 'express';
import {
    getProviders,
    getProviderById,
    createProvider,
    updateProvider,
    deleteProvider
} from '../controllers/tallerController.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * Rutas publicas
 */
router.get('/', getProviders);
router.get('/:id', getProviderById);

/**
 * Rutas protegidas (requieren autenticacion)
 */
router.post('/', verificarToken, createProvider);
router.put('/:id', verificarToken, updateProvider);
router.delete('/:id', verificarToken, deleteProvider);

export default router;
