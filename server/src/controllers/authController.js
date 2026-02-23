import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User, Review, Provider, Location } from '../models/index.js';

const googleClient = new OAuth2Client();

const generarToken = (usuario) => {
    return jwt.sign(
        {
            id: usuario.id,
            email: usuario.email,
            role: usuario.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        }
    );
};

export const registrar = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const usuarioExistente = await User.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'No se pudo completar el registro. Verificá los datos o intentá iniciar sesión.' });
        }

        const nuevoUsuario = await User.create({
            name,
            email,
            password_hash: password,
            role: 'user'
        });

        const token = generarToken(nuevoUsuario);

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            usuario: nuevoUsuario,
            token
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            error: 'Error al registrar usuario'
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await User.findOne({ where: { email } });

        const passwordValida = usuario && usuario.password_hash
            ? await usuario.compararPassword(password)
            : false;

        if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = generarToken(usuario);

        res.json({
            mensaje: 'Login exitoso',
            usuario,
            token
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error al iniciar sesión'
        });
    }
};

export const obtenerPerfil = async (req, res) => {
    try {
        const usuario = await User.findByPk(req.usuario.id, {
            include: [
                {
                    model: Review,
                    as: 'reviews',
                    include: [
                        {
                            model: Provider,
                            as: 'provider',
                            attributes: ['id', 'name', 'type'],
                            include: [{ model: Location, as: 'location', attributes: ['city', 'province'] }]
                        }
                    ],
                    order: [['created_at', 'DESC']]
                }
            ]
        });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ success: true, data: usuario });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
};

export const actualizarPerfil = async (req, res) => {
    try {
        const { phone, avatar_url, city, province } = req.body;

        const usuario = await User.findByPk(req.usuario.id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // name is NOT editable after registration
        if (phone !== undefined) usuario.phone = phone;
        if (avatar_url !== undefined) usuario.avatar_url = avatar_url;
        if (city !== undefined) usuario.city = city;
        if (province !== undefined) usuario.province = province;

        await usuario.save();

        res.json({
            success: true,
            mensaje: 'Perfil actualizado exitosamente',
            data: usuario
        });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ error: 'Error al actualizar perfil' });
    }
};

export const cambiarContrasena = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const usuario = await User.findByPk(req.usuario.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const passwordValida = await usuario.compararPassword(currentPassword);
        if (!passwordValida) {
            return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
        }

        usuario.password_hash = newPassword;
        await usuario.save();

        res.json({ success: true, mensaje: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({ error: 'Error al cambiar la contraseña' });
    }
};

export const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ error: 'Token de Google es obligatorio' });
        }

        // Verify Google ID token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Find existing user by google_id or email
        let usuario = await User.findOne({
            where: { google_id: googleId }
        });

        if (!usuario) {
            const cuentaLocal = await User.findOne({ where: { email } });

            if (cuentaLocal) {
                // Existe una cuenta local con ese email - requiere verificación
                return res.status(409).json({
                    error: 'Ya existe una cuenta con este email. Iniciá sesión con tu contraseña para vincular Google.',
                    requires_linking: true,
                    email
                });
            }

            // No existe cuenta, crear nueva desde Google
            usuario = await User.create({
                name,
                email,
                google_id: googleId,
                auth_provider: 'google',
                avatar_url: picture || null,
                role: 'user'
            });
        }

        const token = generarToken(usuario);

        res.json({
            mensaje: 'Login con Google exitoso',
            usuario,
            token
        });
    } catch (error) {
        console.error('Error en Google login:', error);
        res.status(401).json({
            error: 'Token de Google inválido'
        });
    }
};

export const vincularGoogle = async (req, res) => {
    try {
        const { credential, password } = req.body;

        if (!credential || !password) {
            return res.status(400).json({ error: 'Token de Google y contraseña son obligatorios' });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, picture } = payload;

        const usuario = await User.findOne({ where: { email } });
        if (!usuario) {
            return res.status(404).json({ error: 'Cuenta no encontrada' });
        }

        if (usuario.google_id) {
            return res.status(400).json({ error: 'Esta cuenta ya tiene Google vinculado' });
        }

        const passwordValida = await usuario.compararPassword(password);
        if (!passwordValida) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        usuario.google_id = googleId;
        if (!usuario.avatar_url && picture) {
            usuario.avatar_url = picture;
        }
        await usuario.save();

        const token = generarToken(usuario);

        res.json({
            mensaje: 'Google vinculado exitosamente',
            usuario,
            token
        });
    } catch (error) {
        console.error('Error al vincular Google:', error);
        res.status(401).json({ error: 'Token de Google inválido' });
    }
};

export const obtenerPerfilPublico = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await User.findByPk(id, {
            attributes: ['id', 'name', 'avatar_url', 'city', 'province', 'created_at'],
            include: [
                {
                    model: Review,
                    as: 'reviews',
                    include: [
                        {
                            model: Provider,
                            as: 'provider',
                            attributes: ['id', 'name', 'type'],
                            include: [{ model: Location, as: 'location', attributes: ['city', 'province'] }]
                        }
                    ],
                    order: [['created_at', 'DESC']]
                }
            ]
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ success: true, data: usuario });
    } catch (error) {
        console.error('Error al obtener perfil publico:', error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
};
