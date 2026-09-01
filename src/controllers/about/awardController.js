const Award = require('../../models/about/AwardItem');

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
    const exists = await Award.findOne({ slug });
    if (!exists) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

exports.getAwards = async (req, res) => {
  try {
    const awards = await Award.find({ isActive: true }).sort({ year: -1 });
    res.json({ success: true, data: awards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAwardBySlug = async (req, res) => {
  try {
    const award = await Award.findOne({ slug: req.params.slug, isActive: true });
    if (!award) return res.status(404).json({ success: false, message: 'Award not found' });
    res.json({ success: true, data: award });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAward = async (req, res) => {
  try {
    console.log('📦 Creating award with data:', req.body); // DEBUG
    const { title } = req.body;
    const baseSlug = slugify(title);
    const slug = await generateUniqueSlug(baseSlug);
    const awardData = { ...req.body, slug };
    const award = await Award.create(awardData);
    console.log('✅ Award created:', award); // DEBUG
    res.status(201).json({ success: true, data: award });
  } catch (error) {
    console.error('❌ Error creating award:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateAward = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.body.title) {
      const baseSlug = slugify(req.body.title);
      updateData.slug = await generateUniqueSlug(baseSlug);
    }
    const award = await Award.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!award) return res.status(404).json({ success: false, message: 'Award not found' });
    res.json({ success: true, data: award });
  } catch (error) {
    console.error('❌ Error updating award:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteAward = async (req, res) => {
  try {
    const award = await Award.findByIdAndDelete(req.params.id);
    if (!award) return res.status(404).json({ success: false, message: 'Award not found' });
    res.json({ success: true, message: 'Award deleted' });
  } catch (error) {
    console.error('❌ Error deleting award:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};