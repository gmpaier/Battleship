const Game = require('./Game');
const User = require('./User');
const UserGame = require('./UserGame');
const Friend = require('./Friend');
const Board = require('./Board');
const Ship = require('./Ship');

// Game.belongsToMany(User, {
//   through: {
//     model: UserGame,
//     unique: false
//   },
//   as: 'players'
// });

// User.belongsToMany(Game, {
//   through: {
//     model: UserGame,
//     unique: false
//   },
//   as: 'my_games'
// });

// User.belongsToMany(User, {
//   through: {
//     model: Friend,
//     unique: false 
//   },
//   as: 'my_friends'
// });

// Game.hasMany(Board, {
//   foreignKey: 'game_id',
//   onDelete: 'CASCADE'
// });

// Board.belongsTo(Game, {
//   foreignKey: 'game_id'
// });

// User.hasMany(Board, {
//   foreignKey: 'player_id',
//   onDelete: 'CASCADE'
// });

// Board.belongsTo(User, {
//   foreignKey: 'player_id'
// });

// Board.hasMany(Ship, {
//   foreignKey: 'board_id',
//   onDelete: 'CASCADE'
// });

// Ship.belongsTo(Board, {
//   foreignKey: 'board_id'
// });

module.exports = {
  User
}