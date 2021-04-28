const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  photo: {
    type: ObjectId,
    ref: 'Image',
    required: true
  },
  likes: [
    {
      type: ObjectId,
      ref: 'User'
    }
  ],
  postedBy: {
    type: ObjectId,
    ref: 'User'
  }
})

mongoose.model('Post', postSchema)