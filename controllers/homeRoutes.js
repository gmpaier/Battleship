const router = require('express').Router();

const {  User, Game } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }
  else {
    res.redirect('/login')
  }
});

// Use withAuth middleware to prevent access to route
router.get('/game/setup', withAuth, async (req, res) => {
  try {
    const login = {
      logged_in: true
    };
    res.render('game', login);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/game/play', withAuth, async (req, res) => {
  try {
  
    res.render('play', {logged_in: true});
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] }
    });

    const user = userData.get({ plain: true });

    res.render('profile', {user, logged_in: true});
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/join', withAuth, async (req, res) => {
  try {
    const gameData = await Game.findAll({
      where: {
        active: true,
        id_one: {
          [Op.ne]: req.session.user_id
        },
        id_two: {
          [Op.is]: null
        }
      }
    });

    const games = gameData.map((game) => game.get({ plain: true }));

    res.render('join', {games, logged_in: true})
  }
  catch (err) {
    res.status(500).json(err);
  }
})

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;

