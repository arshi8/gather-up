import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// GET /api/users - Get all users (basic info)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'name email avatar bio').sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/users/:id - Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST /api/users - Create new user
router.post('/', async (req, res) => {
  const user = new User(req.body)
  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists' })
    } else {
      res.status(400).json({ message: error.message })
    }
  }
})

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router