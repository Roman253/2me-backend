require('./models/User');
require('./models/UserFriends');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authUser = require('./users/authUser');
const userFriends = require('./users/userFriends');
const requireAuth = require('./middlewares/requireAuth');

const app = express();

app.use(bodyParser.json());
app.use(authUser);
app.use(userFriends);


const mongoUri = 
    'mongodb+srv://Roman:Mongodb12023!@cluster0.ixeug.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoUri);

mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mongoose', err);
});

app.get('/', requireAuth, (req, res) => {
    res.send(`Your User Name: ${req.user.userName}, you email: ${req.user.email}`);
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});