import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

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
            name: usuario.name,
            role: usuario.role
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

export const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        if (!rolesPermitidos.includes(req.usuario.role)) {
            return res.status(403).json({
                error: 'Acceso denegado',
                mensaje: `Esta acción requiere rol: ${rolesPermitidos.join(' o ')}`
            });
        }

        next();
    };
};
