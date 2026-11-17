const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const requireTrustedAdmin = require('../middleware/requireTrustedAdmin');
const {
  getAllProjectsOrder,
  saveAllProjectsOrder
} = require('../controllers/projectOrderController');
const {
  getWorks,
  getWorkBySlug,
  getWorkById,
  createWork,
  updateWork,
  deleteWork
} = require('../controllers/workController');

router.get('/all-projects/order', getAllProjectsOrder);
router.put(
  '/all-projects/order',
  authenticate,
  requireTrustedAdmin,
  saveAllProjectsOrder
);

router.get('/', getWorks);
router.get('/slug/:slug', getWorkBySlug);
router.get('/:id', getWorkById);

router.post('/', createWork);
router.put('/:id', updateWork);
router.delete('/:id', deleteWork);

module.exports = router;