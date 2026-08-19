const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
  // Address
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    fullAddress: { type: String, required: true }
  },
  
  // Contact
  phone: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  
  // Social Links
  socialLinks: {
    twitter: { type: String, default: 'https://x.com/BlueChalkMedia' },
    facebook: { type: String, default: 'https://www.facebook.com/BlueChalkMedia' },
    instagram: { type: String, default: 'https://www.instagram.com/bluechalkmedia' },
    emailLink: { type: String, default: 'https://bluechalk.com/contact/' }
  },
  
  // Footer Links
  footerLinks: {
    privacyPolicy: { type: String, default: '/privacy-policy' },
    termsOfUse: { type: String, default: '/terms-of-use' },
    copyrightText: { type: String, default: '© 2026 Blue Chalk Media' }
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Footer', footerSchema);