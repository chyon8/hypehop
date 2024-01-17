const mongoose = require('mongoose');



// Schema for a track



const TrackSchema = new mongoose.Schema({
    discNumber: {
      type: Number,
      required: true,
      
    },
    trackTitle: [{
      type: String,
      required: true,
      minlength: 1,
    }],
    trackRating: [{
      type: Number,
      required: false,
      min: 0,
      max: 5,
    }],
  });




const ReviewSchema = new mongoose.Schema({

  albumRating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },

  tracks: [TrackSchema],


  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  body: {
    type: String,
    required: false,
  },

  albumTitle:{ type: String,
    required: true,
},
albumId:{
    type: String,
    required: true,
},
thumbnail:{
    type:String,
},
albumReleaseDate:{
  type:Date
},
createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isFavorite: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  view:{
    type:Number,
    default:0
    

  }



});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
