const express = require('express');
const router = express.Router();
const {
  getAllNews,
  getNewsBySlug,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} = require('../controllers/newsController');

router.get('/', getAllNews);
router.get('/slug/:slug', getNewsBySlug);
router.get('/:id', getNewsById);
router.post('/', createNews);
router.put('/:id', updateNews);
router.delete('/:id', deleteNews);

module.exports = router;