const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Shot extends Model {};

Shot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    row: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    col: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hit: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    board_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'board',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'shot',
  }
)

module.exports = Shot;