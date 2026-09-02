const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {search, category} = req.query;
    const filter ={};
    if(category && category !=='All'){
        filter.category = category;
    }
    if(search){
        const regex = new RegExp(search, 'i');
        filter.$or = [{ title: regex},{content: regex}];
    }
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong while fetching posts.', error: err.message });
  }
});

router.get('/meta/categories',(req,res)=>{
    res.json(Post.CATEGORIES);
})

router.get('/mine', requireAuth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Could not load your posts. Please try again later.', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
     return res.status(404).json({ message: 'Post not found.' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Could not load this post.', error: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
     return res.status(400).json({ message: 'Title and content are required.' });
    }

    const user = await User.findById(req.userId);
    const post = await Post.create({
     title,
     content,
     author: user._id,
     authorName: user.name
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong while creating the post.', error: err.message });
  }
});

router.put('/:id', requireAuth, async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({message:'Post not found. '});
        }
        if(post.author.toString()!== req.userId){
            return res.status(403).json({message:'You can only edit your own posts.'});
        }
        const{title, content, category}= req.body;
        if(!title|| !content){
            return res.status(400).json({message:'Title and content are required.'})
        }
        post.title = title;
        post.content = content;
        if(category)post.category=category;
        await post.save();
        res.json(post);
    }catch(err){
        res.status(500).json({message:'Could not update the post.',error:err.message});
    }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
     return res.status(404).json({ message: 'Post not found.' });
    }
    if (post.author.toString() !== req.userId) {
     return res.status(403).json({ message: 'You can only delete your own posts.' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete the post.', error: err.message });
  }
});

module.exports = router;