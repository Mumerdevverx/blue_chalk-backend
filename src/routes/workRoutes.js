const express = require('express');
const router = express.Router();
const {
  getWorks,
  getWorkBySlug,
  getWorkById,
  createWork,
  updateWork,
  deleteWork
} = require('../controllers/workController');

router.get('/', getWorks);
router.get('/slug/:slug', getWorkBySlug);
router.get('/:id', getWorkById);

router.post('/', createWork);
router.put('/:id', updateWork);
router.delete('/:id', deleteWork);

module.exports = router;