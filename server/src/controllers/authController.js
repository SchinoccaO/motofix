import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { OAuth2Client } from 'google-auth-library';
import { User, Review, Provider, Location } from '../models/index.js';
import { sendMail } from '../utils/mailer.js';
import { RESET_PASSWORD_TOKEN_EXPIRES } from '../config/constants.js';

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

/**
 * Forgot password — genera un token JWT firmado y envía el link por email.
 * Siempre responde con el mismo mensaje para no revelar si el email existe.
 */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'El email es requerido.' });

        const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });

        // Si no existe o es cuenta Google (no tiene contraseña local), devolvemos éxito igual
        if (user && user.auth_provider !== 'google') {
            const resetToken = jwt.sign(
                { id: user.id, email: user.email, type: 'password-reset' },
                process.env.JWT_SECRET,
                { expiresIn: RESET_PASSWORD_TOKEN_EXPIRES }
            );

            const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
            const resetLink = `${CLIENT_URL}/restablecer-contrasena?token=${resetToken}`;

            console.log('[forgot-password] Enviando mail a:', user.email, '| RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'OK' : 'NO CONFIGURADO', '| CLIENT_URL:', process.env.CLIENT_URL || 'localhost (FALTA)');

            try {
                await sendMail({
                    to: user.email,
                    subject: '🔑 Restablecer contraseña — MotoFIX',
                    html: `
                      <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
                        <h2 style="color:#FFB800;border-bottom:2px solid #FFB800;padding-bottom:8px">
                          MotoFIX — Restablecé tu contraseña
                        </h2>
                        <p>Hola <strong>${user.name}</strong>,</p>
                        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
                        <p>Hacé clic en el botón para crear una nueva contraseña. El link expira en <strong>1 hora</strong>.</p>
                        <a href="${resetLink}"
                           style="display:inline-block;padding:12px 28px;background:#FFB800;color:#181611;
                                  font-weight:bold;text-decoration:none;border-radius:8px;margin:16px 0">
                          🔑 Restablecer contraseña
                        </a>
                        <p style="color:#999;font-size:12px;margin-top:24px">
                          Si no solicitaste esto, ignorá este correo. Tu contraseña no cambia.
                        </p>
                      </div>
                    `,
                });
                console.log('[forgot-password] Mail enviado OK a:', user.email);
            } catch (mailError) {
                console.error('[forgot-password] Error SMTP:', mailError.message);
            }
        }

        // Respuesta genérica siempre
        res.json({
            success: true,
            message: 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña en breve.',
        });
    } catch (error) {
        console.error('Error en forgot password:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
};

/**
 * Reset password — verifica el token JWT y actualiza la contraseña.
 * El hook beforeUpdate del modelo se encarga de hashear.
 */
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token y nueva contraseña son requeridos.' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
        }

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            return res.status(400).json({ error: 'El enlace es inválido o ya expiró. Solicitá uno nuevo.' });
        }

        if (payload.type !== 'password-reset') {
            return res.status(400).json({ error: 'Token inválido.' });
        }

        const user = await User.findByPk(payload.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });

        // beforeUpdate hook hashea automáticamente si password_hash cambió
        await user.update({ password_hash: newPassword });

        res.json({ success: true, message: 'Contraseña actualizada correctamente. Ya podés iniciar sesión.' });
    } catch (error) {
        console.error('Error en reset password:', error);
        res.status(500).json({ error: 'Error al restablecer la contraseña.' });
    }
};

/**
 * Admin: listar todos los usuarios con conteo de providers que poseen.
 * Query params: search (name o email), page, limit
 */
export const adminListUsers = async (req, res) => {
    try {
        const { search, page, limit } = req.query;

        const pageNum  = Math.max(1, parseInt(page)  || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 30));
        const offset   = (pageNum - 1) * limitNum;

        const whereClause = {};
        if (search) {
            const term = `%${search.trim()}%`;
            whereClause[Op.or] = [
                { name:  { [Op.like]: term } },
                { email: { [Op.like]: term } },
            ];
        }

        const { count: total, rows: users } = await User.findAndCountAll({
            where: whereClause,
            attributes: ['id', 'name', 'email', 'role', 'city', 'province', 'avatar_url', 'auth_provider', 'is_active', 'created_at'],
            include: [
                {
                    model: Provider,
                    as: 'providers',
                    attributes: ['id'],
                    required: false,
                }
            ],
            order: [['created_at', 'DESC']],
            limit: limitNum,
            offset,
            distinct: true,
        });

        const data = users.map(u => {
            const plain = u.toJSON();
            plain.providers_count = plain.providers?.length ?? 0;
            delete plain.providers;
            return plain;
        });

        res.json({ success: true, data, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
    } catch (error) {
        console.error('Error adminListUsers:', error);
        res.status(500).json({ error: 'Error al listar usuarios' });
    }
};

/**
 * Admin: cambiar el rol de un usuario a 'admin' o 'user'.
 * Body: { role: 'admin' | 'user' }
 * No se puede cambiar el propio rol (prevención de lockout accidental).
 */
export const adminSetUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ error: 'El rol debe ser "admin" o "user"' });
        }

        if (String(req.usuario.id) === String(id)) {
            return res.status(400).json({ error: 'No podés cambiar tu propio rol' });
        }

        const usuario = await User.findByPk(id, {
            attributes: ['id', 'name', 'email', 'role']
        });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await usuario.update({ role });

        res.json({
            success: true,
            message: role === 'admin'
                ? `${usuario.name} ahora es administrador.`
                : `${usuario.name} ya no es administrador.`,
            data: { id: usuario.id, role },
        });
    } catch (error) {
        console.error('Error adminSetUserRole:', error);
        res.status(500).json({ error: 'Error al cambiar el rol' });
    }
};
