const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getHomeItems,
  createHomeItem,
  updateHomeItem,
  deleteHomeItem
} = require('../controllers/homeController');

// Public route - Get all items
router.get('/', getHomeItems);

// Admin routes - With file upload
router.post('/', upload.single('media'), createHomeItem);
router.put('/:id', upload.single('media'), updateHomeItem);
router.delete('/:id', deleteHomeItem);

module.exports = router;