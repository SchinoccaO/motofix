import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
import { ADDRESS_MAX, CITY_MAX, PROVINCE_MAX, COUNTRY_MAX } from '../config/constants.js';

class Location extends Model {}

Location.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    provider_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      references: {
        model: 'providers',
        key: 'id'
      },
      onDelete: 'RESTRICT'
    },
    address: {
      // era STRING(255) — corregido para alinear con ADDRESS_MAX (500)
      type: DataTypes.STRING(ADDRESS_MAX),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(CITY_MAX),
      allowNull: false
    },
    province: {
      type: DataTypes.STRING(PROVINCE_MAX),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(COUNTRY_MAX),
      allowNull: false,
      defaultValue: 'Argentina'
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7)
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7)
    }
  },
  {
    sequelize,
    modelName: 'Location',
    tableName: 'locations',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['city'] },
      { fields: ['province'] }
    ]
  }
);

export default Location;
