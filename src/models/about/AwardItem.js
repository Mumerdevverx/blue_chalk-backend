const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  year: { type: String, required: true },
  category: { type: String, required: true },
  breadcrumb: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// ✅ MODEL NAME CHANGE KARO: 'Award' se 'AwardItem'
module.exports = mongoose.model('AwardItem', awardSchema);