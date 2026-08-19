const express = require('express');
const router = express.Router();
const {
  getFooter,
  createFooter,
  updateFooter,
  deleteFooter
} = require('../controllers/footerController');

// ✅ PUBLIC ROUTE
router.get('/', getFooter);

// ✅ ADMIN ROUTES (Bina auth ke - abhi ke liye)
router.post('/', createFooter);
router.put('/', updateFooter);
router.delete('/:id', deleteFooter);

module.exports = router;