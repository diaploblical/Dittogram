const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const User = mongoose.model('User')
const Post = mongoose.model('Post')

router.get('/user/:id', requireLogin, async (req, res) => {
  try {
    const user = await User.findOne({_id: req.params.id}).select('-password')
    const posts = await Post.find({postedBy: req.params.id}).populate('postedBy', '_id username').exec()
    return res.json({user, posts})
  } catch(error) {
    console.log(error)
    return res.json({message: error})
  }
})

router.put('/follow', requireLogin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.followId, {$push:{followers: req.user._id}}, {new: true}).select('-password')
    let user = await User.findByIdAndUpdate(req.user._id, {$push:{following: req.body.followId}}, {new: true}).select('-password')
    return res.json(user)
  } catch(error) {
    console.log(error)
    return res.json({message: error})
  }
})

router.put('/unfollow', requireLogin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.unfollowId, {$pull:{followers: req.user._id}}, {new: true}).select('-password')
    let user = await User.findByIdAndUpdate(req.user._id, {$pull:{following: req.body.unfollowId}}, {new: true}).select('-password')
    return res.json(user)
  } catch(error) {
    console.log(error)
    return res.json({message: error})
  }
})

router.put('/setavatar', requireLogin, async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(req.user._id, {avatar: req.body.avatarId}, {new: true}).select('-password')
    return res.json(user)
  } catch(error) {
    console.log('sadasd')
  } 
})

module.exports = router