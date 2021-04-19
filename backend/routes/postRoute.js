const express = require('express')
const formidable = require('formidable')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const Image = mongoose.model('Image')
const requireLogin = require('../middleware/requireLogin')
const filePath = '../uploaded/'

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

router.post('/imageupload', requireLogin, async (req, res) => {
  const form = new formidable.IncomingForm()
  const imageData = form.parse(req)
  const filename = req.headers.filename
  const imageUrl = filePath + filename
  if (filename == 'undefined') {
    return res.status(422).json({message: 'No image detected'})
  } else {
    imageData.on('file', function(name, file) {
      const image = new Image({
        imageUrl,
        uploadedBy: req.user
      })
      console.log("Uploaded " + file.name)
      image.save()
      .catch(error => {
        console.log(error)
        return error
      })
    })
    imageData.on('end', () => {
      return res.status(200).json({message: 'Image successfully uploaded', url: imageUrl })
    })
  }
})

router.post('/createpost', requireLogin, async (req, res) => {
  const {title, body, url} = req.body
  if (!title || !body || !url) {
    console.log(body)
    return res.status(422).json({message: 'Please enter all fields'})
  }
  req.user.password = undefined
  const post = new Post({
    title,
    body,
    photo: url,
    postedBy: req.user
  })
  post.save().then(result => {
    res.json({post: result})
  })
  .catch(error => {
    console.log(error)
  })
})

module.exports = router