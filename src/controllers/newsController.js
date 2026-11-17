const mongoose = require('mongoose');
const News = require('../models/News');

const DEFAULT_NEWS_PAGE_SIZE = 50;

function parsePositiveInteger(value, defaultValue) {
  if (value === undefined) return defaultValue;
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return null;

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

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
  const startedAt = Date.now();
  const page = parsePositiveInteger(req.query.page, 1);
  const limit = parsePositiveInteger(req.query.limit, DEFAULT_NEWS_PAGE_SIZE);

  if (!page || !limit || limit > DEFAULT_NEWS_PAGE_SIZE) {
    return res.status(400).json({
      success: false,
      message: `page and limit must be positive integers; limit cannot exceed ${DEFAULT_NEWS_PAGE_SIZE}`
    });
  }

  const skip = (page - 1) * limit;

  try {
    const filter = { isActive: true };
    
    // ✅ Sirf zaroori fields fetch hongi (Speed 1 second)
    const newsFields = 'title slug image date description isActive views createdAt';
    
    const [news, count] = await Promise.all([
      News.find(filter)
        .select(newsFields) 
        .sort({ _id: -1 })  // ✅ Naya data sabse pehle aayega
        .skip(skip)
        .limit(limit)
        .maxTimeMS(10000)
        .lean(),
      News.countDocuments(filter).maxTimeMS(10000)
    ]);

    console.info(
      `[news] GET /api/news query succeeded in ${Date.now() - startedAt}ms ` +
      `(page=${page}, limit=${limit}, returned=${news.length}, total=${count})`
    );
    
    res.json({
      success: true,
      count,
      data: news
    });
  } catch (error) {
    console.error(`[news] GET /api/news failed in ${Date.now() - startedAt}ms:`, error.message);
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
    news.views = (news.views || 0) + 1;
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

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