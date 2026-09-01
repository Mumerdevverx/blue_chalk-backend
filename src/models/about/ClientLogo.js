const mongoose = require('mongoose');

const clientLogoSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  name: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ClientLogo', clientLogoSchema);