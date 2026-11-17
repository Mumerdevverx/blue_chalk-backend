const mongoose = require('mongoose');

const projectOrderSchema = new mongoose.Schema({
  key: {
    type: String,
    enum: ['all-projects'],
    required: true,
    unique: true,
    default: 'all-projects'
  },
  projectIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Work'
  }]
}, { timestamps: true });

module.exports = mongoose.models.ProjectOrder ||
  mongoose.model('ProjectOrder', projectOrderSchema);
