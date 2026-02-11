import { Provider, Location, Review, User } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/db.js';

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

        if (search) {
            whereClause.name = { [Op.like]: `%${search}%` };
        }

        const locationWhere = {};
        if (city) {
            locationWhere.city = { [Op.like]: `%${city}%` };
        }

        const providers = await Provider.findAll({
            where: whereClause,
            include: [
                {
                    model: Location,
                    as: 'location',
                    ...(city ? { where: locationWhere } : {})
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
            error: 'Error al obtener providers',
            message: error.message
        });
    }
};

/**
 * Obtener un provider por ID con sus reviews
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
            error: 'Error al obtener provider',
            message: error.message
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
            longitude
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

        const result = await Provider.findByPk(provider.id, {
            include: [{ model: Location, as: 'location' }]
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
            error: 'Error al crear provider',
            message: error.message
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
            is_active
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

        res.json({
            success: true,
            message: 'Provider actualizado exitosamente',
            data: provider
        });
    } catch (error) {
        console.error('Error al actualizar provider:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar provider',
            message: error.message
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

        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                error: 'Rating y comentario son obligatorios'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                error: 'El rating debe estar entre 1 y 5'
            });
        }

        const provider = await Provider.findByPk(id);
        if (!provider) {
            return res.status(404).json({
                success: false,
                error: 'Provider no encontrado'
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
            error: 'Error al crear review',
            message: error.message
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
            error: 'Error al eliminar provider',
            message: error.message
        });
    }
};
