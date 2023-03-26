const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    token: {
        userToken: mongoose.Schema.Types.String
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