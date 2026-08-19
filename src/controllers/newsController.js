const News = require('../models/News');

// ✅ GET ALL NEWS
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find({ isActive: true })
      .select('-__v')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ GET NEWS BY SLUG
exports.getNewsBySlug = async (req, res) => {
  try {
    const news = await News.findOne({ 
      slug: req.params.slug,
      isActive: true 
    }).select('-__v');
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }
    
    news.views += 1;
    await news.save();
    
    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ GET NEWS BY ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).select('-__v');
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }
    
    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ CREATE NEWS
exports.createNews = async (req, res) => {
  try {
    console.log('📦 Request Body:', req.body);
    
    // Check for duplicate title
    const existing = await News.findOne({ title: req.body.title });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'News with this title already exists'
      });
    }
    
    const news = await News.create(req.body);
    res.status(201).json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('❌ Error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry. Please use a different title.'
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ UPDATE NEWS
exports.updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }
    
    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ DELETE NEWS
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }
    
    res.json({
      success: true,
      message: 'News deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};