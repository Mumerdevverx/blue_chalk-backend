const express = require('express');
const router = express.Router();
// ✅ CORRECT IMPORT – About controller
const { getAbout, createAbout, updateAbout, deleteAbout } = require('../../controllers/about/aboutController');

router.get('/', getAbout);
router.post('/', createAbout);
router.put('/', updateAbout);
router.delete('/', deleteAbout);

module.exports = router;