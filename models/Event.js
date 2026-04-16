import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 50,
  },
  spotsLeft: {
    type: Number,
    required: true,
    min: 0,
  },
  reservations: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reservedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function() {
  return this.spotsLeft === 0
})

// Ensure virtual fields are serialized
eventSchema.set('toJSON', { virtuals: true })
eventSchema.set('toObject', { virtuals: true })

const Event = mongoose.model('Event', eventSchema)

export default Event