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
    console.log(error)
    return res.json({message: error})
  }
})

router.put('/follow', requireLogin, async (req, res) => {
  try {
    let result = await User.findByIdAndUpdate(req.body.followId, {$push:{followers: req.user._id}}, {new: true}, (error, result) => {
      if (error) {
        return res.json({message: error})
      }
      User.findByIdAndUpdate(req.user._id, {$push:{following: req.body.followId}}, {new: true}).select('-password')
    }).select('-password')
    return res.json(result)
  } catch(error) {
    return res.json({message: error})
  }
})

router.put('/unfollow', requireLogin, async (req, res) => {
  try {
    let result = await User.findByIdAndUpdate(req.body.unfollowId, {$pull:{followers: req.user._id}}, {new: true}, (error, result) => {
      if (error) {
        return res.json({message: error})
      }
      User.findByIdAndUpdate(req.user._id, {$pull:{following: req.body.unfollowId}}, {new: true}).select('-password')
    }).select('-password')
    return res.json(result)
  } catch(error) {
    return res.json({message: error})
  }
})

module.exports = router