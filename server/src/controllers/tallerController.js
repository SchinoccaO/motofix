import { Provider, Location, Review, User, Tag, ProviderTag } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/db.js';
import jwt from 'jsonwebtoken';
import { sendMail } from '../utils/mailer.js';
import cache from '../config/cache.js';
import {
    PROFILE_EDIT_MAX, PROFILE_EDIT_WINDOW_MS,
    REVIEW_COOLDOWN_MS,
    SEARCH_TERMS_MAX,
    LOCATION_TOKEN_EXPIRES,
} from '../config/constants.js';

/**
 * Obtener mis providers (del usuario logueado)
 */
export const getMyProviders = async (req, res) => {
    try {
        const providers = await Provider.findAll({
            where: { owner_id: req.usuario.id },
            include: [
                { model: Location, as: 'location' },
                { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            count: providers.length,
            data: providers
        });
    } catch (error) {
        console.error('Error al obtener mis providers:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener mis providers'
        });
    }
};

/**
 * Obtener todos los providers con filtros opcionales
 */
export const getProviders = async (req, res) => {
    try {
        const { type, city, is_verified, is_active = 'true', search, page, limit } = req.query;

        const pageNum  = Math.max(1, parseInt(page)  || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
        const offset   = (pageNum - 1) * limitNum;

        // Cache key basada en los parámetros de la query
        const cacheKey = `providers:${JSON.stringify({ type, city, is_verified, is_active, search, page: pageNum, limit: limitNum })}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            return res.json({ success: true, ...cached, _cached: true });
        }

        const whereClause = { is_active: is_active === 'true' };

        if (type) {
            whereClause.type = type;
        }

        if (is_verified !== undefined) {
            whereClause.is_verified = is_verified === 'true';
        }

        const locationWhere = {};
        if (city) {
            locationWhere.city = { [Op.like]: `%${city}%` };
        }

        // Búsqueda global: busca en name, description, location y tags
        if (search) {
            const norm = (col) =>
                `LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(${col},'á','a'),'é','e'),'í','i'),'ó','o'),'ú','u'))`;

            const searchTerms = search.trim().split(/\s+/).slice(0, SEARCH_TERMS_MAX);
            const columns = [
                'p.name', 'p.description',
                'l.city', 'l.province', 'l.address',
                't.name'
            ];

            const termConditions = searchTerms.map(() => {
                const colMatches = columns.map(col => `${norm(col)} LIKE ?`).join(' OR ');
                return `(${colMatches})`;
            });

            const replacements = searchTerms.flatMap(term => {
                const normalized = term.toLowerCase()
                    .replace(/[áà]/g, 'a').replace(/[éè]/g, 'e')
                    .replace(/[íì]/g, 'i').replace(/[óò]/g, 'o')
                    .replace(/[úù]/g, 'u');
                return columns.map(() => `%${normalized}%`);
            });

            const [matchingIds] = await sequelize.query(
                `SELECT DISTINCT p.id FROM providers p ` +
                `LEFT JOIN locations l ON l.provider_id = p.id ` +
                `LEFT JOIN provider_tags pt ON pt.provider_id = p.id ` +
                `LEFT JOIN tags t ON t.id = pt.tag_id ` +
                `WHERE ${termConditions.join(' AND ')}`,
                { replacements }
            );

            const ids = matchingIds.map(r => r.id);
            if (ids.length === 0) {
                return res.json({ success: true, count: 0, data: [] });
            }
            whereClause.id = { [Op.in]: ids };
        }

        const { count: total, rows: providers } = await Provider.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Location,
                    as: 'location',
                    ...(city ? { where: locationWhere } : {})
                },
                {
                    model: Tag,
                    as: 'tags',
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                }
            ],
            order: [
                ['average_rating', 'DESC'],
                ['total_reviews', 'DESC']
            ],
            limit: limitNum,
            offset,
            distinct: true,
        });

        const totalPages = Math.ceil(total / limitNum);
        const plainData = providers.map(p => p.toJSON());
        const payload = {
            count: plainData.length,
            total,
            page: pageNum,
            totalPages,
            data: plainData,
        };

        cache.set(cacheKey, payload);

        res.json({ success: true, ...payload });
    } catch (error) {
        console.error('Error al obtener providers:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener providers'
        });
    }
};

/**
 * Obtener un provider por ID con sus reviews y tags
 */
export const getProviderById = async (req, res) => {
    try {
        const { id } = req.params;

        const provider = await Provider.findByPk(id, {
            include: [
                {
                    model: Location,
                    as: 'location'
                },
                {
                    model: Review,
                    as: 'reviews',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'name', 'email']
                        }
                    ],
                    order: [['created_at', 'DESC']]
                },
                {
                    model: Tag,
                    as: 'tags',
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                }
            ]
        });

        if (!provider) {
            return res.status(404).json({
                success: false,
                error: 'Provider no encontrado'
            });
        }

        res.json({
            success: true,
            data: provider
        });
    } catch (error) {
        console.error('Error al obtener provider:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener provider'
        });
    }
};

/**
 * Crear un nuevo provider (requiere autenticacion)
 */
export const createProvider = async (req, res) => {
    try {
        const {
            type,
            name,
            description,
            phone,
            email,
            website,
            address,
            city,
            province,
            country,
            latitude,
            longitude,
            horarios,
            tags
        } = req.body;

        const provider = await Provider.create({
            type,
            name,
            description,
            phone,
            email,
            website,
            owner_id: req.usuario.id,
            ...(horarios !== undefined && { horarios })
        });

        if (address && city && province) {
            await Location.create({
                provider_id: provider.id,
                address,
                city,
                province,
                country: country || 'Argentina',
                latitude,
                longitude
            });
        }

        // Asociar tags si se proporcionaron
        if (tags && Array.isArray(tags) && tags.length > 0) {
            const tagRecords = await Promise.all(
                tags.map(tagName =>
                    Tag.findOrCreate({ where: { name: tagName.trim() } })
                )
            );
            const tagInstances = tagRecords.map(([tag]) => tag);
            await provider.setTags(tagInstances);
        }

        const result = await Provider.findByPk(provider.id, {
            include: [
                { model: Location, as: 'location' },
                { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
            ]
        });

        cache.flushAll(); // Invalidar lista cacheada al crear uno nuevo

        res.status(201).json({
            success: true,
            message: 'Provider creado exitosamente',
            data: result
        });
    } catch (error) {
        console.error('Error al crear provider:', error);
        res.status(500).json({
            success: false,
            error: 'Error al crear provider'
        });
    }
};

/**
 * Actualizar un provider (con rate limiting: máx. 2 ediciones cada 14 días)
 */
export const updateProvider = async (req, res) => {
    try {
        const { id } = req.params;

        const provider = await Provider.findByPk(id);

        if (!provider) {
            return res.status(404).json({
                success: false,
                error: 'Provider no encontrado'
            });
        }

        if (provider.owner_id !== req.usuario.id && req.usuario.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'No tenés permiso para editar este provider'
            });
        }

        // ── Rate limiting de ediciones (solo aplica al owner, no al admin) ─────
        if (req.usuario.role !== 'admin') {
            // 1. Perfil bloqueado esperando validación manual
            if (provider.pending_validation) {
                return res.status(423).json({
                    success: false,
                    error: 'Tu perfil está pendiente de validación manual. Recibirás un email cuando sea aprobado.',
                    code: 'PENDING_VALIDATION'
                });
            }

            const now = new Date();
            let editCount = provider.profile_edit_count ?? 0;
            const windowStart = provider.profile_edit_window_start;

            // 2. Nueva ventana si no existe o venció
            const windowExpired = !windowStart || (now - new Date(windowStart)) > PROFILE_EDIT_WINDOW_MS;
            if (windowExpired) {
                editCount = 0;
                await provider.update({ profile_edit_count: 0, profile_edit_window_start: now });
            }

            // 3. Límite alcanzado → poner en revisión manual
            if (editCount >= PROFILE_EDIT_MAX) {
                await provider.update({ pending_validation: true });
                return res.status(429).json({
                    success: false,
                    error: `Alcanzaste el límite de ${PROFILE_EDIT_MAX} ediciones cada 14 días. Tu perfil quedó en revisión manual y será revisado en las próximas 24 hs.`,
                    code: 'EDIT_LIMIT_REACHED',
                    edits_used: editCount,
                    edits_allowed: PROFILE_EDIT_MAX,
                });
            }

            // 4. Incrementar contador antes de continuar
            await provider.update({
                profile_edit_count: editCount + 1,
                profile_edit_window_start: windowExpired ? now : (windowStart ?? now),
            });
        }

        const {
            type,
            name,
            description,
            phone,
            email,
            website,
            photo_url,
            is_active,
            horarios,
            tags
        } = req.body;

        await provider.update({
            type,
            name,
            description,
            phone,
            email,
            website,
            photo_url,
            is_active,
            ...(horarios !== undefined && { horarios })
        });

        // Actualizar tags si se proporcionaron
        if (tags && Array.isArray(tags)) {
            const tagRecords = await Promise.all(
                tags.map(tagName =>
                    Tag.findOrCreate({ where: { name: tagName.trim() } })
                )
            );
            const tagInstances = tagRecords.map(([tag]) => tag);
            await provider.setTags(tagInstances);
        }

        const result = await Provider.findByPk(id, {
            include: [
                { model: Location, as: 'location' },
                { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
            ]
        });

        cache.flushAll(); // Invalidar lista cacheada al editar

        res.json({
            success: true,
            message: 'Provider actualizado exitosamente',
            data: result
        });
    } catch (error) {
        console.error('Error al actualizar provider:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar provider'
        });
    }
};

/**
 * Crear una review para un provider (requiere autenticacion)
 */
export const createReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment, estimated_time, actual_time } = req.body;

        const provider = await Provider.findByPk(id);
        if (!provider) {
            return res.status(404).json({
                success: false,
                error: 'Provider no encontrado'
            });
        }

        // El dueño no puede reseñar su propio negocio
        if (provider.owner_id === req.usuario.id) {
            return res.status(403).json({
                success: false,
                error: 'No podés dejar una reseña en tu propio negocio'
            });
        }

        // Cooldown entre reviews al mismo provider
        const unaHoraAtras = new Date(Date.now() - REVIEW_COOLDOWN_MS);
        const reviewReciente = await Review.findOne({
            where: {
                user_id: req.usuario.id,
                provider_id: id,
                created_at: { [Op.gte]: unaHoraAtras }
            }
        });
        if (reviewReciente) {
            return res.status(429).json({
                success: false,
                error: 'Ya publicaste una reseña para este taller recientemente. Podés dejar otra después de 1 hora para garantizar que refleje una experiencia de servicio genuina.'
            });
        }

        const review = await Review.create({
            user_id: req.usuario.id,
            provider_id: id,
            rating,
            comment,
            estimated_time: estimated_time || null,
            actual_time: actual_time || null
        });

        // Recalcular promedio y total
        const stats = await Review.findOne({
            where: { provider_id: id },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'avg'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'total']
            ],
            raw: true
        });

        await provider.update({
            average_rating: parseFloat(stats.avg).toFixed(2),
            total_reviews: stats.total
        });

        const result = await Review.findByPk(review.id, {
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
        });

        res.status(201).json({
            success: true,
            message: 'Reseña creada exitosamente',
            data: result
        });
    } catch (error) {
        console.error('Error al crear review:', error);
        res.status(500).json({
            success: false,
            error: 'Error al crear review'
        });
    }
};

/**
 * Eliminar un provider (soft delete)
 */
export const deleteProvider = async (req, res) => {
    try {
        const { id } = req.params;

        const provider = await Provider.findByPk(id);

        if (!provider) {
            return res.status(404).json({
                success: false,
                error: 'Provider no encontrado'
            });
        }

        if (provider.owner_id !== req.usuario.id && req.usuario.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'No tenés permiso para eliminar este provider'
            });
        }

        await provider.update({ is_active: false });

        res.json({
            success: true,
            message: 'Provider desactivado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar provider:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar provider'
        });
    }
};

/**
 * Obtener todos los tags disponibles
 */
export const getTags = async (req, res) => {
    try {
        const tags = await Tag.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']]
        });

        res.json({
            success: true,
            data: tags
        });
    } catch (error) {
        console.error('Error al obtener tags:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener tags'
        });
    }
};

/**
 * Agregar tags a un provider (solo owner o admin)
 */
export const addTagsToProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const { tags } = req.body;

        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Debes proporcionar un array de tags'
            });
        }

        const provider = await Provider.findByPk(id);
        if (!provider) {
            return res.status(404).json({
                success: false,
                error: 'Provider no encontrado'
            });
        }

        if (provider.owner_id !== req.usuario.id && req.usuario.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'No tenés permiso para modificar este provider'
            });
        }

        const tagRecords = await Promise.all(
            tags.map(tagName =>
                Tag.findOrCreate({ where: { name: tagName.trim() } })
            )
        );
        const tagInstances = tagRecords.map(([tag]) => tag);
        await provider.addTags(tagInstances);

        const result = await Provider.findByPk(id, {
            include: [
                { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
            ]
        });

        res.json({
            success: true,
            message: 'Tags agregados exitosamente',
            data: result.tags
        });
    } catch (error) {
        console.error('Error al agregar tags:', error);
        res.status(500).json({
            success: false,
            error: 'Error al agregar tags'
        });
    }
};

/**
 * Solicitar cambio de ubicación.
 * No actualiza las coords directamente — genera un token JWT firmado con los
 * datos de la nueva ubicación y lo embebe en un link de aprobación que se
 * envía por email a motofixoficial@gmail.com.
 * El token expira en 7 días; si el admin no aprueba en ese plazo, el owner
 * debe solicitarlo de nuevo.
 */
export const requestLocationChange = async (req, res) => {
    try {
        const { id } = req.params;
        const { newLat, newLng, newAddress, newCity, newProvince } = req.body;

        if (!newLat || !newLng) {
            return res.status(400).json({ success: false, error: 'Coordenadas requeridas' });
        }

        const provider = await Provider.findByPk(id, {
            include: [{ model: Location, as: 'location' }]
        });

        if (!provider) {
            return res.status(404).json({ success: false, error: 'Provider no encontrado' });
        }

        if (provider.owner_id !== req.usuario.id && req.usuario.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'No tenés permiso para modificar este provider' });
        }

        const oldAddress  = provider.location?.address   ?? '—';
        const oldCity     = provider.location?.city       ?? '—';
        const oldProvince = provider.location?.province   ?? '—';
        const oldLat      = provider.location?.latitude   ?? '—';
        const oldLng      = provider.location?.longitude  ?? '—';

        // Token firmado con los datos de la nueva ubicación
        const approvalToken = jwt.sign(
            { providerId: id, newLat, newLng, newAddress, newCity, newProvince },
            process.env.JWT_SECRET,
            { expiresIn: LOCATION_TOKEN_EXPIRES }
        );

        const API_URL = process.env.API_URL || 'http://localhost:5001';
        const approvalLink = `${API_URL}/api/providers/approve/${id}?token=${approvalToken}`;
        const mapsLink = `https://maps.google.com/?q=${newLat},${newLng}`;

        await sendMail({
            to: 'motofixoficial@gmail.com',
            subject: `🚨 Alerta de Mudanza: ${provider.name} (ID ${id})`,
            html: `
                <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
                  <h2 style="color:#FFB800;border-bottom:2px solid #FFB800;padding-bottom:8px">
                    MotoFIX — Solicitud de cambio de ubicación
                  </h2>
                  <p>El taller <strong>${provider.name}</strong> (ID: ${id}) quiere mudarse.</p>

                  <table style="width:100%;border-collapse:collapse;margin:16px 0">
                    <tr style="background:#f5f5f5">
                      <th style="padding:8px;text-align:left;border:1px solid #ddd">Campo</th>
                      <th style="padding:8px;text-align:left;border:1px solid #ddd">Actual</th>
                      <th style="padding:8px;text-align:left;border:1px solid #ddd">Nueva</th>
                    </tr>
                    <tr>
                      <td style="padding:8px;border:1px solid #ddd">Dirección</td>
                      <td style="padding:8px;border:1px solid #ddd">${oldAddress}</td>
                      <td style="padding:8px;border:1px solid #ddd"><strong>${newAddress || '—'}</strong></td>
                    </tr>
                    <tr style="background:#f5f5f5">
                      <td style="padding:8px;border:1px solid #ddd">Ciudad</td>
                      <td style="padding:8px;border:1px solid #ddd">${oldCity}</td>
                      <td style="padding:8px;border:1px solid #ddd"><strong>${newCity || '—'}</strong></td>
                    </tr>
                    <tr>
                      <td style="padding:8px;border:1px solid #ddd">Provincia</td>
                      <td style="padding:8px;border:1px solid #ddd">${oldProvince}</td>
                      <td style="padding:8px;border:1px solid #ddd"><strong>${newProvince || '—'}</strong></td>
                    </tr>
                    <tr style="background:#f5f5f5">
                      <td style="padding:8px;border:1px solid #ddd">Coordenadas</td>
                      <td style="padding:8px;border:1px solid #ddd">${oldLat}, ${oldLng}</td>
                      <td style="padding:8px;border:1px solid #ddd"><strong>${newLat}, ${newLng}</strong></td>
                    </tr>
                  </table>

                  <p>
                    <a href="${mapsLink}" style="color:#FFB800">
                      📍 Ver nueva ubicación en Google Maps
                    </a>
                  </p>

                  <a href="${approvalLink}"
                     style="display:inline-block;padding:12px 28px;background:#FFB800;color:#181611;
                            font-weight:bold;text-decoration:none;border-radius:8px;margin-top:8px">
                    ✅ APROBAR MUDANZA
                  </a>

                  <p style="color:#999;font-size:12px;margin-top:24px">
                    Este link expira en 7 días. Si no reconocés esta solicitud, ignorá este correo.
                  </p>
                </div>
            `,
        });

        res.json({
            success: true,
            message: 'Solicitud enviada. La nueva ubicación será revisada en las próximas 24 hs.',
        });
    } catch (error) {
        console.error('Error al solicitar cambio de ubicación:', error);
        res.status(500).json({ success: false, error: 'Error al enviar la solicitud de cambio de ubicación' });
    }
};

