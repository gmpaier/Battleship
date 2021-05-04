const router = require('express').Router();
const { Op } = require("sequelize")
const { User, Game, UserGame, Board, Ship, Chat } = require('../../models');
const { sequelize } = require('../../models/Game');
const withAuth = require('../utils/auth');

router.get("/", withAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id);
    const games = await user.getGames();
    res.json(games);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

router.get("/active", withAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id);
    const games = await user.getGames({where: {active: true}});
    res.json(games);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

router.get("/id/:id", withAuth, async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id)
    
    res.json(game);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

//post a new game (post board)
router.post("/", withAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id);
    const newGame = await user.createGame(req.body);
    await Board.create({game_id: newGame.id, user_id: user.id});
    return res.json(newGame);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

//post 2nd player to game (post new board)
router.post("/join", withAuth, async (req, res) => {
  try {
    const game = await sequelize.query(`SELECT Game.id as id, Game.active as active, User.id as user, COUNT(User) as userCount FROM Game JOIN UserGame on Game.id = UserGame.game_id JOIN User on UserGame.user_id = User.id WHERE Game.id = ${req.body.game_id}`);

    if (!game) {
      res.status(400).json({ message: 'No game found with this id'});
      return;
    }

    game.forEach(({user, userCount, active}) => {
      if (active = false){
        res.status(400).json({ message: 'This game is inactive and cannot be joined'});
        return;
      }

      if (userCount > 1){
        res.status(400).json({ message: 'This game already has the maximum number of players'});
        return;
      }

      if (user == req.session.user_id){
        res.status(400).json({ message: 'You are already a part of this game!'});
        return;
      }
    });

    await UserGame.create({game_id: req.body.game_id, user_id: req.session.user_id});
    await Board.create({game_id: req.body.game_id, user_id: req.session.user_id});
    res.status(200).json("You have been added to this game");
  }
  catch (err) {
    res.status(400).json(err);
  }
});

//post ships to board
router.post("/ships", withAuth, async (req, res) => {
  try {
    const board = await Board.findByPk(req.body.board_id);
    const hasShips = await sequelize.query(`SELECT COUNT(Ship.id) FROM Board JOIN Ship on Board.id = Ship.board_id WHERE Board.id=${board.id}`);
    if (hasShips) {
      res.status(400).json({ message: 'There are already ships associated with this board!'});
      return;
    }
    const ships = [];
    req.body.ships.forEach( async (ship) => {
      const newShip = await Ship.create(ship);
      ships.push(newShip);
    });
    res.json(ships);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

//post move to board
router.post("/move", withAuth, async (req, res) => {
  try {
    // req.body should pass a coordinate [x,y]      
  }
  catch (err) {
    res.status(400).json(err);
  }
});

router.post("/chat", withAuth, async (req, res) => {
  try {
    const newChat = await Chat.create(req.body);

    res.json(newChat);
  }
  catch (err) {
    res.status(400).json(err);
  }
})

module.exports = router;