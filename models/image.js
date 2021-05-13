const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  }
})

mongoose.model('Image', imageSchema)