const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const imageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: ObjectId,
    ref: 'User'
  }
})

mongoose.model('Image', imageSchema)