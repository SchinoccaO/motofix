import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class ProviderTag extends Model {}

ProviderTag.init(
  {
    provider_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'providers',
        key: 'id'
      },
      primaryKey: true
    },
    tag_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'tags',
        key: 'id'
      },
      primaryKey: true
    }
  },
  {
    sequelize,
    modelName: 'ProviderTag',
    tableName: 'provider_tags',
    timestamps: true,
    underscored: true
  }
);

export default ProviderTag;
