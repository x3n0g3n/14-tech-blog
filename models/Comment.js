// initialize variables
const { Model, DataTypes } = require('sequelize'),
      sequelize = require('../config/connection');

// comment model definition
class Comment extends Model {}

// initialize the model with attributes and options
Comment.init(
  {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    comment_content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    comment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: {
            model: 'Users', 
            key: 'id', 
            onDelete: 'CASCADE'
        },
        validate: {
            is: /^\d+$/ 
        }
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Post',
            key: 'id', 
            onDelete: 'CASCADE'
        }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'Comment',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Comment;