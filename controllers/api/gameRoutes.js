const router = require('express').Router();
const { Op } = require("sequelize")
const { User, Game, Board, Ship, Chat } = require('../../models');
const { sequelize } = require('../../models/Game');
const withAuth = require('../../utils/auth');

router.get("/", withAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id);
    if (!req.session.game_id){
      const games = await user.getGames();
    }
    else {
      const games = await Game.findByPk(req.session.game_id);
    }
    
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

router.get("/play", withAuth, async (req, res) => {
  try {
    const game = await Game.findByPk(req.session.game_id);
    const boards = await game.getBoards();
    console.log(boards);
    if (boards.length < 2){
      res.json({ message: "no"});
    }
    const allSet = boards.every((board) => {
      return board.set === true;
    });
    if (allSet === true) {
      res.json({ message: "yes"});
    }
    else {
      res.json({ message: "no"})
    }
  }
  catch (err) {
    res.status(400).json(err);
  }
})

router.get("/status", withAuth, async (req, res) => {
  try {
    const gameData = await Game.findByPk(req.session.game_id);
    const game = gameData.get({ plain: true });
    const myBoardData = await Board.findOne({
      where: {
        game_id: game.id,
        user_id: req.session.user_id
      }
    });
    const myBoard = myBoardData.get({ plain: true });
    
    const opBoardData = await Board.findOne({
      where: {
        game_id: game.id,
        user_id: {
          [Op.ne]: req.session.user_id
        }
      }
    });
    const opBoard = opBoardData.get({ plain: true });

  }
  catch (err) {
    res.status(400).json(err);
  }
});

//post a new game (post board)
router.post("/", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id);
    const user = userData.get({ plain: true });
    const newGameData = await Game.create({id_one: user.id}, { fields: ['id_one']});
    const newGame = newGameData.get({ plain: true });
    await Board.create({game_id: newGame.id, user_id: user.id}, {fields: ['game_id', 'user_id']});
    req.session.game_id = newGame.id;
    return res.status(200).json(newGame);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

//post 2nd player to game (post new board)
router.post("/join", withAuth, async (req, res) => {
  try {
    const gameData = await Game.findByPk(req.body.game_id);
    const game = gameData.get({ plain: true });

    if (!game) {
      res.status(400).json({ message: 'No game found with this id'});
      return;
    }

    if (game.active === false) {
      res.status(400).json({message: 'This game is no longer active!'})
    }

    if (game.id_two) {
      res.status(400).json({message: 'This game already has the maximum number of players.'});
      return;
    }

    if (game.id_one === req.session.user_id) {
      res.status(400).json({message: 'You are already a part of this game!'});
      return;
    }

    await Game.update({id_two: req.session.user_id}, {
      where: {
        id: game.id
      }
    })
    req.session.game_id = game.id;
    await Board.create({game_id: game.id, user_id: req.session.user_id});
    res.status(200).json(game);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

//post ships to board
router.post("/ships", withAuth, async (req, res) => {
  try {
    const board = await Board.findAll({
      where: {
        user_id: req.session.user_id,
        game_id: req.session.game_id
      }
    });
    const hasShips = await sequelize.query(`SELECT COUNT(Ship.id) FROM Board JOIN Ship on Board.id = Ship.board_id WHERE Board.id=${board.id}`);
    if (hasShips) {
      res.status(400).json({ message: 'There are already ships associated with this board!'});
      return;
    }
    const ships = [];
    req.body.ships.forEach( async (ship) => {
      ship.board_id = board.id;
      const newShip = await Ship.create(ship);
      ships.push(newShip);
    });
    await Board.update({set: true}, {
      where: {
        id: board.id
      }
    })
    res.json(ships);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

router.post('/start', withAuth, async (req, res) => {
  try {
    const gameData = await Game.findByPk(req.session.game_id);
    const game = gameData.get({ plain: true });
    const boardData = await game.getBoards();
    const boards =  boardData.map((board) => board.get({ plain: true }));
    if (boards.length < 2){
      res.status(400).json({message: "This game doesn't have two players!"})
    }
    const isSet = boards.every((board) => {
      return board.set === true;
    });
    if (!isSet){
      res.status(400).json({message: "Both players have not yet placed their ships!"})
    }
    if (game.start === false){
      randomTurn = Math.floor(Math.random * 2) + 1;
      await Game.update({start: true, turn: randomTurn}, {
        where: {
          id: game.id
        }
      });
      res.json({message: "Begin game"});
    }
    else {
      res.json({message: "Begin game"});
    }
  }
  catch (err) {
    res.status(400).json(err);
  }
})

//post move to board
router.post("/shot", withAuth, async (req, res) => {
  try {
    const board = await Board.findAll({
      where: {
        user_id: {
          [Op.ne]: req.session.user_id
        },
        game_id: req.session.game_id
      }
    });
    // IM NOT DONE DONT FORGET ABOUT ME     
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