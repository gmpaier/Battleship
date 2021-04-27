const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Row extends Model {};

Row.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    row_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    board_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'board',
        key: 'id'
      }
    },
    row: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'row',
  }
)

module.exports = Row;