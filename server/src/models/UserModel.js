import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/db.js';
import { NAME_MAX, EMAIL_MAX, PHONE_MAX, URL_MAX, CITY_MAX, PROVINCE_MAX, BCRYPT_ROUNDS } from '../config/constants.js';

class User extends Model {
  async compararPassword(password) {
    if (!this.password_hash) return false;
    return bcrypt.compare(password, this.password_hash);
  }

  toJSON() {
    const values = { ...this.get() };
    delete values.password_hash;
    delete values.google_id;
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
    name: {
      type: DataTypes.STRING(NAME_MAX),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(EMAIL_MAX),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(NAME_MAX),
      allowNull: true
    },
    google_id: {
      type: DataTypes.STRING(NAME_MAX),
      allowNull: true
    },
    auth_provider: {
      type: DataTypes.ENUM('local', 'google'),
      allowNull: false,
      defaultValue: 'local'
    },
    phone: {
      type: DataTypes.STRING(PHONE_MAX),
      allowNull: true
    },
    avatar_url: {
      type: DataTypes.STRING(URL_MAX),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(CITY_MAX),
      allowNull: true
    },
    province: {
      type: DataTypes.STRING(PROVINCE_MAX),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          user.password_hash = await bcrypt.hash(user.password_hash, BCRYPT_ROUNDS);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password_hash')) {
          user.password_hash = await bcrypt.hash(user.password_hash, BCRYPT_ROUNDS);
        }
      }
    },
    indexes: [
      { fields: ['email'] },
      { fields: ['role'] }
    ]
  }
);

export default User;
