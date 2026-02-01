import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

/**
 * Modelo User - Usuario del sistema
 * Roles: 'usuario', 'taller', 'admin'
 */
class User extends Model {
  // Método para ocultar la contraseña en JSON
  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rol: {
      type: DataTypes.ENUM('usuario', 'taller', 'admin'),
      defaultValue: 'usuario'
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['rol'] }
    ]
  }
);

export default User;
