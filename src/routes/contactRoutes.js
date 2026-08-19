const express = require('express');
const router = express.Router();
const {
  getContactInfo,
  getOffice,
  createContact,
  updateContact,
  deleteContact
} = require('../controllers/contactController');

// ✅ PUBLIC ROUTES - Bina token ke
router.get('/', getContactInfo);
router.get('/:office', getOffice);
router.post('/', createContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;