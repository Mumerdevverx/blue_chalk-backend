const GalleryImage = require('../../models/about/GalleryImage');

exports.getGalleryImages = async (req, res) => {
  try {
    const images = await GalleryImage.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createGalleryImage = async (req, res) => {
  try {
    const image = await GalleryImage.create(req.body);
    res.status(201).json({ success: true, data: image });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateGalleryImage = async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    res.json({ success: true, data: image });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteGalleryImage = async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};