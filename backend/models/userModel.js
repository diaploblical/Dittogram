const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'http://localhost:5000/assets/default.png'
  },
  followers: [
    {
      type: ObjectId,
      ref: 'User'
    }
  ],
  following: [
    {
      type: ObjectId,
      ref: 'User'
    }
  ]
})

mongoose.model('User', userSchema)