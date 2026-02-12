import express from 'express';
import {
    getProviders,
    getProviderById,
    getMyProviders,
    createProvider,
    updateProvider,
    deleteProvider,
    createReview,
    getTags,
    addTagsToProvider,
    removeTagFromProvider
} from '../controllers/tallerController.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * Rutas publicas
 */
router.get('/tags', getTags);
router.get('/mine', verificarToken, getMyProviders);
router.get('/', getProviders);
router.get('/:id', getProviderById);

/**
 * Rutas protegidas (requieren autenticacion)
 */
router.post('/', verificarToken, createProvider);
router.put('/:id', verificarToken, updateProvider);
router.delete('/:id', verificarToken, deleteProvider);

// Reviews
router.post('/:id/reviews', verificarToken, createReview);

// Tags
router.post('/:id/tags', verificarToken, addTagsToProvider);
router.delete('/:id/tags/:tagId', verificarToken, removeTagFromProvider);

export default router;
