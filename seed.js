import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import Event from './models/Event.js'
import { createRequire } from 'module'

dotenv.config()

const require = createRequire(import.meta.url)
const dns = require('node:dns')

dns.setServers(['8.8.8.8', '1.1.1.1'])

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    // Clear existing data
    await User.deleteMany({})
    await Event.deleteMany({})

    // Create sample users
    const users = await User.insertMany([
      {
        name: 'Talia',
        email: 'talia@example.com',
        password: 'password123', // In production, hash passwords
        bio: 'Nature lover and stargazer',
      },
      {
        name: 'Aria',
        email: 'aria@example.com',
        password: 'password123',
        bio: 'Musician and outdoor enthusiast',
      },
      {
        name: 'Jay',
        email: 'jay@example.com',
        password: 'password123',
        bio: 'Hiking guide and adventure seeker',
      },
      {
        name: 'Mina',
        email: 'mina@example.com',
        password: 'password123',
        bio: 'Music lover and community organizer',
      },
    ])

    console.log('Users created:', users.length)

    // Create sample events
    const events = await Event.insertMany([
      {
        title: 'Moonlight Stargazing',
        host: users[0]._id,
        location: 'Hidden Lakeview Spot',
        date: new Date('2026-04-18'),
        time: '8:00 PM',
        duration: '2.5 hours',
        description: 'Quiet stargazing after dark. Bring a blanket, warm drink, and an open mind.',
        tags: ['Stargazing', 'Small group', 'Nature'],
        capacity: 20,
        spotsLeft: 7,
        status: 'active',
      },
      {
        title: 'Sunset Bonfire Beats',
        host: users[1]._id,
        location: 'Pine Cove Gathering Point',
        date: new Date('2026-04-25'),
        time: '6:00 PM',
        duration: '3 hours',
        description: 'Bonfire, acoustic songs, and new people. Good vibes only.',
        tags: ['Bonfire', 'Music', 'Outdoor'],
        capacity: 15,
        spotsLeft: 5,
        status: 'active',
      },
      {
        title: 'River Trail Day Trip',
        host: users[2]._id,
        location: 'North River Trailhead',
        date: new Date('2026-05-03'),
        time: '10:00 AM',
        duration: '5 hours',
        description: 'A day hike with scenic views, picnic snacks, and easy-going company.',
        tags: ['Day trip', 'Hiking', 'Group'],
        capacity: 18,
        spotsLeft: 11,
        status: 'active',
      },
      {
        title: 'Acoustic Park Jam',
        host: users[3]._id,
        location: 'Riverside Greenway',
        date: new Date('2026-05-08'),
        time: '4:30 PM',
        duration: '2 hours',
        description: 'Casual jam session for listeners and players alike. Register to reserve your spot.',
        tags: ['Music', 'Gathering', 'Free entry'],
        capacity: 20,
        spotsLeft: 12,
        status: 'active',
      },
    ])

    console.log('Events created:', events.length)

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await mongoose.connection.close()
  }
}

seedDatabase()