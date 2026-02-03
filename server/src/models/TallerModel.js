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
    whatsapp: {
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
    horarios: {
      type: DataTypes.STRING(255)
    },
    marcas_atendidas: {
      type: DataTypes.TEXT,
      comment: 'CSV: Honda,Yamaha,Suzuki,etc'
    },
    foto_url: {
      type: DataTypes.STRING(500)
    },
    latitud: {
      type: DataTypes.DECIMAL(10, 8)
    },
    longitud: {
      type: DataTypes.DECIMAL(11, 8)
    },
    calificacion_promedio: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0.0
    },
    total_resenas: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0
    },
    verificado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
      { fields: ['usuario_id'] },
      { fields: ['verificado'] },
      { fields: ['activo'] }
    ]
  }
);

export default Taller;
