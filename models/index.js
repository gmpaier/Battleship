const Game = require('./Game');
const User = require('./User');
const Friend = require('./Friend');
const Board = require('./Board');
const Ship = require('./Ship');
const Chat = require ('./Chat');

User.hasMany(Game, {
  foreignKey: 'id_one',
  onDelete: 'SET NULL'
});

Game.belongsTo(User, {
  foreignKey: 'id_one',
  as: 'one_games'
});

User.hasMany(Game, {
  foreignKey: 'id_two',
  onDelete: 'SET NULL'
});

Game.belongsTo(User, {
  foreignKey: 'id_two',
  as: 'two_games'
});

User.hasMany(Game, {
  foreignKey: 'winner_id',
  onDelete: 'SET NULL'
});

Game.belongsTo(User, {
  foreignKey: 'winner_id',
  as: 'won_games'
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
  Friend,
  Board,
  Ship,
  Chat
}