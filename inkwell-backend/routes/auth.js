const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');

const router = express.Router();

function makeToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are all required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), password: passwordHash });
    const token = makeToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong while registering.', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = makeToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong while logging in.', error: err.message });
  }
});

router.get('/me',requireAuth, async(req, res)=>{
  try{
    const user = await User.findById(req.userId).select('-password');
    if(!user){
      return res.status(404).json({message:'User not found.'});
    }
    res.json({id:user._id, name:user.name,email:user.email, createdAt:user.createdAt});
  }catch (err){
    res.status(500).json({message:'Could not load your profile.', error:err.message});
  }
});

router.put('/me', requireAuth, async (req, res)=> {
  try{
    const {name, currentPassword, newPassword}= req.body;
    const user =await User.findById(req.userId);
    if(!user){
      return res.status(404).json({message:'User not found.'});
    }
    if(name)user.name=name;
    if(newPassword){
      if(!currentPassword){
        return res.status(400).json({message:'Enter your current password to set a new one.'});
      }
      const match = await bcrypt.compare(currentPassword, user.password);
      if(!match){
        return res.status(401).json({message:'Current password is incorrect.'});
      }
      if(newPassword.length<6){
        return res.status(400).json({message:'New password must be at least 6 character.'});
      }
      user.password= await bcrypt.hash(newPassword,10);
    }
    await user.save();
    if(name){
      const Post =require('../models/Post');
      await Post.updateMany({ author:user._id},{authorName:user.name});
    }
    res.json({id:user._id, name:user.name, email:user.email, createdAt:user.createdAt});
  }catch(err){
    res.status(500).json({message:'Could not update your profile.', error:err.message});
  }
});
module.exports = router;