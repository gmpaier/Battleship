const router = require('express').Router();
const { Op } = require("sequelize")
const { User, Game, Board, Ship, Chat, Shot } = require('../../models');
const { sequelize, update } = require('../../models/Game');
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
    const boardData = await game.getBoards();
    const boards = boardData.map((board) => board.get({ plain: true }))
    
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
    throw err;
  }
})

router.get("/status", withAuth, async (req, res) => {
  try {
    let gameData;
    let game;
    gameData = await Game.findByPk(req.session.game_id);
    game = gameData.get({ plain: true });
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

    const opData = await User.findByPk(opBoard.user_id);
    const opUser = opData.get({ plain: true })
    console.log(myBoard);
    const myShipData = Ship.findAll({where: {
      board_id: myBoard.id
    }});
    console.log(myShipData);  //you're here, myShip data is a promise pending
    const myShips = myShipData.map((ship) => ship.get({ plain: true }));
    console.log("through my ships");
    const myDead = myShips.every((ship) => {
      return ship.alive === false;
    });

    if (myDead){
      await Game.update({winner_id: opUser.id, active: false}, {where: {
        id: req.session.game_id
      }});
      gameData = await Game.findByPk(req.session.game_id);
      game = gameData.get({ plain: true })
    }

    console.log("through myDead");

    const opShipData = Ship.findAll({where: {
      board_id: opBoard.id
    }});
    const opShips = opShipData.map((ship) => ship.get({ plain: true }));

    const opDead = opShips.every((ship) => {
      return ship.alive === false;
    });

    if (opDead){
      await Game.update({winner_id: req.session.user_id, active: false}, {where: {
        id: req.session.game_id
      }});
      gameData = await Game.findByPk(req.session.game_id);
      game = gameData.get({ plain: true })
    }

    console.log("through opDead");

    const myShotData = await Shot.findAll({
      where: {
        board_id: opBoard.id
      }
    });
    const myShots = myShotData.map((shot) => shot.get({ plain: true }));

    const opShotData = await Shot.findAll({
      where: {
        board_id: myBoard.id
      }
    });
    const opShots = opShotData.map((shot) => shot.get({ plain: true }));

    const lastShotData = await Shot.findAll({
      attributes: [
        sequelize.fn('MAX', sequelize.col('id'))
     ],
      where: {
        board_id: {
          [Op.or]: [myBoard.id, opBoard.id]
        }
      }
    });

    let lastShot;
    if (lastShotData){
      lastShot = lastShotData.get({ plain: true })
    }

    console.log("through lastShot");
    const opName = opUser.username;

    let player_id;
    if (game.id_one === req.session.user_id){
      player_id = 1;
    }
    else {
      player_id = 2;
    }

    res.json({game: game, player_id: player_id, myShots: myShots, opShots: opShots, myName: req.session.username, opName: opName, lastShot: lastShot });

  }
  catch (err) {
    res.status(400).json(err);
  }
});

router.get("/ships", withAuth, async (req, res) => {
  try {
    const boardData = await Board.findOne({
      where: {
        user_id: req.session.user_id,
        game_id: req.session.game_id
      }
    });
    const shipData = await boardData.getShips()
    console.log("/ships " + shipData);
    const ships = shipData.map((ship) => ship.get({ plain: true}));
    console.log("/ships " + ships);
    res.json({ships: ships});
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
    console.log(req.session);
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
    const boardData = await Board.findOne({
      where: {
        user_id: req.session.user_id,
        game_id: req.session.game_id
      }
    });
    const board = boardData.get({ plain:true });
    console.log(board);
    const hasShips = await boardData.getShips()
    console.log(hasShips);
    if (hasShips.length !== 0) {
      res.status(400).json({ message: 'There are already ships associated with this board!'});
      return;
    }
    const ships = [];
    console.log(req.body.ships);
    req.body.ships.forEach( async (ship) => {
      ship.board_id = board.id;
      ship.position = JSON.stringify(ship.position);
      ship.hits = JSON.stringify(ship.hits);
      const newShip = await Ship.create(ship, {fields: ['name', 'position', 'hits', 'board_id']});
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
    console.log("in post start");
    const gameData = await Game.findByPk(req.session.game_id);
    const game = gameData.get({ plain: true });
   
    if (game.start === false){
      randomTurn = Math.floor(Math.random * 2) + 1;
      await Game.update({start: true, turn: randomTurn}, {
        where: {
          id: game.id
        }
      });
      res.status(200).json({message: "Begin game"});
    }
    else {
      res.status(200).json({message: "Begin game"});
    }
  }
  catch (err) {
    res.status(400).json(err);
  }
})

//post move to board
router.post("/shot", withAuth, async (req, res) => {
  try {
    const gameData = await Game.findByPk(req.session.game_id);
    const game = gameData.get({ plain: true })
    const newShot = req.body.shot
    console.log("newShot, " + newShot);
    const opBoard = await Board.findOne({
      where: {
        game_id: req.session.game_id,
        user_id: {
          [Op.ne]: req.session.user_id
        }
      }
    });
    const shipData = opBoard.getShips();
    const ships = shipData.map((ship) => {ship.get({ plain: true })});
    let hit = false;
    ships.forEach(async (ship) => {
      ship.position = JSON.parse(ship.position);
      for (let i = 0; i < ship.position.length; i++){
        if(newShot[0] === ship.position[i][0] && newShot[1] === ship.position[i][1]){
          hit = true;
          const hitsArray = [];
          for (let j = 0; j < ship.hits.length; j++){
            if (j === i){
              hitsArray.push(1);
            }
            else {
              hitsArray.push(ship.hits[j]);
            }
          }
          const hitString = JSON.stringify(hitsArray);
          const newShipData = await Ship.update({hits: hitString}, {where: {
            id: ship.id
          }});
          const newShip = newShipData.get({ plain: true });
          const allHit = newShip.hits.every((el) => {
            return el === 1;
          });
          if (allHit){
            await Ship.update({alive: false}, {
              where: {
                id: ship.id
              }
            });
          }
        }
      }
    });
    if (hit === false){
      if (game.turn === 1){
        await Game.update({turn: 2}, {where: {id: req.session.game_id}});
      }
      else {
        await Game.update({turn: 1}, {where: {id: req.session.game_id}});
      }
    }
    res.status(200).json(hit);
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