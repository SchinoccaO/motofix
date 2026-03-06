import { body, param, validationResult } from 'express-validator';
import {
    NAME_MAX, EMAIL_MAX, PHONE_MAX, URL_MAX, CITY_MAX, PROVINCE_MAX,
    ADDRESS_MAX, DESCRIPTION_MAX, COMMENT_MAX,
    PASSWORD_MIN,
    RATING_MIN, RATING_MAX,
    LAT_MIN, LAT_MAX, LNG_MIN, LNG_MAX,
    TAGS_PER_PROVIDER_MAX, TAG_NAME_MIN, TAG_NAME_MAX,
    PROVIDER_TYPES,
} from '../config/constants.js';

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
        .isLength({ max: NAME_MAX }).withMessage(`El nombre no puede superar ${NAME_MAX} caracteres`),
    body('email')
        .trim()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Email inválido')
        .isLength({ max: EMAIL_MAX }).withMessage(`El email no puede superar ${EMAIL_MAX} caracteres`)
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: PASSWORD_MIN }).withMessage(`La contraseña debe tener al menos ${PASSWORD_MIN} caracteres`)
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
        .isLength({ min: PASSWORD_MIN }).withMessage(`La nueva contraseña debe tener al menos ${PASSWORD_MIN} caracteres`)
        .matches(/[a-z]/).withMessage('La contraseña debe incluir al menos una minúscula')
        .matches(/[A-Z]/).withMessage('La contraseña debe incluir al menos una mayúscula')
        .matches(/\d/).withMessage('La contraseña debe incluir al menos un número'),
    handleValidation
];

export const validateUpdateProfile = [
    body('phone')
        .optional({ values: 'null' })
        .trim()
        .isLength({ max: PHONE_MAX }).withMessage(`El teléfono no puede superar ${PHONE_MAX} caracteres`)
        .matches(/^[+\d\s()-]*$/).withMessage('Formato de teléfono inválido'),
    body('avatar_url')
        .optional({ values: 'null' })
        .trim()
        .isURL({ protocols: ['http', 'https'] }).withMessage('La URL del avatar debe ser una URL válida (http/https)')
        .isLength({ max: URL_MAX }).withMessage(`La URL no puede superar ${URL_MAX} caracteres`),
    body('city')
        .optional({ values: 'null' })
        .trim()
        .isLength({ max: CITY_MAX }).withMessage(`La ciudad no puede superar ${CITY_MAX} caracteres`),
    body('province')
        .optional({ values: 'null' })
        .trim()
        .isLength({ max: PROVINCE_MAX }).withMessage(`La provincia no puede superar ${PROVINCE_MAX} caracteres`),
    handleValidation
];

// --- Provider validations ---

export const validateCreateProvider = [
    body('type')
        .notEmpty().withMessage('El tipo es obligatorio')
        .isIn(PROVIDER_TYPES).withMessage('Tipo inválido'),
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: NAME_MAX }).withMessage(`El nombre no puede superar ${NAME_MAX} caracteres`),
    body('description')
        .optional()
        .trim()
        .isLength({ max: DESCRIPTION_MAX }).withMessage(`La descripción no puede superar ${DESCRIPTION_MAX} caracteres`),
    body('phone')
        .optional({ values: 'null' })
        .trim()
        .isLength({ max: PHONE_MAX }).withMessage(`El teléfono no puede superar ${PHONE_MAX} caracteres`)
        .matches(/^[+\d\s()-]*$/).withMessage('Formato de teléfono inválido'),
    body('email')
        .optional({ values: 'null' })
        .trim()
        .isEmail().withMessage('Email del provider inválido')
        .isLength({ max: EMAIL_MAX }).withMessage(`El email no puede superar ${EMAIL_MAX} caracteres`),
    body('website')
        .optional({ values: 'null' })
        .trim()
        .isURL({ protocols: ['http', 'https'] }).withMessage('El sitio web debe ser una URL válida (http/https)')
        .isLength({ max: URL_MAX }).withMessage(`La URL no puede superar ${URL_MAX} caracteres`),
    body('address')
        .optional({ values: 'null' })
        .trim()
        .isLength({ max: ADDRESS_MAX }).withMessage(`La dirección no puede superar ${ADDRESS_MAX} caracteres`),
    body('city')
        .optional({ values: 'null' })
        .trim()
        .isLength({ max: CITY_MAX }).withMessage(`La ciudad no puede superar ${CITY_MAX} caracteres`),
    body('province')
        .optional({ values: 'null' })
        .trim()
        .isLength({ max: PROVINCE_MAX }).withMessage(`La provincia no puede superar ${PROVINCE_MAX} caracteres`),
    body('latitude')
        .optional({ values: 'null' })
        .isFloat({ min: LAT_MIN, max: LAT_MAX }).withMessage('Latitud inválida'),
    body('longitude')
        .optional({ values: 'null' })
        .isFloat({ min: LNG_MIN, max: LNG_MAX }).withMessage('Longitud inválida'),
    body('tags')
        .optional({ values: 'null' })
        .isArray({ max: TAGS_PER_PROVIDER_MAX }).withMessage(`Máximo ${TAGS_PER_PROVIDER_MAX} tags`),
    body('tags.*')
        .trim()
        .notEmpty().withMessage('Los tags no pueden estar vacíos')
        .isLength({ min: TAG_NAME_MIN, max: TAG_NAME_MAX }).withMessage(`Cada tag debe tener entre ${TAG_NAME_MIN} y ${TAG_NAME_MAX} caracteres`),
    handleValidation
];

// --- Review validations ---

export const validateCreateReview = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID de provider inválido'),
    body('rating')
        .notEmpty().withMessage('El rating es obligatorio')
        .isInt({ min: RATING_MIN, max: RATING_MAX }).withMessage(`El rating debe estar entre ${RATING_MIN} y ${RATING_MAX}`),
    body('comment')
        .trim()
        .notEmpty().withMessage('El comentario es obligatorio')
        .isLength({ max: COMMENT_MAX }).withMessage(`El comentario no puede superar ${COMMENT_MAX} caracteres`),
    body('estimated_time')
        .optional()
        .isInt({ min: 0, max: 43200 }).withMessage('El tiempo estimado debe ser un número entre 0 y 43200 minutos'),
    body('actual_time')
        .optional()
        .isInt({ min: 0, max: 43200 }).withMessage('El tiempo real debe ser un número entre 0 y 43200 minutos'),
    handleValidation
];
