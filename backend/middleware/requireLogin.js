const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req, res, next) => {
  const authorization = req.headers.authorization
  const token = authorization.replace("Bearer ", "")
  if (!authorization) {
    return res.status(401).json({error: "You must be logged in to access this page"})
  }
  console.log(token)
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({error: "You must be logged in to access this page"})
    }
    const {_id} = payload
    User.findById(_id).then(userData => {
      req.user = userData
      next()
    })
  })
}