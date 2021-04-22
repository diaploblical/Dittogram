const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')

router.post('/signup', async (req, res) => {
  const {username,email,password} = req.body
  if (!username || !email || !password) {
    res.status(422).json({message: "Please enter all fields"})
  }
  const foundUser = await User.findOne({email:email})
  try {
    if (foundUser) {
      return res.status(422).json({message: "A user with this email address already exists"})
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({
      username, email, password: hashedPassword
    })
    await user.save()
    return res.status(200).json({message: "User successfully registered"})
  } catch(error) {
    console.log(error)
    return res.json({error: "An error has occurred"})
  }
})

router.post('/signin', (req, res) => {
  const {email, password} = req.body
  if (!email || !password) {
    res.status(422).json({error: "Please enter an email address and a password"})
  }
  User.findOne({email})
  .then(savedUser => {
    if (!savedUser) {
      return res.status(422).json({error: "Invalid email address or password"})
    }
    bcrypt.compare(password, savedUser.password)
    .then(doMatch => {
      if (doMatch) {
        const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
        const {_id, name, email} = savedUser
        res.json({token, user:{_id, name, email}, message: "Successfully signed in"})
      }
      else {
        return res.status(422).json({error: "Invalid email address or password"})
      }
    })
    .catch(err => {
      console.log(err)
    })
  })
})

module.exports = router