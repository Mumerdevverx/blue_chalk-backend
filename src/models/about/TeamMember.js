const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pronouns: { type: String, default: '' },
  position: { type: String, required: true },
  image: { type: String, required: true },
  hoverImage: { type: String, required: true },
  description: { type: String, required: true },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  email: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);