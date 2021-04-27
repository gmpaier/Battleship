const Game = require('./Game');
const User = require('./User');
const UserGame = require('./UserGame');
const Friend = require('./Friend');

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

module.exports = {
  Game, 
  User,
  UserGame,
  Friend
}