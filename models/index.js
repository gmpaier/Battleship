const User = require('./User');
const Score = require('./Score');
User.hasMany(Score, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});


module.exports = { User, Score };
