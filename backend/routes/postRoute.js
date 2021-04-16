const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const requireLogin = require('../middleware/requireLogin')

router.get('/allPosts', (req, res) => {
  Post.find()
  .populate('PostedBy','name')
  .then(posts => {
    res.json({posts})
  })
  .catch(error => {
    console.log(error)
  })
})
router.get('/myPosts', requireLogin, (req, res) => {
  Post.find({postedBy:req.user._id})
  .populate('PostedBy', '_id name')
  .then(myPost => {
    res.json({myPost})
  })
  .catch(error => {
    console.log(error)
  })
})
router.post('/createPost', requireLogin, (req, res) => {
  const {title, body} = req.body
  if (!title || !body) {
    return res.status(422).json({err: 'Please enter all fields'})
  }
  req.user.password = undefined
  const post = new Post({
    title,
    body,
    postedBy:req.user
  })
  post.save().then(result => {
    res.json({post:result})
  })
  .catch(error => {
    console.log(error)
  })
})



module.exports = router