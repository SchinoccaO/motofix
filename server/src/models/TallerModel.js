import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

/**
 * Modelo Taller - Talleres mecánicos
 */
class Taller extends Model { }

Taller.init(
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
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(20)
    },
    email: {
      type: DataTypes.STRING(255),
      validate: {
        isEmail: true
      }
    },
    servicios: {
      type: DataTypes.TEXT,
      comment: 'CSV: mantenimiento,reparacion,repuestos,pintura'
    },
    horario: {
      type: DataTypes.STRING(255)
    },
    foto_url: {
      type: DataTypes.STRING(500)
    }
  },
  {
    sequelize,
    modelName: 'Taller',
    tableName: 'talleres',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['ciudad'] },
      { fields: ['usuario_id'] } // Cambiado de user_id a usuario_id
    ]
  }
);

export default Taller;
