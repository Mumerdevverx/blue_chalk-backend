const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Featured', 'Branded', 'Entertainment', 'Social Impact', 'Documentary', 'awards', 'All Projects'],
    required: true,
    default: 'All Projects'
  },
  image: { type: String, required: true },
  buttonText: { type: String, default: 'Watch Now' },
  aboutContent: { type: String, required: true },
  showOverlay: { type: Boolean, default: false },
  overlayType: { type: String, default: '' },
  title: { type: String, trim: true },
  slug: { type: String, unique: true, sparse: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Work', workSchema);