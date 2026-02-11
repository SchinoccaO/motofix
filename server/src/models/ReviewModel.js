import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Review extends Model {}

Review.init(
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
      onDelete: 'RESTRICT'
    },
    provider_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'providers',
        key: 'id'
      },
      onDelete: 'RESTRICT'
    },
    rating: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    estimated_time: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: 'Tiempo estimado por el taller en horas'
    },
    actual_time: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: 'Tiempo real que tomo el trabajo en horas'
    }
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['provider_id'] },
      { fields: ['rating'] }
    ]
  }
);

export default Review;
