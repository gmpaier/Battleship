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
    height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    game_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'game',
        key: 'id'
      }
    },
    player_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    opponent_id: {
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
    modelName: 'board',
  }
)

module.exports = Board;