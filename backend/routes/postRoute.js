const express = require('express')
const { formidable } = require('formidable')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const Image = mongoose.model('Image')
const requireLogin = require('../middleware/requireLogin')

router.get('/allposts', (req, res) => {
  Post.find()
  .populate('PostedBy','name')
  .then(posts => {
    res.json({posts})
  })
  .catch(error => {
    console.log(error)
  })
})
router.get('/myposts', requireLogin, (req, res) => {
  Post.find({postedBy:req.user._id})
  .populate('PostedBy', '_id name')
  .then(myPost => {
    res.json({myPost})
  })
  .catch(error => {
    console.log(error)
  })
})
router.post('/createpost', requireLogin, (req, res) => {
  const {title, body, pic} = req.body
  if (!title || !body || !pic) {
    return res.status(422).json({err: 'Please enter all fields'})
  }
  req.user.password = undefined
  const post = new Post({
    title,
    body,
    pic,
    postedBy: req.user
  })
  post.save().then(result => {
    res.json({post: result})
  })
  .catch(error => {
    console.log(error)
  })
})

router.post('/imageupload', (req, res) => {
  const form = formidable
  form.parse(req)
  if (!imageData) {
    return res.status(422).json({err: 'No image detected'})
  }
  form.on('fileBegin', function(name, file) {
    file.path = __dirname + '../uploaded/' + file.name
  })
  form.on('file', function(name, file) {
    console.log("Uploaded " + file.name)
  })
  /* const image = new Image({
    imageData,
    uploadedBy: req.user
  })
  image.save().then(result => {
    res.json({image: result})
  })
  .catch(error => {
    console.log(error)
  }) */
})

module.exports = router