const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  aboutUsText: { type: String, required: true },
  aboutUsRightText: { type: String, required: true },
  onAssignmentTitle: { type: String, default: 'Blue Chalk On Assignment' },
  onAssignmentText: { type: String, required: true },
  services: { type: [String], required: true },
  careersText: { type: String, required: true },
  videoUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);