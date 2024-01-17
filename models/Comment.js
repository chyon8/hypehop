

const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
   
    
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Comment', CommentSchema);

