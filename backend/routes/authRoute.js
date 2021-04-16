const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')

router.post('/signup', (req, res) => {
  const {name,email,password} = req.body
  if (!email || !password || !name) {
    res.status(422).json({error: "Please enter all fields"})
  }
  User.findOne({email:email})
  .then((savedUser) => {
    if (savedUser) {
      return res.status(422).json({error: "A user with this email address already exists"})
    }
    bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        name, email, password: hashedPassword
      })
      user.save()
      .then(() => {
        res.json({message: "Successfully registered"})
      })
      .catch(err => {
        console.log(err)
      })
    }) 
  })
  .catch(err => {
    console.log(err)
  })
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
        res.json({token})
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