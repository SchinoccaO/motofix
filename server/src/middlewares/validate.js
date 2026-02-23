import { body, param, validationResult } from 'express-validator';

/**
 * Middleware que ejecuta las validaciones y retorna errores si los hay
 */
export const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Datos inválidos',
            details: errors.array().map(e => ({ field: e.path, message: e.msg }))
        });
    }
    next();
};

// --- Auth validations ---

export const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 255 }).withMessage('El nombre no puede superar 255 caracteres'),
    body('email')
        .trim()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/[a-z]/).withMessage('La contraseña debe incluir al menos una minúscula')
        .matches(/[A-Z]/).withMessage('La contraseña debe incluir al menos una mayúscula')
        .matches(/\d/).withMessage('La contraseña debe incluir al menos un número'),
    handleValidation
];

export const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Email inválido'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
    handleValidation
];

export const validateChangePassword = [
    body('currentPassword')
        .notEmpty().withMessage('La contraseña actual es obligatoria'),
    body('newPassword')
        .notEmpty().withMessage('La nueva contraseña es obligatoria')
        .isLength({ min: 8 }).withMessage('La nueva contraseña debe tener al menos 8 caracteres')
        .matches(/[a-z]/).withMessage('La contraseña debe incluir al menos una minúscula')
        .matches(/[A-Z]/).withMessage('La contraseña debe incluir al menos una mayúscula')
        .matches(/\d/).withMessage('La contraseña debe incluir al menos un número'),
    handleValidation
];

export const validateUpdateProfile = [
    body('phone')
        .optional({ values: 'null' })
        .trim()
        .isLength({ max: 30 }).withMessage('El teléfono no puede superar 30 caracteres')
        .matches(/^[+\d\s()-]*$/).withMessage('Formato de teléfono inválido'),
    body('avatar_url')
        .optional({ values: 'null' })
        .trim()
        .isURL({ protocols: ['http', 'https'] }).withMessage('La URL del avatar debe ser una URL válida (http/https)')
        .isLength({ max: 500 }).withMessage('La URL no puede superar 500 caracteres'),
    body('city')
        .optional({ values: 'null' })
        .trim()
        .isLength({ max: 100 }).withMessage('La ciudad no puede superar 100 caracteres'),
    body('province')
        .optional({ values: 'null' })
        .trim()
        .isLength({ max: 100 }).withMessage('La provincia no puede superar 100 caracteres'),
    handleValidation
];

// --- Provider validations ---

export const validateCreateProvider = [
    body('type')
        .notEmpty().withMessage('El tipo es obligatorio')
        .isIn(['shop', 'mechanic', 'parts_store']).withMessage('Tipo inválido'),
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 255 }).withMessage('El nombre no puede superar 255 caracteres'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage('La descripción no puede superar 2000 caracteres'),
    body('phone')
        .optional()
        .trim()
        .isLength({ max: 30 }).withMessage('El teléfono no puede superar 30 caracteres'),
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Email del provider inválido'),
    body('website')
        .optional()
        .trim()
        .isURL({ protocols: ['http', 'https'] }).withMessage('El sitio web debe ser una URL válida (http/https)'),
    body('address')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('La dirección no puede superar 500 caracteres'),
    body('city')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('La ciudad no puede superar 100 caracteres'),
    body('province')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('La provincia no puede superar 100 caracteres'),
    body('latitude')
        .optional()
        .isFloat({ min: -90, max: 90 }).withMessage('Latitud inválida'),
    body('longitude')
        .optional()
        .isFloat({ min: -180, max: 180 }).withMessage('Longitud inválida'),
    body('tags')
        .optional()
        .isArray({ max: 20 }).withMessage('Máximo 20 tags'),
    body('tags.*')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 }).withMessage('Cada tag debe tener entre 1 y 50 caracteres'),
    handleValidation
];

// --- Review validations ---

export const validateCreateReview = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID de provider inválido'),
    body('rating')
        .notEmpty().withMessage('El rating es obligatorio')
        .isInt({ min: 1, max: 5 }).withMessage('El rating debe estar entre 1 y 5'),
    body('comment')
        .trim()
        .notEmpty().withMessage('El comentario es obligatorio')
        .isLength({ max: 2000 }).withMessage('El comentario no puede superar 2000 caracteres'),
    body('estimated_time')
        .optional()
        .isInt({ min: 0 }).withMessage('El tiempo estimado debe ser un número positivo'),
    body('actual_time')
        .optional()
        .isInt({ min: 0 }).withMessage('El tiempo real debe ser un número positivo'),
    handleValidation
];
