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
    removeTagFromProvider,
    requestLocationChange,
    approveLocationChange,
    setStatusOverride,
} from '../controllers/tallerController.js';
import { verificarToken } from '../middlewares/auth.js';
import { validateCreateProvider, validateCreateReview } from '../middlewares/validate.js';

const router = express.Router();

/**
 * Rutas publicas
 * IMPORTANTE: las rutas con segmentos fijos (/tags, /mine, /approve)
 * deben declararse ANTES de /:id para que Express no las capture como IDs.
 */
router.get('/tags', getTags);
router.get('/mine', verificarToken, getMyProviders);
// Aprobación de mudanza — pública, el JWT embebido en ?token= es la auth
router.get('/approve/:id', approveLocationChange);
router.get('/', getProviders);
router.get('/:id', getProviderById);

/**
 * Rutas protegidas (requieren autenticacion)
 */
router.post('/', verificarToken, validateCreateProvider, createProvider);
router.put('/:id', verificarToken, validateCreateProvider, updateProvider);
router.delete('/:id', verificarToken, deleteProvider);

// Estado manual abierto/cerrado (override independiente del horario)
router.put('/:id/status', verificarToken, setStatusOverride);

// Solicitud de cambio de ubicación (envía email con link de aprobación)
router.post('/:id/request-location-change', verificarToken, requestLocationChange);

// Reviews
router.post('/:id/reviews', verificarToken, validateCreateReview, createReview);

// Tags
router.post('/:id/tags', verificarToken, addTagsToProvider);
router.delete('/:id/tags/:tagId', verificarToken, removeTagFromProvider);

export default router;
