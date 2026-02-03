import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

/**
 * Modelo Resena - Reseñas de talleres
 */
class Resena extends Model { }

Resena.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    usuario_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    taller_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'talleres',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    rating: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    servicio_usado: {
      type: DataTypes.STRING(100)
    },
    respuesta_mecanico: {
      type: DataTypes.TEXT
    },
    fecha_respuesta: {
      type: DataTypes.DATE
    },
    votos_utiles: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0
    },
    verificada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    reportada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'Resena',
    tableName: 'resenas',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['taller_id'] },
      { fields: ['usuario_id'] },
      { fields: ['rating'] },
      { fields: ['created_at'] },
      { fields: ['verificada'] },
      {
        unique: true,
        fields: ['usuario_id', 'taller_id'],
        name: 'unique_user_taller'
      }
    ]
  }
);

export default Resena;
