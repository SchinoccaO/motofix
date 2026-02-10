import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class ReviewReply extends Model {}

ReviewReply.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    review_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'reviews',
        key: 'id'
      },
      onDelete: 'RESTRICT'
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'ReviewReply',
    tableName: 'review_replies',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['review_id'] }
    ]
  }
);

export default ReviewReply;
