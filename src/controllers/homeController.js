const HomeItem = require('../models/HomeItem');

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

exports.createHomeItem = async (req, res) => {
  try {
    console.log('📦 Request Body:', req.body);
    console.log('📎 Request File:', req.file);
    
    const { title, type, link, description, order, isActive } = req.body;
    let mediaUrl = '';
    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
    } else {
      mediaUrl = req.body.mediaUrl || '';
    }

    const item = await HomeItem.create({
      title,
      type,
      mediaUrl,
      link: link || '',
      description: description || '',
      order: order || 0,
      isActive: true
    });

    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('❌ Create error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ FIXED UPDATE
exports.updateHomeItem = async (req, res) => {
  try {
    const { title, type, link, description, order, isActive, mediaUrl } = req.body;
    
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

    // ✅ If file uploaded, use that; else use body.mediaUrl
    if (req.file) {
      item.mediaUrl = `/uploads/${req.file.filename}`;
    } else if (mediaUrl) {
      item.mediaUrl = mediaUrl;
    }

    await item.save();

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('❌ Update error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

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