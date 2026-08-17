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
    required: true  // ← AGAR REQUIRED HAI TOH
    // required: false  // ← TEMPORARY: FALSE KAR KE DEKHO
  },
 
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true
});

module.exports = mongoose.model('HomeItem', homeItemSchema);