const HomeItem = require('../models/HomeItem');

// Get all home items
exports.getHomeItems = async (req, res) => {
  try {
    const items = await HomeItem.find({ isActive: true })
      .sort({ order: 1 })
      .limit(9);
    
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ CREATE ITEM - WITH DEBUG LOGS
exports.createHomeItem = async (req, res) => {
  try {
    // 🔍 DEBUG: Yeh console.log check karo
    console.log('📦 Request Body:', req.body);
    console.log('📎 Request File:', req.file);
    console.log('📁 Request Files:', req);
const { title, type, mediaUrl, link, description, order, isActive } = req.body;    
    // File upload check
    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
    }

    console.log('📝 Media URL:', mediaUrl); // 🔍 DEBUG

    const item = await HomeItem.create({
      title,
      type,
      mediaUrl,
      link,
      description,
      order: order || 0,
      isActive: true
    });

    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.log('❌ Error:', error); // 🔍 DEBUG
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE ITEM
exports.updateHomeItem = async (req, res) => {
  try {
    const { title, type, link, description, order, isActive } = req.body;
    
    const item = await HomeItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    item.title = title || item.title;
    item.type = type || item.type;
    item.link = link || item.link;
    item.description = description || item.description;
    item.order = order || item.order;
    item.isActive = isActive !== undefined ? isActive : item.isActive;

    if (req.file) {
      item.mediaUrl = `/uploads/${req.file.filename}`;
    }

    await item.save();

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE ITEM
exports.deleteHomeItem = async (req, res) => {
  try {
    const item = await HomeItem.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};