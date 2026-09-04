const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, sparse: true },
  image: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 }
}, { timestamps: true });

// ✅ NO pre-save hook – slug generated in controller
module.exports = mongoose.model('News', newsSchema);