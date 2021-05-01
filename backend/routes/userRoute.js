const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const User = mongoose.model('User')
const Post = mongoose.model('Post')

router.get('/user/:id', requireLogin, async (req, res) => {
  try {
    const foundUser = await User.findOne({_id: req.params.id}).select('-password')
    const foundPosts = await Post.find({postedBy: req.params.id}).populate('postedBy', '_id username').exec()
    return res.json({foundUser, foundPosts})
  } catch(error) {
    return res.json({message: error})
  }
})

module.exports = router