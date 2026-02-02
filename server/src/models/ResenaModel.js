import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

/**
 * Modelo Resena - Reseñas de talleres
 */
class Resena extends Model {}

Resena.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
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
    respuesta_taller: {
      type: DataTypes.TEXT
    },
    fecha_respuesta: {
      type: DataTypes.DATE
    },
    votos_utiles: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0
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
      { fields: ['user_id'] },
      { fields: ['rating'] },
      { fields: ['created_at'] },
      {
        unique: true,
        fields: ['user_id', 'taller_id'],
        name: 'unique_user_taller'
      }
    ]
  }
);

export default Resena;
