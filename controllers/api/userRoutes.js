const router = require('express').Router();
const { User } = require('../../models');

router.post('/login', async (req, res) => {
    try {
        const validUsername = await User.findOne({where: {username: req.body.username}});

        if (!validUsername) {
            res.status(400).json({ message: 'Password or Username is incorrect, please try again'});
            return;
        }

        const validPassword = await validUsername.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Password or Username is incorrect, please try again'});
            return;
        };

        req.session.save(() => {
            req.session.user_id = validUsername.id;
            req.session.logged_in = true;
            res.json({ user: validUsername, message: `Welcome ${validUsername}`})
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(200).end();
        });
    } else {
        res.status(400).end
    }
});

router.post('/sign-in', (req, res) => {
    try {
        const createUser = new User(req.body);
    user.save()
    .then(user => {
        res.redirect('/');
    }) 
    } catch (err) {
        res.status(400).json(err);
    }
}) 

module.exports = router;
