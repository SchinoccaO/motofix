import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
import { TAG_DB_MAX } from '../config/constants.js';

class Tag extends Model {}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(TAG_DB_MAX),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    modelName: 'Tag',
    tableName: 'tags',
    timestamps: true,
    underscored: true
  }
);

export default Tag;
