import express from 'express'
import Event from '../models/Event.js'

const router = express.Router()

// Mock data fallback for when MongoDB times out
const mockEvents = [
  {
    _id: '1',
    title: 'Moonlight Stargazing',
    host: { _id: '1', name: 'Talia', email: 'talia@example.com' },
    location: 'Hidden Lakeview Spot',
    date: '2026-04-18T20:00:00.000Z',
    time: '8:00 PM',
    duration: '2.5 hours',
    description: 'Quiet stargazing after dark. Bring a blanket, warm drink, and an open mind.',
    tags: ['Stargazing', 'Small group', 'Nature'],
    capacity: 20,
    spotsLeft: 7,
    status: 'active',
  },
  {
    _id: '2',
    title: 'Sunset Bonfire Beats',
    host: { _id: '2', name: 'Aria', email: 'aria@example.com' },
    location: 'Pine Cove Gathering Point',
    date: '2026-04-25T18:00:00.000Z',
    time: '6:00 PM',
    duration: '3 hours',
    description: 'Bonfire, acoustic songs, and new people. Good vibes only.',
    tags: ['Bonfire', 'Music', 'Outdoor'],
    capacity: 15,
    spotsLeft: 5,
    status: 'active',
  },
  {
    _id: '3',
    title: 'River Trail Day Trip',
    host: { _id: '3', name: 'Jay', email: 'jay@example.com' },
    location: 'North River Trailhead',
    date: '2026-05-03T10:00:00.000Z',
    time: '10:00 AM',
    duration: '5 hours',
    description: 'A day hike with scenic views, picnic snacks, and easy-going company.',
    tags: ['Day trip', 'Hiking', 'Group'],
    capacity: 18,
    spotsLeft: 11,
    status: 'active',
  },
  {
    _id: '4',
    title: 'Acoustic Park Jam',
    host: { _id: '4', name: 'Mina', email: 'mina@example.com' },
    location: 'Riverside Greenway',
    date: '2026-05-08T16:30:00.000Z',
    time: '4:30 PM',
    duration: '2 hours',
    description: 'Casual jam session for listeners and players alike. Register to reserve your spot.',
    tags: ['Music', 'Gathering', 'Free entry'],
    capacity: 20,
    spotsLeft: 12,
    status: 'active',
  },
]

// GET /api/events - Get all events
router.get('/', (req, res) => {
  console.log('🎯 Events route hit!')
  console.log('Returning mock events...')
  res.json(mockEvents)
})

// GET /api/events/:id - Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('host', 'name email')
      .populate('reservations.user', 'name email')
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST /api/events - Create new event
router.post('/', async (req, res) => {
  const event = new Event(req.body)
  try {
    const newEvent = await event.save()
    await newEvent.populate('host', 'name email')
    res.status(201).json(newEvent)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// PUT /api/events/:id - Update event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('host', 'name email')
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.json(event)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// DELETE /api/events/:id - Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.json({ message: 'Event deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST /api/events/:id/reserve - Reserve spot in event
router.post('/:id/reserve', async (req, res) => {
  try {
    const { userId } = req.body
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    if (event.spotsLeft <= 0) {
      return res.status(400).json({ message: 'Event is full' })
    }

    // Check if user already reserved
    const existingReservation = event.reservations.find(
      res => res.user.toString() === userId
    )

    if (existingReservation) {
      return res.status(400).json({ message: 'Already reserved' })
    }

    event.reservations.push({ user: userId })
    event.spotsLeft -= 1

    await event.save()
    await event.populate('host', 'name email')
    await event.populate('reservations.user', 'name email')

    res.json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// DELETE /api/events/:id/reserve - Cancel reservation
router.delete('/:id/reserve', async (req, res) => {
  try {
    const { userId } = req.body
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    const reservationIndex = event.reservations.findIndex(
      res => res.user.toString() === userId
    )

    if (reservationIndex === -1) {
      return res.status(400).json({ message: 'No reservation found' })
    }

    event.reservations.splice(reservationIndex, 1)
    event.spotsLeft += 1

    await event.save()
    await event.populate('host', 'name email')
    await event.populate('reservations.user', 'name email')

    res.json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router