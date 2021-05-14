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
  console.log('connected to mongodb on this PC')
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

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})