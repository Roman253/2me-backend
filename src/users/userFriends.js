const express = require('express');
const mongoose = require('mongoose');
const { addListener } = require('nodemon');
const requireAuth = require('../middlewares/requireAuth');

const UserFriends = mongoose.model('UserFriends');
const Users = mongoose.model('Users');

const router = express.Router();

router.use(requireAuth);

router.get('/friends', async (req, res) => {
    const friends = await UserFriends.find({ userId: req.user._id });

    res.send(friends);
});

router.get('/users', async (req, res) => {
    const user = await Users.find({ userId: req.user._id });

    res.send(user);
});

router.post('/friends', async (req, res) => {
    const{ userId, userFriends } = req.body;

    if (!userId || !userFriends) {
        return res
            .status(422)
            .send({ error: 'you do not have a user name'});
    }
    

    try {
        const friendsList = new UserFriends({userName, email, userId: req.user._id})
        await friendsList.save();
        res.send(friendsList);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

router.post('/users', async (req, res) => {
    const{ userId } = req.body;

    if (!userId ) {
        return res
            .status(422)
            .send({ error: 'you do not have a user name'});
    }
    

    try {
        const users = new Users({userName, email, userId: req.user._id})
        await users.save();
        res.send(Users);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

router.delete('/users', async (req, res) => {
    const user = await Users.find({ userId: req.user._id });

    res.send(user);
});

router.delete('/friends', async (req, res) => {
    const friends = await UserFriends.find({ userId: req.user._id });

    res.send(friends);
});

module.exports = router; 