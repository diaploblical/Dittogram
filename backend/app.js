const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const {MONGOURI} = require('./keys')

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
  console.log('connected to mongodb on the cloud')
})
mongoose.connection.on('error', (err) => {
  console.log('error connecting to the server', err)
})

require('./models/userModel')
require('./models/postModel')

app.use(express.json())
app.use(require('./routes/authRoute'))
app.use(require('./routes/postRoute'))

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})