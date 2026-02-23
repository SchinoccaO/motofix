import { Resena, User, Taller } from '../models/index.js';
import sequelize from '../config/db.js';

/**
 * Obtener reseñas de un taller específico
 */
export const getResenasByTaller = async (req, res) => {
    try {
        const { tallerId } = req.params;

        const resenas = await Resena.findAll({
            where: { taller_id: tallerId },
            include: [
                {
                    model: User,
                    as: 'usuario',
                    attributes: ['id', 'nombre']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            count: resenas.length,
            data: resenas
        });
    } catch (error) {
        console.error('Error al obtener reseñas:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener reseñas',
        });
    }
};

/**
 * Crear una nueva reseña (requiere autenticación)
 */
export const createResena = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { taller_id, rating, comentario, servicio_usado } = req.body;
        const usuario_id = req.user?.id;

        if (!usuario_id) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no autenticado'
            });
        }

        // Validar rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                error: 'El rating debe estar entre 1 y 5'
            });
        }

        // Verificar que el taller existe
        const taller = await Taller.findByPk(taller_id);
        if (!taller) {
            return res.status(404).json({
                success: false,
                error: 'Taller no encontrado'
            });
        }

        // Verificar que el usuario no haya reseñado este taller antes
        const resenaExistente = await Resena.findOne({
            where: { usuario_id, taller_id }
        });

        if (resenaExistente) {
            return res.status(400).json({
                success: false,
                error: 'Ya has dejado una reseña en este taller'
            });
        }

        // Crear la reseña
        const resena = await Resena.create(
            {
                usuario_id,
                taller_id,
                rating,
                comentario,
                servicio_usado,
                verificada: false,
                reportada: false
            },
            { transaction: t }
        );

        // Actualizar calificación promedio del taller
        const resenas = await Resena.findAll({
            where: { taller_id },
            attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'promedio']],
            raw: true
        });

        const nuevoPromedio = parseFloat(resenas[0].promedio).toFixed(1);

        await Taller.update(
            {
                calificacion_promedio: nuevoPromedio,
                total_resenas: sequelize.literal('total_resenas + 1')
            },
            {
                where: { id: taller_id },
                transaction: t
            }
        );

        await t.commit();

        // Obtener la reseña con el usuario incluido
        const resenaCompleta = await Resena.findByPk(resena.id, {
            include: [
                {
                    model: User,
                    as: 'usuario',
                    attributes: ['id', 'nombre']
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Reseña creada exitosamente',
            data: resenaCompleta
        });
    } catch (error) {
        await t.rollback();
        console.error('Error al crear reseña:', error);
        res.status(500).json({
            success: false,
            error: 'Error al crear reseña',
        });
    }
};

/**
 * Responder a una reseña (solo propietario del taller)
 */
export const responderResena = async (req, res) => {
    try {
        const { id } = req.params;
        const { respuesta_mecanico } = req.body;
        const usuario_id = req.user?.id;

        const resena = await Resena.findByPk(id, {
            include: [
                {
                    model: Taller,
                    as: 'taller',
                    attributes: ['id', 'usuario_id']
                }
            ]
        });

        if (!resena) {
            return res.status(404).json({
                success: false,
                error: 'Reseña no encontrada'
            });
        }

        // Verificar que el usuario es el propietario del taller
        if (resena.taller.usuario_id !== usuario_id && req.user?.rol !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'No tienes permiso para responder esta reseña'
            });
        }

        await resena.update({
            respuesta_mecanico,
            fecha_respuesta: new Date()
        });

        res.json({
            success: true,
            message: 'Respuesta agregada exitosamente',
            data: resena
        });
    } catch (error) {
        console.error('Error al responder reseña:', error);
        res.status(500).json({
            success: false,
            error: 'Error al responder reseña',
        });
    }
};

/**
 * Incrementar votos útiles de una reseña
 */
export const votarResena = async (req, res) => {
    try {
        const { id } = req.params;

        const resena = await Resena.findByPk(id);

        if (!resena) {
            return res.status(404).json({
                success: false,
                error: 'Reseña no encontrada'
            });
        }

        await resena.increment('votos_utiles');

        res.json({
            success: true,
            message: 'Voto registrado',
            data: { votos_utiles: resena.votos_utiles + 1 }
        });
    } catch (error) {
        console.error('Error al votar reseña:', error);
        res.status(500).json({
            success: false,
            error: 'Error al votar reseña',
        });
    }
};

/**
 * Reportar una reseña
 */
export const reportarResena = async (req, res) => {
    try {
        const { id } = req.params;

        const resena = await Resena.findByPk(id);

        if (!resena) {
            return res.status(404).json({
                success: false,
                error: 'Reseña no encontrada'
            });
        }

        await resena.update({ reportada: true });

        res.json({
            success: true,
            message: 'Reseña reportada exitosamente'
        });
    } catch (error) {
        console.error('Error al reportar reseña:', error);
        res.status(500).json({
            success: false,
            error: 'Error al reportar reseña',
        });
    }
};
