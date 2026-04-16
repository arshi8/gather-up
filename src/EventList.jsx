import { useState, useEffect } from 'react'


const API_BASE = 'http://localhost:5000/api'

function EventCard({ event, onReserve }) {
  const tags = Array.isArray(event.tags) && event.tags.length > 0 ? event.tags : ['General']
  const hostName = event.host?.name || 'Unknown host'
  const eventDate = event.date ? new Date(event.date).toLocaleDateString() : 'TBA'
  const isReserved = Array.isArray(event.reservations)
    ? event.reservations.some((res) => String(res.user) === 'currentUserId')
    : false

  return (
    <article className="event-card">
      <div className="event-top">
        <div>
          <p className="event-type">{tags[0]}</p>
          <h2>{event.title || 'Untitled event'}</h2>
        </div>
        <span className="badge">{event.spotsLeft ?? '0'} spots left</span>
      </div>

      <p className="event-description">{event.description || 'No description available.'}</p>

      <div className="event-details">
        <div>
          <strong>Host</strong>
          <p>{hostName}</p>
        </div>
        <div>
          <strong>Date</strong>
          <p>{eventDate}</p>
        </div>
        <div>
          <strong>Time</strong>
          <p>{event.time || 'TBA'}</p>
        </div>
        <div>
          <strong>Location</strong>
          <p>{event.location || 'TBA'}</p>
        </div>
      </div>

      <div className="event-meta">
        <p>{event.duration || 'Duration not set'}</p>
        <div className="tag-list">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <button className="reserve-btn" onClick={onReserve}>
        {isReserved ? 'Reserved ✓' : 'Reserve spot'}
      </button>
    </article>
  )
}

function EventList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      const response = await fetch(`${API_BASE}/events`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); 
        console.error('Server Error Detail:', errorData);
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json()
      setEvents(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleReserve(eventId) {
    try {
      // For now, use a placeholder user ID
      const userId = '507f1f77bcf86cd799439011' // Replace with actual user ID

      const response = await fetch(`${API_BASE}/events/${eventId}/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to reserve spot')
      }

      const updatedEvent = await response.json()
      setEvents(current =>
        current.map(event =>
          event._id === eventId ? updatedEvent : event
        )
      )
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <main className="app-shell">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading events...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="app-shell">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Error: {error}</p>
          <button onClick={fetchEvents}>Try again</button>
        </div>
      </main>
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
        {events.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
            <p>No events found. Check back later!</p>
          </div>
        ) : (
          events.map((event) => (
            <EventCard key={event._id} event={event} onReserve={() => handleReserve(event._id)} />
          ))
        )}
      </section>
    </main>
  )
}

export default EventList
