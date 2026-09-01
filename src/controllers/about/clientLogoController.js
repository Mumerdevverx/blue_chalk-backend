const ClientLogo = require('../../models/about/ClientLogo');

exports.getClientLogos = async (req, res) => {
  try {
    const logos = await ClientLogo.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: logos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createClientLogo = async (req, res) => {
  try {
    const logo = await ClientLogo.create(req.body);
    res.status(201).json({ success: true, data: logo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateClientLogo = async (req, res) => {
  try {
    const logo = await ClientLogo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!logo) return res.status(404).json({ success: false, message: 'Logo not found' });
    res.json({ success: true, data: logo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteClientLogo = async (req, res) => {
  try {
    const logo = await ClientLogo.findByIdAndDelete(req.params.id);
    if (!logo) return res.status(404).json({ success: false, message: 'Logo not found' });
    res.json({ success: true, message: 'Logo deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};