import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Verificar token JWT
export const verificarToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Token no proporcionado'
            });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const usuario = await User.findByPk(decoded.id);
        if (!usuario) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        req.usuario = {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            rol: usuario.rol
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        res.status(500).json({ error: 'Error al verificar token' });
    }
};

// Verificar rol del usuario
export const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                error: 'Acceso denegado',
                mensaje: `Esta acción requiere rol: ${rolesPermitidos.join(' o ')}`
            });
        }

        next();
    };
};
