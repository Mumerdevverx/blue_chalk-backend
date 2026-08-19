const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  officeName: {
    type: String,
    required: [true, 'Office name is required'],
    trim: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    fullAddress: { type: String, required: true }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required']
  },
  mapEmbedUrl: {
    type: String,
    required: [true, 'Map URL is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);