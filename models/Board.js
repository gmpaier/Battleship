const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Board extends Model {};

Board.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    set: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    game_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'game',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'board',
  }
)

module.exports = Board;