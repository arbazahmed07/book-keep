import express from 'express'
import User from '../models/User.js' // Ensure User.js is also an ES module

const router = express.Router()

// Route to set a user's role
router.post('/set-role', async (req, res) => {
  try {
    const { userId, email, role } = req.body

    if (!userId || !email || !role) {
      return res.status(400).json({ success: false, message: 'User ID, email and role are required' })
    }

    const existingUser = await User.findOne({
      $or: [{ userId }, { email }]
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with a role assigned',
        currentRole: existingUser.role,
        userId: existingUser.userId
      })
    }

    const newUser = new User({
      userId,
      email,
      role,
      createdAt: new Date()
    })

    await newUser.save()

    return res.status(201).json({
      success: true,
      message: 'Role assigned successfully',
      role
    })
  } catch (error) {
    console.error('Error setting user role:', error)
    return res.status(500).json({ success: false, message: 'Server error occurred' })
  }
})

// Route to get a user's role
router.get('/get-role/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.findOne({ userId })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    return res.status(200).json({
      success: true,
      role: user.role
    })
  } catch (error) {
    console.error('Error getting user role:', error)
    return res.status(500).json({ success: false, message: 'Server error occurred' })
  }
})

export default router
