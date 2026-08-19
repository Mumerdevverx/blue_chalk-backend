const Footer = require('../models/Footer');

// ✅ GET FOOTER DATA (Public)
exports.getFooter = async (req, res) => {
  try {
    const footer = await Footer.findOne({ isActive: true }).select('-__v');
    
    if (!footer) {
      return res.status(404).json({
        success: false,
        message: 'Footer data not found'
      });
    }
    
    res.json({
      success: true,
      data: footer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ CREATE FOOTER (Admin)
exports.createFooter = async (req, res) => {
  try {
    // Check if footer already exists
    const existing = await Footer.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Footer already exists. Use update instead.'
      });
    }
    
    const footer = await Footer.create(req.body);
    res.status(201).json({
      success: true,
      data: footer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ UPDATE FOOTER (Admin)
exports.updateFooter = async (req, res) => {
  try {
    const footer = await Footer.findOneAndUpdate(
      { isActive: true },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!footer) {
      return res.status(404).json({
        success: false,
        message: 'Footer not found'
      });
    }
    
    res.json({
      success: true,
      data: footer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ DELETE FOOTER (Admin - Soft Delete)
exports.deleteFooter = async (req, res) => {
  try {
    const footer = await Footer.findOneAndUpdate(
      { _id: req.params.id },
      { isActive: false },
      { new: true }
    );
    
    if (!footer) {
      return res.status(404).json({
        success: false,
        message: 'Footer not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Footer deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};