import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
import bcrypt from 'bcryptjs';

/**
 * Modelo User - Usuario del sistema
 * Roles: 'cliente', 'mecanico', 'admin'
 */
class User extends Model {
  // Método para ocultar la contraseña en JSON
  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }

  // Método para comparar contraseñas
  async compararPassword(passwordIngresada) {
    return await bcrypt.compare(passwordIngresada, this.password);
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
      type: DataTypes.ENUM('cliente', 'mecanico', 'admin'),
      defaultValue: 'cliente'
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'usuarios',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(user.password, salt);
        }
      }
    },
    indexes: [
      { fields: ['email'] },
      { fields: ['rol'] }
    ]
  }
);

export default User;
