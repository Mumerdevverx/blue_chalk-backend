const express = require('express');
const router = express.Router();
const {
  getAwards,
  getAwardBySlug,
  createAward,
  updateAward,
  deleteAward
} = require('../../controllers/about/awardController');

router.get('/', getAwards);
router.get('/slug/:slug', getAwardBySlug);
router.post('/', createAward);
router.put('/:id', updateAward);
router.delete('/:id', deleteAward);

module.exports = router;