import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        const token = authHeader.substring(7);

        // jwt.verify valida la firma criptográficamente y el campo exp.
        // El payload ya contiene { id, email, role } — no hace falta ir a la DB.
        req.usuario = jwt.verify(token, process.env.JWT_SECRET);

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        return res.status(401).json({ error: 'Token inválido' });
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
