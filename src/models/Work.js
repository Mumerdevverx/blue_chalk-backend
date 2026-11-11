const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Featured', 'Brand', 'Branded', 'Entertainment', 'Social Impact', 'Documentary', 'awards', 'Award', 'All Projects'],
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
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Work', workSchema);