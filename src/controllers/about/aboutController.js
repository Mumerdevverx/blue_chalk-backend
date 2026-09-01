const About = require('../../models/about/About');

exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) return res.status(404).json({ success: false, message: 'About not found' });
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAbout = async (req, res) => {
  try {
    const existing = await About.findOne();
    if (existing) return res.status(400).json({ success: false, message: 'About already exists' });
    const about = await About.create(req.body);
    res.status(201).json({ success: true, data: about });
  } catch (error) {
    console.error('❌ About Create Error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateAbout = async (req, res) => {
  try {
    const about = await About.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!about) return res.status(404).json({ success: false, message: 'About not found' });
    res.json({ success: true, data: about });
  } catch (error) {
    console.error('❌ About Update Error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteAbout = async (req, res) => {
  try {
    const about = await About.findOneAndDelete();
    if (!about) return res.status(404).json({ success: false, message: 'About not found' });
    res.json({ success: true, message: 'About deleted' });
  } catch (error) {
    console.error('❌ About Delete Error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};