const News = require('../models/News');

function slugify(text) {
  if (!text) return 'untitled';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const exists = await News.findOne({ slug });
    if (!exists) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

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

exports.createNews = async (req, res) => {
  try {
    console.log('📦 Creating news:', req.body);
    const requiredFields = ['title', 'image', 'date', 'description', 'content'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }
    const baseSlug = slugify(req.body.title);
    const slug = await generateUniqueSlug(baseSlug);
    req.body.slug = slug;
    const news = await News.create(req.body);
    res.status(201).json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('❌ Create Error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateNews = async (req, res) => {
  try {
    if (req.body.title) {
      const baseSlug = slugify(req.body.title);
      const slug = await generateUniqueSlug(baseSlug);
      req.body.slug = slug;
    }
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
    console.error('❌ Update Error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

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
    console.error('❌ Delete Error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};