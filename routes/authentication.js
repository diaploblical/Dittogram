const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')

router.post('/signup', async (req, res) => {
  const {username, email, password} = req.body
  if (!username || !email || !password) {
    return res.status(422).send({message: 'Please enter all fields'})
  }
  const foundUser = await User.findOne({email})
  try {
    if (foundUser) {
      return res.status(422).send({message: 'A user with this email address already exists'})
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({
      username, email, password: hashedPassword
    })
    await user.save()
    return res.status(200).send({message: 'Registration successful'})
  } catch(error) {
    return res.status(500).send({message: 'An error has occurred'})
  }
})

router.post('/login', async (req, res) => {
  const {email, password} = req.body
  if (!email || !password) {
    return res.status(422).send({message: 'Please enter an email address and a password'})
  }
  const savedUser = await User.findOne({email}).exec()
  if (!savedUser) {
    return res.status(422).send({message: 'Invalid email address or password'})
  }
  try {
    const doMatch = await bcrypt.compare(password, savedUser.password)
    if (doMatch) {
      const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
      const {_id, username, email, avatar, followers, following} = savedUser
      return res.status(200).send({token, user:{_id, username, email, avatar, followers, following}, message: 'Successfully signed in'})
    } else {
      return res.status(422).send({message: 'Invalid email address or password'})
    }
  } catch(error) {
    return res.status(500).send({message: 'An error has occurred'})
  }
})

module.exports = router