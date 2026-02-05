import { Taller, User, Resena } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Obtener todos los talleres con filtros opcionales
 */
export const getTalleres = async (req, res) => {
    try {
        const { ciudad, servicio, verificado, activo = true } = req.query;

        const whereClause = { activo };

        if (ciudad) {
            whereClause.ciudad = { [Op.like]: `%${ciudad}%` };
        }

        if (servicio) {
            whereClause.servicios = { [Op.like]: `%${servicio}%` };
        }

        if (verificado !== undefined) {
            whereClause.verificado = verificado === 'true';
        }

        const talleres = await Taller.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'propietario',
                    attributes: ['id', 'nombre', 'email']
                }
            ],
            order: [
                ['calificacion_promedio', 'DESC'],
                ['total_resenas', 'DESC']
            ]
        });

        res.json({
            success: true,
            count: talleres.length,
            data: talleres
        });
    } catch (error) {
        console.error('Error al obtener talleres:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener talleres',
            message: error.message
        });
    }
};

/**
 * Obtener un taller por ID con sus reseñas
 */
export const getTallerById = async (req, res) => {
    try {
        const { id } = req.params;

        const taller = await Taller.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'propietario',
                    attributes: ['id', 'nombre', 'email']
                },
                {
                    model: Resena,
                    as: 'resenas',
                    include: [
                        {
                            model: User,
                            as: 'usuario',
                            attributes: ['id', 'nombre']
                        }
                    ],
                    order: [['created_at', 'DESC']]
                }
            ]
        });

        if (!taller) {
            return res.status(404).json({
                success: false,
                error: 'Taller no encontrado'
            });
        }

        res.json({
            success: true,
            data: taller
        });
    } catch (error) {
        console.error('Error al obtener taller:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener taller',
            message: error.message
        });
    }
};

/**
 * Crear un nuevo taller (requiere autenticación)
 */
export const createTaller = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            direccion,
            ciudad,
            telefono,
            whatsapp,
            email,
            servicios,
            horarios,
            marcas_atendidas,
            latitud,
            longitud
        } = req.body;

        // El usuario_id viene del middleware de autenticación
        const usuario_id = req.user?.id;

        if (!usuario_id) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no autenticado'
            });
        }

        const taller = await Taller.create({
            usuario_id,
            nombre,
            descripcion,
            direccion,
            ciudad,
            telefono,
            whatsapp,
            email,
            servicios,
            horarios,
            marcas_atendidas,
            latitud,
            longitud,
            verificado: false,
            activo: true
        });

        res.status(201).json({
            success: true,
            message: 'Taller creado exitosamente',
            data: taller
        });
    } catch (error) {
        console.error('Error al crear taller:', error);
        res.status(500).json({
            success: false,
            error: 'Error al crear taller',
            message: error.message
        });
    }
};

/**
 * Actualizar un taller (requiere autenticación y ser propietario)
 */
export const updateTaller = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario_id = req.user?.id;

        const taller = await Taller.findByPk(id);

        if (!taller) {
            return res.status(404).json({
                success: false,
                error: 'Taller no encontrado'
            });
        }

        // Verificar que el usuario es el propietario
        if (taller.usuario_id !== usuario_id && req.user?.rol !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'No tienes permiso para actualizar este taller'
            });
        }

        const {
            nombre,
            descripcion,
            direccion,
            ciudad,
            telefono,
            whatsapp,
            email,
            servicios,
            horarios,
            marcas_atendidas,
            latitud,
            longitud,
            activo
        } = req.body;

        await taller.update({
            nombre,
            descripcion,
            direccion,
            ciudad,
            telefono,
            whatsapp,
            email,
            servicios,
            horarios,
            marcas_atendidas,
            latitud,
            longitud,
            activo
        });

        res.json({
            success: true,
            message: 'Taller actualizado exitosamente',
            data: taller
        });
    } catch (error) {
        console.error('Error al actualizar taller:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar taller',
            message: error.message
        });
    }
};

/**
 * Eliminar un taller (soft delete)
 */
export const deleteTaller = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario_id = req.user?.id;

        const taller = await Taller.findByPk(id);

        if (!taller) {
            return res.status(404).json({
                success: false,
                error: 'Taller no encontrado'
            });
        }

        // Verificar permisos
        if (taller.usuario_id !== usuario_id && req.user?.rol !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'No tienes permiso para eliminar este taller'
            });
        }

        // Soft delete
        await taller.update({ activo: false });

        res.json({
            success: true,
            message: 'Taller desactivado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar taller:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar taller',
            message: error.message
        });
    }
};
