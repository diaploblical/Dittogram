const express = require('express')
const Formidable = require('formidable')
const router = express.Router()
const fsPromises = require('fs').promises
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const Image = mongoose.model('Image')
const requireLogin = require('../middleware/requireLogin')
const path = require('path')
const {join} = require('path')
const uploadsFolder = join(__dirname, '/../uploads')

/*This function checks to see if a directory for file uploads already exists. 
If it does not exist the function will create it. */
async function checkCreateUploadsFolder(uploadsFolder) {
  try {
    await fsPromises.stat(uploadsFolder)
  } catch(error) {
    if (error && error.code == 'ENOENT') {
      try {
        await fsPromises.mkdir(uploadsFolder)
      } catch(error) {
        return false
      }
    } else {
      return false
    }
  }
  return true
}

/* This function checks to see if the selected file is of type .jpg, .gif, or .png 
 and if the file is not of those three types the function will return false*/
function checkFileType(file) {
  const type = file.type.split('/').pop()
  const validTypes = ['png', 'jpeg', 'gif']
  if (validTypes.indexOf(type) == -1) {
    return false
  }
  return true
}

router.get('/allposts', requireLogin, async (req, res) => {
  try {
    let allPosts = await Post.find().populate('postedBy', 'username').populate('comments.postedBy', '_id username')
    return res.status(200).send(allPosts)
  } catch(error) {
    return res.status(500).send(error)
  }
})

router.get('/followedposts', requireLogin, async (req, res) => {
  try {
    let followedPosts = await Post.find({postedBy:{$in: req.user.following}})
    .populate('postedBy', 'username')
    .populate('comments.postedBy', '_id username')
    .exec()
    if (followedPosts == null) {
      return res.status(200).json(null)
    }
    return res.status(200).send(followedPosts)
  } catch(error) {
    return res.status(500).send(error)
  }
})

router.get('/myposts', requireLogin, async (req, res) => {
  try {
    let myPosts = await Post.find({postedBy:req.user._id})
    .populate('postedBy', '_id name')
    .exec()
    return res.status(200).send(myPosts)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.get('/defaultavatar', async (req, res) => {
  return res.sendFile(path.join(__dirname, '..', '/assets/default.png'))
})

router.get('/api/image/:id', async (req, res) => {
  const imageId = req.params.id
  const image = await Image.findOne({_id: imageId})
  var fileType = '.' + image.filename.split('.').pop()
  if (fileType == '.jpg') {
    fileType = '.jpeg'
  }
  return res.sendFile(path.join(__dirname, '..', `/uploads/${imageId}` + fileType))
})

router.post('/imageupload', requireLogin, async (req, res) => {
  const form = Formidable.IncomingForm()
  const folderExists = await checkCreateUploadsFolder(uploadsFolder)
  if (!folderExists) {
    return res.json('There was an error with creating the uploads folder')
  }
  form.parse(req, async (err, fields, files) => {
    const file = files.file
    const isValid = checkFileType(file)
    if  (!isValid) {
      return res.status(400).send('Images of types .jpg, .gif, and .png only')
    }
    try {
      const image = new Image({
        filename: file.name,
        uploadedBy: req.user
      })
      var storageFilename = ((image._id) + '.' + file.type.split('/').pop())
      await fsPromises.rename(file.path, join(uploadsFolder, storageFilename))
      image.save()
    } catch(error) {
      try {
        await fsPromises.unlink(file.path)
        return res.status(500).send(error)
      } catch(error) {
        return res.status(500).send('The file failed to upload')
      }
    }
    return res.status(200).send({photo: storageFilename})
  }) 
})

router.post('/createpost', requireLogin, async (req, res) => {
  const {title, body, photo} = req.body
  if (!title || !body || !photo) {
    return res.status(422).send('Please enter all fields')
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
    return res.json({message: 'Post failed to be created'})
  }
})

router.put('/like', requireLogin, async (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {$push:{likes: req.user._id}}, {new: true})
  .populate('comments.postedBy', '_id username')
  .populate('postedBy', '_id username')
  .exec((error, result) => {
    if (error) {
      return res.json({message: error})
    } else {
      return res.json(result)
    }
  })
})

router.put('/unlike', requireLogin, async (req, res) => {
  try {
    let post = await Post.findByIdAndUpdate(req.body.postId, {$pull:{likes: req.user._id}}, {new: true})
    .populate('comments.postedBy', '_id username')
    .populate('postedBy', '_id username')
    .exec()
    res.status(200).send(post)
  } catch(error) {
    res.status(500).send(error)
  }
})

router.put('/comment', requireLogin, async (req, res) => {
  try {
    const comment = {
      text: req.body.text,
      postedBy: req.user.id
    }
    let post = await Post.findByIdAndUpdate(req.body.postId, {$push:{comments: comment}}, {new: true})
    .populate('comments.postedBy', '_id username')
    .populate('postedBy', '_id username')
    .exec()
    res.status(200).send(post)
  } catch(error) {
    res.status(500).send(error)
  }
})

router.put('/deletecomment', requireLogin, async (req, res) => {
  try {
    let post = await Post.findByIdAndUpdate(req.body.postId, {$pull:{comments: {_id: req.body.commentId, postedBy: req.user._id}}}, {new: true})
    .populate('comments.postedBy', '_id username')
    .populate('postedBy', '_id username')
    .exec()
    return res.status(200).send(post)
  } catch(error) {
    res.status(500).send(error)
  }
})

router.delete('/deletepost/:postId', requireLogin, async (req, res) => {
  try {
    let post = await Post.findOne({_id: req.params.postId})
    let image = await Image.findOne({_id: post.photo})
    var fileType = '.' + image.filename.split('.').pop()
    if (fileType == '.jpg') {
      fileType = '.jpeg'
    }
    let filename = ('/' + image._id + fileType)
    if (post.postedBy._id.toString() === req.user._id.toString()) {
      await fsPromises.unlink(uploadsFolder + filename)
      post.remove()
      image.remove()
      return res.json({message: "Post successfully deleted", item: post})
    }
  } catch(error) {
    res.status(500).send(error)
  }
})

module.exports = router