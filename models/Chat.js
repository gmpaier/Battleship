const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Chat extends Model {}

Chat.init (
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          user_id: {
            type: DataTypes.INTEGER,
            references: {
              model: 'user',
              key: 'id'
            },
          },
          game_id: {
            type: DataTypes.INTEGER,
            references: {
              model: 'game',
              key: 'id',
            },
          },
          message: {
            type: DataTypes.STRING
          }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'chat',
      }
);

module.exports = Chat;