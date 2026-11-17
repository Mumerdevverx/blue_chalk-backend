const Work = require('../models/Work');

function slugify(text) {
  if (!text) return 'untitled';
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function generateTitle(aboutContent) {
  if (!aboutContent) return 'Untitled Project';
  const plainText = aboutContent.replace(/<[^>]*>/g, '').trim();
  return plainText.substring(0, 50) || 'Untitled Project';
}

function compareWorksByOrder(a, b) {
  const aOrder = Number(a.order);
  const bOrder = Number(b.order);
  const aHasOrder = Number.isFinite(aOrder) && aOrder > 0;
  const bHasOrder = Number.isFinite(bOrder) && bOrder > 0;

  if (aHasOrder !== bHasOrder) return aHasOrder ? -1 : 1;
  if (aHasOrder && aOrder !== bOrder) return aOrder - bOrder;

  const createdAtDifference = new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
  return createdAtDifference || String(a._id).localeCompare(String(b._id));
}

async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const exists = await Work.findOne({ slug });
    if (!exists) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// ✅ 1. Get All Works
exports.getWorks = async (req, res) => {
  const startedAt = Date.now();
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    
    if (category && category !== 'All Projects' && category !== 'All') {
      const catLower = category.toLowerCase();
      if (catLower === 'brand' || catLower === 'branded') {
        filter.category = { $in: ['Brand', 'Branded', 'brand', 'branded'] };
      } else if (catLower === 'award' || catLower === 'awards') {
        filter.category = { $in: ['Award', 'awards', 'award'] };
      } else {
        filter.category = new RegExp(`^${category}$`, 'i');
      }
    }

    // ✅ Yahan koi limit nahi hai. Saare 142 blogs aayenge.
    const works = await Work.find(filter)
      .select('-aboutContent') 
      .sort({ order: 1, createdAt: 1, _id: 1 })
      .lean();

    console.log(`[Work] Fetched in ${Date.now() - startedAt}ms, returned=${works.length}`);
    res.json({ success: true, count: works.length, data: works });
  } catch (error) {
    console.error('❌ Get Works Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ 2. Get Work By Slug
exports.getWorkBySlug = async (req, res) => {
  try {
    const work = await Work.findOne({ slug: req.params.slug, isActive: true });
    if (!work) return res.status(404).json({ success: false, message: 'Work not found' });
    res.json({ success: true, data: work });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ 3. Get Work By ID
exports.getWorkById = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ success: false, message: 'Work not found' });
    res.json({ success: true, data: work });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ 4. Create Work
exports.createWork = async (req, res) => {
  try {
    const { aboutContent, category, image, buttonText, showOverlay, overlayType, order } = req.body;
    
    const title = generateTitle(aboutContent);
    const baseSlug = slugify(title);
    const slug = await generateUniqueSlug(baseSlug);

    const workData = {
      title,
      slug,
      category,
      image,
      buttonText: buttonText || 'Watch Now',
      aboutContent,
      showOverlay: showOverlay || false,
      overlayType: overlayType || '',
      order: Number(order) || 0,
      isActive: true
    };

    const work = await Work.create(workData);
    res.status(201).json({ success: true, data: work });
  } catch (error) {
    console.error('❌ Create error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ 5. Update Work
exports.updateWork = async (req, res) => {
  try {
    const { aboutContent } = req.body;
    let updateData = { ...req.body };
    if (aboutContent) {
      const newTitle = generateTitle(aboutContent);
      updateData.title = newTitle;
      const baseSlug = slugify(newTitle);
      updateData.slug = await generateUniqueSlug(baseSlug);
    }
    if (req.body.order !== undefined) {
      updateData.order = Number(req.body.order);
    }

    const work = await Work.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    if (!work) return res.status(404).json({ success: false, message: 'Work not found' });
    res.json({ success: true, data: work });
  } catch (error) {
    console.error('❌ Update error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ 6. Delete Work
exports.deleteWork = async (req, res) => {
  try {
    const work = await Work.findByIdAndDelete(req.params.id);
    if (!work) return res.status(404).json({ success: false, message: 'Work not found' });
    res.json({ success: true, message: 'Work deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};