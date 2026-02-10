import { Provider, Location, Review, User } from '../models/index.js';
import { Op } from 'sequelize';

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
            website
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

        const {
            type,
            name,
            description,
            phone,
            email,
            website,
            is_active
        } = req.body;

        await provider.update({
            type,
            name,
            description,
            phone,
            email,
            website,
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
