# Gather Up

A React app for discovering and reserving spots in small local gatherings like stargazing, bonfires, music sessions, and day trips.

## Features

- Browse events by category (stargazing, bonfires, music, hiking)
- Reserve spots in events (15-20 person groups)
- Anyone can host events
- MongoDB backend with Express API
- Responsive design

## Tech Stack

- **Frontend**: React 19, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Styling**: CSS with modern design system

## Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB:
   - Install MongoDB locally or use MongoDB Atlas
   - Update `.env` file with your MongoDB connection string:
     ```
     MONGODB_URI=mongodb://localhost:27017/gatherup
     PORT=5000
     ```

4. Seed the database with sample data:
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm run server
   ```

6. In a new terminal, start the frontend:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:5173](http://localhost:5173) in your browser

## Database Schema

### User Model
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, min 6 chars)
- `avatar`: String (optional)
- `bio`: String (optional, max 500 chars)
- `createdAt`: Date
- `updatedAt`: Date

### Event Model
- `title`: String (required, max 100 chars)
- `host`: ObjectId (ref: User, required)
- `location`: String (required)
- `date`: Date (required)
- `time`: String (required)
- `duration`: String (required)
- `description`: String (required, max 1000 chars)
- `tags`: Array of Strings
- `capacity`: Number (required, 1-50)
- `spotsLeft`: Number (required, min 0)
- `reservations`: Array of {user: ObjectId, reservedAt: Date}
- `status`: String (enum: active, cancelled, completed)
- `createdAt`: Date
- `updatedAt`: Date

## API Endpoints

### Events
- `GET /api/events` - Get all active events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/reserve` - Reserve spot
- `DELETE /api/events/:id/reserve` - Cancel reservation

### Users
- `GET /api/users` - Get all users (basic info)
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Development

- `npm run dev` - Start frontend dev server
- `npm run server` - Start backend server
- `npm run build` - Build for production
- `npm run seed` - Seed database with sample data
- `npm run lint` - Run ESLint

## Future Enhancements

- User authentication and sessions
- Password hashing
- Event creation form
- User profiles
- Event filtering and search
- Real-time updates
- Email notifications
- Location-based event discovery
