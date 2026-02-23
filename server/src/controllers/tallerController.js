import { Provider, Location, Review, User, Tag, ProviderTag } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/db.js';

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
        const { type, city, is_verified, is_active = 'true', search } = req.query;

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

            const searchTerms = search.trim().split(/\s+/).slice(0, 10);
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

        const providers = await Provider.findAll({
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
            ]
        });

        res.json({
            success: true,
            count: providers.length,
            data: providers
        });
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
            tags
        } = req.body;

        const provider = await Provider.create({
            type,
            name,
            description,
            phone,
            email,
            website,
            owner_id: req.usuario.id
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
 * Actualizar un provider
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

        const {
            type,
            name,
            description,
            phone,
            email,
            website,
            photo_url,
            is_active,
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
            is_active
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

        // Cooldown: 1 hora entre reviews al mismo provider
        const unaHoraAtras = new Date(Date.now() - 60 * 60 * 1000);
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
