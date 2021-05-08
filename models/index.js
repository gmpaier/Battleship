const Game = require('./Game');
const User = require('./User');
const Board = require('./Board');
const Ship = require('./Ship');
const Shot = require('./Shot');
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

Game.hasMany(Board, {
  foreignKey: 'game_id',
  onDelete: 'CASCADE'
});

Board.belongsTo(Game, {
  foreignKey: 'game_id'
});

User.hasMany(Board, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Board.belongsTo(User, {
  foreignKey: 'user_id'
});

Board.hasMany(Ship, {
  foreignKey: 'board_id',
  onDelete: 'CASCADE'
});

Ship.belongsTo(Board, {
  foreignKey: 'board_id'
});

Board.hasMany(Shot, {
  foreignKey: 'board_id',
  onDelete: 'CASCADE'
});

Shot.belongsTo(Board, {
  foreignKey: 'board_id'
})

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
  Board,
  Ship,
  Shot,
  Chat
}