const { User } = require('../models');

const userData = [
  {
    "username": "sal@hotmail.com",
    "password": "password12345"
  },
  {
    "username": "lernantino@gmail.com",
    "password": "password12345"
  },
  { "username": "amiko2k20@aol.com",
    "password": "password12345"
  }
]
;

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;
