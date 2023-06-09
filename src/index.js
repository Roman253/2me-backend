require('./models/User');
require('./models/UserFriends');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan')


const authUser = require('./users/authUser');
const userFriends = require('./users/userFriends');
const requireAuth = require('./middlewares/requireAuth');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());


const mongoUri = process.env.MONGODB_URL; 
mongoose.connect(mongoUri);

mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mongoose', err);
});

app.get('/', (req, res) => {
    res.status(200).send('2Me API');
});
app.use(authUser);
app.use(userFriends);

app.listen(process.env.PORT || 3000, () => {
    console.log('listening on port 3000');
});
