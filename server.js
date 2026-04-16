import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import eventRoutes from './routes/events.js'
import userRoutes from './routes/users.js'
import { createRequire } from 'module';


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const require = createRequire(import.meta.url);
const dns = require('node:dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

// Middleware
app.use(cors())
app.use(express.json())

// Set mongoose options globally
mongoose.set('bufferTimeoutMS', 60000)

// Connect to MongoDB with detailed logging
async function connectDB() {
  try {
    console.log('Attempting to connect to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gatherup', {
      socketTimeoutMS: 10000, // Reduced timeout
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    })
    console.log('✓ MongoDB connected successfully')
  } catch (err) {
    console.error('✗ MongoDB connection error:', err.message)
    console.log('⚠ Continuing without database connection...')
  }
}

// Start server immediately, connect to DB in background
connectDB()

// Routes
console.log('📡 Loading routes...')
app.use('/api/events', eventRoutes)
app.use('/api/users', userRoutes)
console.log('✅ Routes loaded')

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`)
})