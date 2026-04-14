import { useState } from 'react'

const initialEvents = [
  {
    id: 1,
    title: 'Moonlight Stargazing',
    host: 'Talia',
    location: 'Hidden Lakeview Spot',
    date: 'April 18, 2026',
    time: '8:00 PM',
    duration: '2.5 hours',
    description: 'Quiet stargazing after dark. Bring a blanket, warm drink, and an open mind.',
    tags: ['Stargazing', 'Small group', 'Nature'],
    capacity: 20,
    spotsLeft: 7,
    reserved: false,
  },
  {
    id: 2,
    title: 'Sunset Bonfire Beats',
    host: 'Aria',
    location: 'Pine Cove Gathering Point',
    date: 'April 25, 2026',
    time: '6:00 PM',
    duration: '3 hours',
    description: 'Bonfire, acoustic songs, and new people. Good vibes only.',
    tags: ['Bonfire', 'Music', 'Outdoor'],
    capacity: 15,
    spotsLeft: 5,
    reserved: false,
  },
  {
    id: 3,
    title: 'River Trail Day Trip',
    host: 'Jay',
    location: 'North River Trailhead',
    date: 'May 3, 2026',
    time: '10:00 AM',
    duration: '5 hours',
    description: 'A day hike with scenic views, picnic snacks, and easy-going company.',
    tags: ['Day trip', 'Hiking', 'Group'],
    capacity: 18,
    spotsLeft: 11,
    reserved: false,
  },
  {
    id: 4,
    title: 'Acoustic Park Jam',
    host: 'Mina',
    location: 'Riverside Greenway',
    date: 'May 8, 2026',
    time: '4:30 PM',
    duration: '2 hours',
    description: 'Casual jam session for listeners and players alike. Register to reserve your spot.',
    tags: ['Music', 'Gathering', 'Free entry'],
    capacity: 20,
    spotsLeft: 12,
    reserved: false,
  },
]

function EventCard({ event, onReserve }) {
  return (
    <article className="event-card">
      <div className="event-top">
        <div>
          <p className="event-type">{event.tags[0]}</p>
          <h2>{event.title}</h2>
        </div>
        <span className="badge">{event.spotsLeft} spots left</span>
      </div>

      <p className="event-description">{event.description}</p>

      <div className="event-details">
        <div>
          <strong>Host</strong>
          <p>{event.host}</p>
        </div>
        <div>
          <strong>Date</strong>
          <p>{event.date}</p>
        </div>
        <div>
          <strong>Time</strong>
          <p>{event.time}</p>
        </div>
        <div>
          <strong>Location</strong>
          <p>{event.location}</p>
        </div>
      </div>

      <div className="event-meta">
        <p>{event.duration}</p>
        <div className="tag-list">
          {event.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <button className="reserve-btn" onClick={onReserve}>
        {event.reserved ? 'Reserved ✓' : 'Reserve spot'}
      </button>
    </article>
  )
}

function EventList() {
  const [events, setEvents] = useState(initialEvents)

  function handleReserve(id) {
    setEvents((current) =>
      current.map((event) =>
        event.id === id ? { ...event, reserved: !event.reserved } : event
      )
    )
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Gather Up</span>
          <h1>Find small local gatherings ready for reservation</h1>
          <p>
            Browse events for stargazing, bonfires, music sessions, and day trips where anyone
            can host and everyone can register.
          </p>
        </div>
        <div className="hero-support">
          <p>
            Events are designed for groups of 15-20 people, so you can join a relaxed meetup with
            friendly hosts and fresh locations.
          </p>
        </div>
      </section>

      <section className="event-grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} onReserve={() => handleReserve(event.id)} />
        ))}
      </section>
    </main>
  )
}

export default EventList
