const mongoose = require('mongoose');

const homeItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  type: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },

  mediaUrl: {
    type: String,
    required: true
  },

  // Home image ko Work project ke saath connect karega
  workSlug: {
    type: String,
    trim: true,
    default: ''
  },

  link: {
    type: String,
    default: ''
  },

  description: {
    type: String,
    default: ''
  },

  order: {
    type: Number,
    default: 0
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('HomeItem', homeItemSchema);