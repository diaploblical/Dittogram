const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const imageSchema = new mongoose.Schema({
  url: {
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