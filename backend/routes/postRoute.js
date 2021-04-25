const express = require('express')
const Formidable = require('formidable')
const router = express.Router()
const bluebird = require('bluebird')
const fs = bluebird.promisifyAll(require('fs'))
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const Image = mongoose.model('Image')
const requireLogin = require('../middleware/requireLogin')
const {join} = require('path')

async function checkCreateUploadsFolder(uploadsFolder) {
  try {
    await fs.statSync(uploadsFolder)
  } catch(e) {
    if (e && e.code == 'ENOENT') {
      try {
        await fs.mkdirAsync(uploadsFolder)
      } catch(e) {
        console.log(e)
        return res.json({message: e})
      }
    } else {
      console.log('Error reading the uploads folder')
      return res.json({message: e})
    }
  }
  return true
}

function checkFileType(file) {
  const type = file.type.split('/').pop()
  const validTypes = ['png', 'jpeg', 'jpg', 'gif']
  if (validTypes.indexOf(type) == -1) {
    return false
  }
  return true
}

router.get('/allposts', requireLogin, async (req, res) => {
  try {
    const allPosts = await Post.find().populate('postedBy', 'name').exec()
    return res.json(allPosts)
  } catch(error) {
    return res.json({message: 'An error occurred'})
  }
})

router.get('/myposts', requireLogin, (req, res) => {
  Post.find({postedBy:req.user._id})
  .populate('postedBy', '_id name')
  .then(myPost => {
    res.json({myPost})
  })
  .catch(error => {
    console.log(error)
  })
})

router.post('/imageupload', requireLogin, async (req, res) => {
  const form = Formidable.IncomingForm()
  const uploadsFolder = join(__dirname, '/../uploads')
  const folderExists = await checkCreateUploadsFolder(uploadsFolder)
  if (!folderExists) {
    return res.json({message: 'There was an error when creating the uploads folder'})
  }
  form.parse(req, async (err, fields, files) => {
    const file = files.file
    const isValid = checkFileType(file)
    const filename = encodeURIComponent(file.name.replace(/&. *;+/g, '-'))
    if  (!isValid) {
      return res.json({message: 'Invalid file type'})
    }
    try {
      await fs.renameAsync(file.path, join(uploadsFolder, filename))
    } catch(e) {
      console.log('The file upload failed, now attempting to remove the temp file...')
      try {
        await fs.unlinkAsync(file.path)
      } catch(error) {
        console.log(error)
        return res.json({message: 'The file failed to upload'})
      }
    }
    const image = new Image({
      filename,
      uploadedBy: req.user
    })
    try {
      image.save()
    } catch(error) {
      console.log(error)
      return res.json({message: 'Image failed to save to the database'})
    }
    return res.json({message: 'Image uploaded successfully', photo: image.filename})
  }) 
})

router.post('/createpost', requireLogin, async (req, res) => {
  const {title, body, photo} = req.body
  if (!title || !body || !photo) {
    return res.status(422).json({message: 'Please enter all fields'})
  }
  try {
    req.user.password = undefined
    const post = new Post({
      title,
      body,
      photo,
      postedBy: req.user
    })
    post.save()
    return res.json({message: 'Post successfully created', post})
  } catch(error) {
    console.log(error)
    res.json({message: 'Post failed to be created'})
  }
})

module.exports = router