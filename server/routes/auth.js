const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const router = express.Router()
const config = require('../config')
const SECRET_KEY = config.SECRET_KEY
const User = require('../models/User')
const authenticate = require('../middleware/authenticate')


// Registration
router.post('/register', async (req, res) => {
  try {

    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)

  // Check if user is already registered
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const newUser = new User({
      email,
      password: hashedPassword,
      name: " ",
      language: "en",
      task_Ids: []
    })

    await newUser.save()
  
    return res.status(201).json({ message: 'Successfully registered' })
  } catch (err) {
    console.error(err)
    return res.status(400).send(err.message)
  }
});

// Login 
router.post('/login', async (req, res) => { 
  const { email, password } = req.body;

  //Check if user exists
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(400).json({ message: 'Wrong email or password' })
  }

  //Check if password is correct
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Wrong email or password' })
  }

  //generate token
  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' })
  res.status(200).json({ token })
});

// Change passowrd 
router.post('/changePassword', authenticate, async (req, res) => { 
  const { email, newPassword, oldPassword } = req.body
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  //Find user
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(400).json({ message: 'User doesnt exist' })
  }

  //Check if old password is correct
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Wrong password' })
  }

  user.password = hashedPassword
  await user.save()
  res.status(200).json({ message: 'Password successfully changed' })

})

module.exports = router