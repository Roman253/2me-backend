const express = require('express');
const mongoose = require('mongoose');
const { addListener } = require('nodemon');
const requireAuth = require('../middlewares/requireAuth');

const UserFriends = mongoose.model('UserFriends');
const Users = mongoose.model('User');

const router = express.Router();

router.use(requireAuth);

router.get('/friends', async (req, res) => {
    const friends = (await Users.findById(req.user._id, 'friends')).friends;
    res.send(friends);
});

router.get('/users', async (req, res) => {
    const users = await Users.find({ _id: {$ne: req.user._id }}, 'userName email notificationToken _id');
    res.send(users);
});

router.post('/friends', async (req, res) => {
    const{ friendId } = req.body;

    if (!friendId) {
        return res
            .status(422)
            .send({ error: 'Missing friend Id'});
    }
    
    try {
        // find the friend
        const friend = await Users.findById(friendId, 'userName email notificationToken _id');

        if(!friend) {
            return res
                .status(422)
                .send({ error: 'Invalid friend Id'});
        }
        // add the friend to the user's friends list
        await Users.findByIdAndUpdate(req.user._id, { $push: { friends: friend } }, {upsert: true});
        res.status(200).send({ message: 'Friend added' });
    } catch (err) {
        res.status(500).send({ error: err.message });
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