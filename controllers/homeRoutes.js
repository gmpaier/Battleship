const router = require('express').Router();

router.get('/', (req, res) => {
  if (!req.session.logged_in) {
    res.redirect('/api/users/login');
    return;
  }

  res.redirect('/api/users/id/' + req.session.user_id);
});