/**
 * Aprobar cambio de ubicación (endpoint que recibe el click en el email).
 * Verifica el JWT del query param ?token=, actualiza las coords en Location
 * y responde con HTML simple para que el admin vea el resultado en el browser.
 * Ruta: GET /api/providers/approve/:id?token=...  (pública — el token es la auth)
 */
export const approveLocationChange = async (req, res) => {
    try {
        const { id } = req.params;
        const { token } = req.query;

        if (!token) {
            return res.status(400).send(htmlResponse('❌ Token ausente', 'Falta el token de aprobación.', false));
        }

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            return res.status(401).send(htmlResponse('❌ Token inválido o expirado', 'El link de aprobación ya no es válido. Pedile al owner que solicite el cambio nuevamente.', false));
        }

        // Verificar que el token corresponde al provider de la URL
        if (String(payload.providerId) !== String(id)) {
            return res.status(400).send(htmlResponse('❌ Token no corresponde', 'El token no coincide con el provider indicado.', false));
        }

        const { newLat, newLng, newAddress, newCity, newProvince } = payload;

        const location = await Location.findOne({ where: { provider_id: id } });
        if (!location) {
            return res.status(404).send(htmlResponse('❌ Ubicación no encontrada', `No existe registro de ubicación para el provider ID ${id}.`, false));
        }

        await location.update({
            latitude: newLat,
            longitude: newLng,
            address: newAddress,
            city: newCity,
            province: newProvince,
        });

        const provider = await Provider.findByPk(id);
        res.send(htmlResponse(
            '✅ Ubicación actualizada',
            `La nueva ubicación de <strong>${provider?.name ?? `Provider #${id}`}</strong> fue aprobada y guardada correctamente.<br>
            <a href="https://maps.google.com/?q=${newLat},${newLng}" style="color:#FFB800">Ver en Google Maps</a>`,
            true
        ));
    } catch (error) {
        console.error('Error al aprobar cambio de ubicación:', error);
        res.status(500).send(htmlResponse('❌ Error interno', 'Ocurrió un error al procesar la aprobación.', false));
    }
};

/**
 * Cambiar estado manual abierto/cerrado (override independiente del horario).
 * Body: { override: true | false | null }
 *   true  → forzar abierto (feriado especial, horario extendido)
 *   false → forzar cerrado (enfermedad, vacaciones)
 *   null  → volver al horario programado normal
 * Solo el owner o admin pueden cambiarlo.
 */
export const setStatusOverride = async (req, res) => {
    try {
        const { id } = req.params;
        const { override } = req.body;

        if (override !== true && override !== false && override !== null) {
            return res.status(400).json({
                success: false,
                error: 'El campo override debe ser true, false o null.'
            });
        }

        const provider = await Provider.findByPk(id);
        if (!provider) {
            return res.status(404).json({ success: false, error: 'Provider no encontrado' });
        }
        if (provider.owner_id !== req.usuario.id && req.usuario.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'No tenés permiso para modificar este provider' });
        }

        await provider.update({ is_open_override: override });

        const messages = {
            true:  'Marcado como abierto ahora (override manual).',
            false: 'Marcado como cerrado ahora (override manual).',
            null:  'Volviendo al horario programado normal.',
        };

        return res.json({
            success: true,
            data: { is_open_override: override },
            message: messages[String(override)] ?? messages['null'],
        });
    } catch (error) {
        console.error('Error al cambiar estado del provider:', error);
        res.status(500).json({ success: false, error: 'Error al cambiar el estado' });
    }
};

/**
 * Verificar / desverificar un provider (solo admin).
 * Body: { verified: true | false }
 * También libera pending_validation si el admin la aprueba.
 */
export const setProviderVerified = async (req, res) => {
    try {
        if (req.usuario.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Solo administradores pueden verificar talleres' });
        }

        const { id } = req.params;
        const { verified } = req.body;

        if (typeof verified !== 'boolean') {
            return res.status(400).json({ success: false, error: 'El campo verified debe ser true o false' });
        }

        const provider = await Provider.findByPk(id);
        if (!provider) {
            return res.status(404).json({ success: false, error: 'Provider no encontrado' });
        }

        await provider.update({
            is_verified: verified,
            // Si el admin verifica, también resuelve la validación pendiente
            ...(verified && { pending_validation: false }),
        });

        return res.json({
            success: true,
            message: verified ? `"${provider.name}" verificado correctamente.` : `Verificación removida de "${provider.name}".`,
            data: { id: provider.id, is_verified: verified },
        });
    } catch (error) {
        console.error('Error al verificar provider:', error);
        res.status(500).json({ success: false, error: 'Error al verificar el taller' });
    }
};

/** HTML mínimo para respuestas del endpoint de aprobación (se ve en el browser del admin) */
function htmlResponse(title, body, success) {
    const color = success ? '#38A169' : '#E53E3E';
    return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>MotoFIX — ${title}</title></head>
<body style="font-family:sans-serif;max-width:480px;margin:60px auto;text-align:center">
  <h1 style="color:#FFB800">MotoFIX</h1>
  <h2 style="color:${color}">${title}</h2>
  <p style="color:#555">${body}</p>
</body>
</html>`;
}

/**
 * Admin: listar TODOS los providers con info de owner (sin restricción de is_active).
 * Solo admin puede llamar esta ruta.
 * Query params: is_active (all|true|false), pending_validation (true|false), search, page, limit
 */
export const adminGetProviders = async (req, res) => {
    try {
        const { is_active = 'all', pending_validation, search, page, limit } = req.query;

        const pageNum  = Math.max(1, parseInt(page)  || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 30));
        const offset   = (pageNum - 1) * limitNum;

        const whereClause = {};

        if (is_active !== 'all') {
            whereClause.is_active = is_active === 'true';
        }
        if (pending_validation !== undefined) {
            whereClause.pending_validation = pending_validation === 'true';
        }
        if (search) {
            whereClause.name = { [Op.like]: `%${search.trim()}%` };
        }

        const { count: total, rows: providers } = await Provider.findAndCountAll({
            where: whereClause,
            include: [
                { model: Location, as: 'location' },
                { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
                { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } },
            ],
            order: [['created_at', 'DESC']],
            limit: limitNum,
            offset,
            distinct: true,
        });

        res.json({
            success: true,
            data: providers.map(p => p.toJSON()),
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
        });
    } catch (error) {
        console.error('Error adminGetProviders:', error);
        res.status(500).json({ success: false, error: 'Error al obtener providers' });
    }
};

/**
 * Admin: activar o desactivar un provider.
 * Body: { is_active: true | false }
 * Solo admin puede llamar esta ruta.
 */
export const setProviderActive = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        if (typeof is_active !== 'boolean') {
            return res.status(400).json({ success: false, error: 'El campo is_active debe ser true o false' });
        }

        const provider = await Provider.findByPk(id);
        if (!provider) {
            return res.status(404).json({ success: false, error: 'Provider no encontrado' });
        }

        await provider.update({ is_active });
        cache.flushAll();

        return res.json({
            success: true,
            message: is_active ? `"${provider.name}" activado.` : `"${provider.name}" desactivado.`,
            data: { id: provider.id, is_active },
        });
    } catch (error) {
        console.error('Error setProviderActive:', error);
        res.status(500).json({ success: false, error: 'Error al cambiar estado del provider' });
    }
};

/**
 * Quitar un tag de un provider (solo owner o admin)
 */
export const removeTagFromProvider = async (req, res) => {
    try {
        const { id, tagId } = req.params;

        const provider = await Provider.findByPk(id);
        if (!provider) {
            return res.status(404).json({
                success: false,
                error: 'Provider no encontrado'
            });
        }

        if (provider.owner_id !== req.usuario.id && req.usuario.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'No tenés permiso para modificar este provider'
            });
        }

        await ProviderTag.destroy({
            where: { provider_id: id, tag_id: tagId }
        });

        const result = await Provider.findByPk(id, {
            include: [
                { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
            ]
        });

        res.json({
            success: true,
            message: 'Tag eliminado exitosamente',
            data: result.tags
        });
    } catch (error) {
        console.error('Error al eliminar tag:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar tag'
        });
    }
};
