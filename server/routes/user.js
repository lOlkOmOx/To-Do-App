const express = require('express')
const router = express.Router()
const User = require('../models/User')
const authenticate = require('../middleware/authenticate')

// Change name
router.post('/changeName', authenticate, async (req, res) => { 
    const { email, newName } = req.body
  
    //Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'User doesnt exist' })
    }

    if (user.name === newName) {
        return res.status(400).json({ message: 'Nothing to change'})
    }
  
    user.name = newName
    await user.save();
    res.status(200).json({ message: 'Name successfully changed' })
  })

// Change language
router.post('/changeLanguage', authenticate, async (req, res) => { 
    const { email, newLanguage } = req.body
  
    //Find user
    const user = await User.findOne({ email })
    if (!user) { 
      return res.status(400).json({ message: 'User doesnt exist' })
    }

    if (user.language === newLanguage) {
        return res.status(400).json({ message: 'Nothing to change'})
    }
  
    user.language = newLanguage
    await user.save();
    res.status(200).json({ message: 'Language successfully changed' })
  
  })

// Get user data
router.get('/get', authenticate, async (req, res) => {
  const email = req.user.email;

  const user = await User.findOne({email: email}).select('-password');
  if (!user) {
      return res.status(400).json({ message: 'User not found' });
  }

  return res.status(200).json({ user });

})


module.exports = router