const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class UserGame extends Model {};

UserGame.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    game_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'game',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      },
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user_game',
  }
);

module.exports = UserGame;