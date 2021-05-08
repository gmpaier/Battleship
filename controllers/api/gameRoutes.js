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
    let gameData = await Game.findByPk(req.session.game_id);
    let game = gameData.get({ plain: true });
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

    const idData = await Shot.findOne({
      attributes: [
        sequelize.fn('max', sequelize.col('id'))
     ],
      where: {
        board_id: {
          [Op.or]: [myBoard.id, opBoard.id]
        }
      },
      raw: true
    });

    const lastShotId = idData['max(`id`)'];
    let lastShot;
    if (lastShotId){
      const lastShotData = await Shot.findByPk(lastShotId);
      lastShot = lastShotData.get({ plain:true });
    }
    else {
      lastShot = null;
    }

    
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

router.get("/set", withAuth, async (req, res) => {
  try {
    const boardData = await Board.findOne({
      where: {
        user_id: req.session.user_id,
        game_id: req.session.game_id
      }
    });
    const board = boardData.get({ plain: true });
    const set = board.set;
    res.status(200).json({set: set});
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
    const ships = shipData.map((ship) => ship.get({ plain: true}));
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

//allows user to return to one of their active games
  //in conjunction with /active homeRoute
router.post("/rejoin", withAuth, async (req, res) => {
  try {
    const gameData = await Game.findByPk(req.body.game_id);
    const game = gameData.get({ plain: true });

    if (!game) {
      res.status(400).json({ message: 'No game found with this id'});
      return;
    }

    req.session.game_id = game.id;

    res.status(200).json({game: game});

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
    const gameData = await Game.findByPk(req.session.game_id);
    const game = gameData.get({ plain: true });
   
    if (game.start === false){
      let randomTurn = Math.floor(Math.random() * 2) + 1;
      console.log(randomTurn);
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
    console.log("IN SHOT\n");
    const gameData = await Game.findByPk(req.session.game_id);
    const game = gameData.get({ plain: true })
    const newShot = req.body.shot
    const opBoardData = await Board.findOne({
      where: {
        game_id: req.session.game_id,
        user_id: {
          [Op.ne]: req.session.user_id
        }
      }
    });
    const opBoard = opBoardData.get({ plain: true });
    const shipData = await Ship.findAll({where: {
      board_id: opBoard.id
    }});
    const ships = shipData.map((ship) => {
      const newShip = ship.get({ plain: true })
      return newShip;
    });
    let hit = false;
    let name = "";
    ships.forEach(async (ship) => {
      const positionData = JSON.parse(ship.position);
      const position_str = JSON.parse(positionData);
      const position = position_str.map((pos) => {
        const newPos = JSON.parse(pos);
        return newPos;
      });
      
      for (let i = 0; i < position.length; i++){
        if(newShot[0] === position[i][0] && newShot[1] === position[i][1]){
          hit = true;
          let hits = JSON.parse(ship.hits);
          const hitsArray = [];
          for (let j = 0; j < hits.length; j++){
            if (j === i){
              hitsArray.push(1);
            }
            else {
              hitsArray.push(hits[j]);
            }
          }
          const hitString = JSON.stringify(hitsArray);
          const allHit = hitsArray.every((el) => {
            return el === 1;
          });
          if (allHit){
            name = ship.name;
            await Ship.update({hits: hitString, alive: false}, {where: {
              id: ship.id
            }});
          }
          else {
            await Ship.update({hits: hitString}, {where: {
              id: ship.id
            }});
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
    await Shot.create({row: newShot[0], col: newShot[1], hit: hit, board_id: opBoard.id});
    res.status(200).json({hit: hit, name: name});
  }
  catch (err) {
    res.status(400).json(err);
  }
});

router.post("/isWinner", withAuth, async (req, res) => {
  try {
    const opBoardData = await Board.findOne({
      where: {
        game_id: req.session.game_id,
        user_id: {
          [Op.ne]: req.session.user_id
        }
      }
    });
    const opBoard = opBoardData.get({ plain: true });
    const opShipData = await Ship.findAll({where: {
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
    }
    res.status(200).json({winner: opDead});
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