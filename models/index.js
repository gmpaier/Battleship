const Game = require('./Game');
const User = require('./User');
const UserGame = require('./UserGame');
const Friend = require('./Friend');
const Board = require('./Board');
const Ship = require('./Ship');
const Chat = require ('./Chat');

User.hasMany(Game, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Game.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'won_games'
});

Game.belongsToMany(User, {
  through: {
    model: UserGame,
    unique: false
  },
  as: 'players'
});

User.belongsToMany(Game, {
  through: {
    model: UserGame,
    unique: false
  },
  as: 'my_games'
});

User.belongsToMany(User, {
  through: {
    model: Friend,
    unique: false 
  },
  as: 'my_friends'
});

Game.hasMany(Board, {
  foreignKey: 'game_id',
  onDelete: 'CASCADE'
});

Board.belongsTo(Game, {
  foreignKey: 'game_id'
});

User.hasMany(Board, {
  foreignKey: 'player_id',
  onDelete: 'CASCADE'
});

Board.belongsTo(User, {
  foreignKey: 'player_id'
});

Board.hasMany(Ship, {
  foreignKey: 'board_id',
  onDelete: 'CASCADE'
});

Ship.belongsTo(Board, {
  foreignKey: 'board_id'
});

User.hasMany(Chat, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Chat.belongsTo(User, {
  foreignKey: 'user_id'
});

Game.hasMany(Chat, {
  foreignKey: 'game_id',
  onDelete: 'CASCADE'
});

Chat.belongsTo(Game, {
  foreignKey: 'game_id',
});

module.exports = {
  Game, 
  User,
  UserGame,
  Friend,
  Board,
  Ship,
  Chat
}