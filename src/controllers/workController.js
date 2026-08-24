const Work = require('../models/Work');

function slugify(text) {
  if (!text) return 'untitled';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateTitle(aboutContent) {
  if (!aboutContent) return 'Untitled Project';
  const plainText = aboutContent.replace(/<[^>]*>/g, '').trim();
  return plainText.substring(0, 50) || 'Untitled Project';
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

exports.getWorks = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'All Projects') {
      filter.category = category;
    }
    const works = await Work.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: works.length, data: works });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWorkBySlug = async (req, res) => {
  try {
    const work = await Work.findOne({ slug: req.params.slug, isActive: true });
    if (!work) return res.status(404).json({ success: false, message: 'Work not found' });
    res.json({ success: true, data: work });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWorkById = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ success: false, message: 'Work not found' });
    res.json({ success: true, data: work });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createWork = async (req, res) => {
  try {
    const { aboutContent, category, image, buttonText, showOverlay, overlayType } = req.body;
    
    // Generate title from aboutContent
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
      isActive: true
    };

    const work = await Work.create(workData);
    res.status(201).json({ success: true, data: work });
  } catch (error) {
    console.error('❌ Create error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateWork = async (req, res) => {
  try {
    const { aboutContent, title, slug } = req.body;
    // If aboutContent updated, regenerate title and slug
    let updateData = { ...req.body };
    if (aboutContent) {
      const newTitle = generateTitle(aboutContent);
      updateData.title = newTitle;
      const baseSlug = slugify(newTitle);
      updateData.slug = await generateUniqueSlug(baseSlug);
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

exports.deleteWork = async (req, res) => {
  try {
    const work = await Work.findByIdAndDelete(req.params.id);
    if (!work) return res.status(404).json({ success: false, message: 'Work not found' });
    res.json({ success: true, message: 'Work deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};