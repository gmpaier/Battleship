const router = require('express').Router();
const { Op } = require("sequelize")
const { User, Game, UserGame, Board, Ship } = require('../../models');

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

router.get("/id/:id", async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id)
    
    res.json(game);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

router.post("/", withAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id);
  }
  catch (err) {
    res.status(400).json(err);
  }
})

module.exports = router;