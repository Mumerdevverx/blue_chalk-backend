const express = require('express');
const router = express.Router();
const { getGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage } = require('../../controllers/about/galleryController');

router.get('/', getGalleryImages);
router.post('/', createGalleryImage);
router.put('/:id', updateGalleryImage);
router.delete('/:id', deleteGalleryImage);

module.exports = router;