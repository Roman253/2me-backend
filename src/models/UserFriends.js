const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    token: {
        userToken: friend.token
    },
});

const friendsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userFriends: [pointSchema]
});

mongoose.model('UserFriends', friendsSchema);