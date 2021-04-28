const router = require('express').Router();
const { User } = require('../../models');

router.post('/login', async (req, res) => {
    try {
      
        const validUsername = await User.findOne({where: {email: req.body.email}});
        
        if (!validUsername) {
            res.status(400).json({ message: 'Password or Username is incorrect, please try again'});
            return;
        }
        console.log('before email',validUsername);
        const validPassword = await validUsername.checkPassword(req.body.password);
        console.log('before',validUsername);
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

module.exports = router;