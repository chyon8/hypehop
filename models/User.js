const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name:{
    type:String,
  
  },
  email:{
    type:String,
  },
  password:{
    type:String,
  },
  googleId: {
    type: String,

  },
  displayName: {
    type: String,

  },
  firstName: {
    type: String,
   
  },
  lastName: {
    type: String,
   
  },
  image: {
    type: String,
    default:"https://i.ibb.co/M1SBs5R/logoo.png"
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
