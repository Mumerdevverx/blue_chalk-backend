const HomeItem = require('../models/HomeItem');

// ==========================================
// GET ALL HOME ITEMS
// ==========================================
exports.getHomeItems = async (req, res) => {
  try {
    const items = await HomeItem.find({ isActive: true })
      .sort({ order: 1 });

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('❌ Get Home Items Error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// CREATE HOME ITEM
// ==========================================
exports.createHomeItem = async (req, res) => {
  try {
    console.log('📦 Request Body:', req.body);
    console.log('📎 Request File:', req.file);

    const {
      title,
      type,
      link,
      description,
      order,
      isActive,
      workSlug
    } = req.body;

    // ======================================
    // MEDIA URL
    // ======================================
    let mediaUrl = '';

    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
    } else {
      mediaUrl = req.body.mediaUrl || '';
    }

    // ======================================
    // VALIDATION
    // ======================================
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Type is required'
      });
    }

    if (!mediaUrl) {
      return res.status(400).json({
        success: false,
        message: 'Media URL is required'
      });
    }

    // ======================================
    // CREATE HOME ITEM
    // ======================================
    const item = await HomeItem.create({
      title: title.trim(),
      type,
      mediaUrl,

      // Work project connection
      workSlug: workSlug ? workSlug.trim() : '',

      link: link || '',
      description: description || '',
      order: Number(order) || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    console.log('✅ Home Item Created:', item);

    res.status(201).json({
      success: true,
      message: 'Home item created successfully',
      data: item
    });

  } catch (error) {
    console.error('❌ Create Home Item Error:', error);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// UPDATE HOME ITEM
// ==========================================
exports.updateHomeItem = async (req, res) => {
  try {
    console.log('✏️ Update Request Body:', req.body);
    console.log('📎 Update Request File:', req.file);

    const {
      title,
      type,
      link,
      description,
      order,
      isActive,
      mediaUrl,
      workSlug
    } = req.body;

    // ======================================
    // FIND ITEM
    // ======================================
    const item = await HomeItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Home item not found'
      });
    }

    // ======================================
    // UPDATE BASIC FIELDS
    // ======================================
    if (title !== undefined && title.trim()) {
      item.title = title.trim();
    }

    if (type !== undefined && type) {
      item.type = type;
    }

    if (link !== undefined) {
      item.link = link;
    }

    if (description !== undefined) {
      item.description = description;
    }

    if (order !== undefined) {
      item.order = Number(order);
    }

    if (isActive !== undefined) {
      item.isActive = isActive;
    }

    // ======================================
    // UPDATE WORK SLUG
    // ======================================
    if (workSlug !== undefined) {
      item.workSlug = workSlug ? workSlug.trim() : '';
    }

    // ======================================
    // UPDATE MEDIA
    // ======================================
    if (req.file) {
      item.mediaUrl = `/uploads/${req.file.filename}`;
    } else if (mediaUrl !== undefined && mediaUrl.trim()) {
      item.mediaUrl = mediaUrl.trim();
    }

    // ======================================
    // SAVE
    // ======================================
    await item.save();

    console.log('✅ Home Item Updated:', item);

    res.json({
      success: true,
      message: 'Home item updated successfully',
      data: item
    });

  } catch (error) {
    console.error('❌ Update Home Item Error:', error);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// DELETE HOME ITEM
// ==========================================
exports.deleteHomeItem = async (req, res) => {
  try {
    const item = await HomeItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Home item not found'
      });
    }

    console.log('🗑️ Home Item Deleted:', item._id);

    res.json({
      success: true,
      message: 'Home item deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete Home Item Error:', error);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};