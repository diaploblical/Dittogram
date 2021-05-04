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
    let userToFollow = await User.findByIdAndUpdate(req.body.followId, {$push:{followers: req.user._id}}, {new: true}).select('-password')
    let followingUser = await User.findByIdAndUpdate(req.user._id, {$push:{following: req.body.followId}}, {new: true}).select('-password')
    console.log(userToFollow)
    console.log(followingUser)
    return res.json({userToFollow, followingUser})
  } catch(error) {
    console.log(error)
    return res.json({message: error})
  }
})

router.put('/unfollow', requireLogin, async (req, res) => {
  try {
    let userToUnfollow = await User.findByIdAndUpdate(req.body.unfollowId, {$pull:{followers: req.user._id}}, {new: true}).select('-password')
    let unfollowingUser = await User.findByIdAndUpdate(req.user._id, {$pull:{following: req.body.unfollowId}}, {new: true}).select('-password')
    console.log(userToUnfollow)
    console.log(unfollowingUser)
    return res.json({userToUnfollow, unfollowingUser})
  } catch(error) {
    console.log(error)
    return res.json({message: error})
  }
})

module.exports = router