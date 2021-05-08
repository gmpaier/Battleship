const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Ship extends Model {};

Ship.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hits: {
      type: DataTypes.STRING,
      allowNull: false
    },
    alive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    board_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'board',
        key: 'id',
      },
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'ship',
  }
)

module.exports = Ship;