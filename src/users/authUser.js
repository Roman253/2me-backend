const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const requireAuth = require('../middlewares/requireAuth');
const bcrypt = require('bcrypt');


const router = express.Router();

router.post('/signup', async (req, res) => {
    const { userName, email, password} = req.body;

    try {
        const user = new User({ userName, email, password});
        await user.save();

        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY' );
        res.send({ token });
    } catch (err) {
        console.log(err);
        return res.status(422).send({err});
    }
});

router.post('/signin',  async (req, res) => {
    const { email, password} = req.body;

    if(!email || !password){
        return res.status(422).send({ error: 'Must provide email and password'});
    }

    const user = await User.findOne({email});
    if (!user) {
        return res.status(422).send({ error: 'Invalid password or email'});
    }

    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id },'MY_SECRET_KEY')
        res.send({ token,  user: {userName: user.userName, email: user.email, _id: user._id} });
    } catch (err) {
        return res.status(422).send({ error: 'Invalid password or email'});
    }
});

router.post('/profile', requireAuth, async (req, res) => {
    
    try {
        const data = req.body;
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                console.log(err.message)
                return ;
            }
    
            bcrypt.hash(data.password, salt,async (err, hash) => {
                if (err) {
                    console.log(err.message)
                    return 
                }
                data.password = hash;
                console.log(data)
                console.log('Password hashed and saved');
                await User.findByIdAndUpdate(req.user._id, data);
                res.status(200).send();
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message });
    }
});

router.post('/notificationToken',requireAuth, async (req, res) => {
    const token = req.body.token;
    await User.findByIdAndUpdate(req.user._id,{ notificationToken: token }, {upsert: true});
    res.status(200).send();
})

router.delete('/friends/:id', async (req, res) => {
    try {
      const { id: friendId } = req.params;
      const userId = req.user._id;
      
      // Find the user by their ID
      const user = await User.findById(userId);
  
      // Remove the friend from the friends array
      user.friends = user.friends.filter(friend => friend.toString() !== friendId);
  
      // Save the updated user
      await user.save();
  
      // Return the updated user or a success message
      res.json(user);
    } catch (error) {
      // Handle any errors
      console.error(error);
      res.status(500).json({ error: 'Failed to delete friend.' });
    }
  });
  

module.exports = router; 