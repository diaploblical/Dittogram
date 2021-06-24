const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const {MONGOURI} = require('./config/keys')
require('dotenv').config()

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection.on('error', (err) => {
  console.log('error connecting to the server', err)
})
mongoose.set('useFindAndModify', false);

require('./models/user')
require('./models/post')
require('./models/image')

app.use(express.json({limit: '20mb'}))
app.use(require('./routes/authentication'))
app.use(require('./routes/posts'))
app.use(require('./routes/users'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  const path = require('path')
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '/client/build', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})