// ============================================
// MIDDLEWARE DE AUTENTICACIÓN (auth.js)
// ============================================
// Un middleware es una función que se ejecuta ENTRE la petición y la respuesta
// Este archivo contiene middlewares para verificar si un usuario está autenticado

import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// ============================================
// MIDDLEWARE: VERIFICAR TOKEN JWT
// ============================================
// Este middleware verifica si el usuario envió un token válido en los headers
// Se usa en rutas protegidas (ej: ver perfil, crear taller, dejar reseña)
export const verificarToken = async (req, res, next) => {
    try {
        // === PASO 1: EXTRAER EL TOKEN DEL HEADER ===
        // Los tokens se envían en el header "Authorization" con formato:
        // Authorization: Bearer <token_aqui>
        const authHeader = req.headers.authorization;

        // Verificar que exista el header y que empiece con "Bearer "
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Token no proporcionado'
            });
        }

        // Extraer solo el token (quitamos "Bearer " que son 7 caracteres)
        const token = authHeader.substring(7);

        // === PASO 2: VERIFICAR Y DECODIFICAR EL TOKEN ===
        // jwt.verify() verifica que:
        // 1. El token no haya sido alterado
        // 2. La firma sea válida (usando JWT_SECRET)
        // 3. El token no haya expirado
        // Devuelve los datos que guardamos en el token (id, email, rol)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // === PASO 3: BUSCAR AL USUARIO EN LA BASE DE DATOS ===
        // Aunque el token sea válido, verificamos que el usuario todavía exista
        // (podría haberse eliminado después de que se generó el token)
        const usuario = await User.findByPk(decoded.id);
        if (!usuario) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        // === PASO 4: AGREGAR INFO DEL USUARIO A LA REQUEST ===
        // Guardamos los datos del usuario en req.usuario
        // Así los controladores pueden saber quién está haciendo la petición
        req.usuario = {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            rol: usuario.rol
        };

        // === PASO 5: CONTINUAR AL SIGUIENTE MIDDLEWARE/CONTROLADOR ===
        // next() le dice a Express: "todo bien, sigue con la siguiente función"
        next();

    } catch (error) {
        // === MANEJO DE ERRORES ESPECÍFICOS ===

        // Error: Token mal formado o firma inválida
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }

        // Error: Token expirado (pasaron los 7 días)
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }

        // Cualquier otro error
        res.status(500).json({ error: 'Error al verificar token' });
    }
};

// ============================================
// MIDDLEWARE: VERIFICAR ROL DEL USUARIO
// ============================================
// Este middleware verifica si el usuario tiene un rol específico
// Ejemplo de uso: solo 'mecanico' puede crear talleres
// Esta es una "función que devuelve otra función" (Higher Order Function)
export const verificarRol = (rolesPermitidos) => {
    // rolesPermitidos es un array, ej: ['mecanico', 'admin']

    // Devolvemos el middleware real
    return (req, res, next) => {
        // Verificar que req.usuario exista (debería existir si pasó por verificarToken)
        if (!req.usuario) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        // Verificar si el rol del usuario está en la lista de roles permitidos
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            // Código 403 = Forbidden (autenticado pero sin permisos)
            return res.status(403).json({
                error: 'Acceso denegado',
                mensaje: `Esta acción requiere rol: ${rolesPermitidos.join(' o ')}`
            });
        }

        // Si tiene el rol correcto, continuar
        next();
    };
};
