const mongoose = require('mongoose');

function slugify(text) {
  if (!text) return 'untitled';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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

// ✅ Fixed pre-save – call next() properly
newsSchema.pre('save', function(next) {
  if (this.title) {
    this.slug = slugify(this.title);
  }
  next(); // ✅ MUST call next()
});

module.exports = mongoose.model('News', newsSchema);