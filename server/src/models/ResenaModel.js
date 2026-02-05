// ============================================
// MODELO DE RESEÑA (ResenaModel)
// ============================================
// Este archivo define la estructura de la tabla 'resenas' en la base de datos
// Una reseña es la opinión y calificación que un cliente deja sobre un taller

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

/**
 * Clase Resena - Representa una reseña de un taller
 * Conecta a un usuario (cliente) con un taller que visitó
 */
class Resena extends Model { }

// ============================================
// DEFINICIÓN DE LA ESTRUCTURA DE LA RESEÑA
// ============================================

Resena.init(
  // ===== DEFINICIÓN DE COLUMNAS =====
  {
    // Campo: id (identificador único de la reseña)
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },

    // Campo: usuario_id (ID del cliente que escribe la reseña)
    // FOREIGN KEY que conecta con la tabla 'usuarios'
    usuario_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,          // Es obligatorio (una reseña debe tener autor)
      references: {
        model: 'usuarios',       // Se relaciona con la tabla 'usuarios'
        key: 'id'
      },
      onDelete: 'CASCADE'        // Si se elimina el usuario, se eliminan sus reseñas
    },

    // Campo: taller_id (ID del taller que está siendo reseñado)
    // FOREIGN KEY que conecta con la tabla 'talleres'
    taller_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,          // Es obligatorio (una reseña es sobre un taller)
      references: {
        model: 'talleres',       // Se relaciona con la tabla 'talleres'
        key: 'id'
      },
      onDelete: 'CASCADE'        // Si se elimina el taller, se eliminan sus reseñas
    },

    // Campo: rating (calificación del 1 al 5)
    rating: {
      type: DataTypes.TINYINT.UNSIGNED,  // Número entero pequeño positivo (0-255)
      allowNull: false,                   // Es obligatorio
      validate: {
        min: 1,                           // Mínimo 1 estrella
        max: 5                            // Máximo 5 estrellas
      }
    },

    // Campo: comentario (texto de la reseña)
    comentario: {
      type: DataTypes.TEXT,      // Texto largo para la opinión del cliente
      allowNull: false           // Es obligatorio (debe escribir algo)
    },

    // Campo: servicio_usado (qué servicio recibió)
    // Ejemplo: "Mantenimiento", "Reparación de motor"
    servicio_usado: {
      type: DataTypes.STRING(100)
    },

    // Campo: respuesta_mecanico (respuesta del dueño del taller)
    // Permite que el mecánico responda a la reseña
    respuesta_mecanico: {
      type: DataTypes.TEXT
    },

    // Campo: fecha_respuesta (cuándo respondió el mecánico)
    fecha_respuesta: {
      type: DataTypes.DATE       // Tipo fecha y hora
    },

    // Campo: votos_utiles (cuántas personas marcaron esta reseña como útil)
    votos_utiles: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0            // Por defecto 0 votos
    },

    // Campo: verificada (si la reseña fue verificada por un admin)
    // Para evitar reseñas falsas
    verificada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false        // Por defecto no está verificada
    },

    // Campo: reportada (si la reseña fue reportada como inapropiada)
    reportada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false        // Por defecto no está reportada
    }
  },
  // ===== OPCIONES DEL MODELO =====
  {
    sequelize,                   // Conexión a la base de datos
    modelName: 'Resena',         // Nombre del modelo en JavaScript
    tableName: 'resenas',        // Nombre de la tabla en MySQL
    timestamps: true,            // Agrega created_at y updated_at
    underscored: true,           // Usa snake_case para nombres

    // ===== ÍNDICES =====
    indexes: [
      { fields: ['taller_id'] },      // Para buscar reseñas de un taller específico
      { fields: ['usuario_id'] },     // Para buscar reseñas de un usuario específico
      { fields: ['rating'] },         // Para filtrar por calificación
      { fields: ['created_at'] },     // Para ordenar por fecha (más recientes primero)
      { fields: ['verificada'] },     // Para filtrar reseñas verificadas
      {
        // Índice ÚNICO: un usuario solo puede dejar UNA reseña por taller
        // Esto evita que alguien spam con múltiples reseñas del mismo lugar
        unique: true,
        fields: ['usuario_id', 'taller_id'],
        name: 'unique_user_taller'
      }
    ]
  }
);

// Exportamos el modelo para usarlo en otros archivos
export default Resena;
