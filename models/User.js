const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  favorites: {
    type: Map,
    of: Boolean,
    default: {},
  },
  favoritesReview: {
    type: Map,
    of: Boolean,
    default: {},
  },
})

module.exports = mongoose.model('User', UserSchema)
