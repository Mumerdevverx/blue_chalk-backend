
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

function compareWorksByOrder(a, b) {
  const aOrder = Number(a.order);
  const bOrder = Number(b.order);

  const aHasOrder = Number.isFinite(aOrder) && aOrder > 0;
  const bHasOrder = Number.isFinite(bOrder) && bOrder > 0;

  if (aHasOrder !== bHasOrder) {
    return aHasOrder ? -1 : 1;
  }

  if (aHasOrder && aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  const createdAtDifference =
    new Date(a.createdAt || 0) - new Date(b.createdAt || 0);

  return createdAtDifference || String(a._id).localeCompare(String(b._id));
}

async function generateUniqueSlug(baseSlug, excludeId = null) {
  const safeBaseSlug = baseSlug || 'untitled';
  let slug = safeBaseSlug;
  let counter = 1;

  while (true) {
    const filter = { slug };

    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    const exists = await Work.findOne(filter).select('_id').lean();

    if (!exists) return slug;

    slug = `${safeBaseSlug}-${counter}`;
    counter++;
  }
}

// 1. Get All Works
exports.getWorks = async (req, res) => {
  const startedAt = Date.now();

  try {
    const { category } = req.query;

    // Admin can request all works, including inactive ones.
    // Public requests continue to show active works only.
    const filter = {};

    if (req.query.includeInactive !== 'true') {
      filter.isActive = true;
    }

    if (category && category !== 'All Projects' && category !== 'All') {
      const catLower = category.toLowerCase();

      if (catLower === 'brand' || catLower === 'branded') {
        filter.category = {
          $in: ['Brand', 'Branded', 'brand', 'branded']
        };
      } else if (catLower === 'award' || catLower === 'awards') {
        filter.category = {
          $in: ['Award', 'awards', 'award']
        };
      } else {
        filter.category = new RegExp(`^${category}$`, 'i');
      }
    }

    const works = await Work.find(filter)
      .select('+aboutContent')
      .sort({ order: 1, createdAt: 1, _id: 1 })
      .lean();

    console.log(
      `[Work] Fetched in ${Date.now() - startedAt}ms, returned=${works.length}`
    );

    res.status(200).json({
      success: true,
      count: works.length,
      data: works
    });

  } catch (error) {
    console.error('Get Works Error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 2. Get Work By Slug
exports.getWorkBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const work = await Work.findOne({ slug })
      .select('+aboutContent')
      .lean();

    if (!work) {
      console.log('[Work] Slug not found:', slug);

      return res.status(404).json({
        success: false,
        message: 'Work not found',
        requestedSlug: slug
      });
    }

    res.status(200).json({
      success: true,
      data: work
    });

  } catch (error) {
    console.error('Get Work By Slug Error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 3. Get Work By ID
exports.getWorkById = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id)
      .select('+aboutContent')
      .lean();

    if (!work) {
      return res.status(404).json({
        success: false,
        message: 'Work not found'
      });
    }

    res.status(200).json({
      success: true,
      data: work
    });

  } catch (error) {
    console.error('Get Work By ID Error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 4. Create Work
exports.createWork = async (req, res) => {
  try {
    const {
      aboutContent,
      category,
      image,
      buttonText,
      showOverlay,
      overlayType,
      order
    } = req.body;

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

    res.status(201).json({
      success: true,
      data: work
    });

  } catch (error) {
    console.error('Create Work Error:', error);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// 5. Update Work
exports.updateWork = async (req, res) => {
  try {
    const { aboutContent } = req.body;

    const updateData = { ...req.body };

    if (req.body.order !== undefined) {
      updateData.order = Number(req.body.order);
    }

    // Preserve existing slug unless content/title actually changes.
    if (aboutContent) {
      const existingWork = await Work.findById(req.params.id)
        .select('title slug')
        .lean();

      if (!existingWork) {
        return res.status(404).json({
          success: false,
          message: 'Work not found'
        });
      }

      const newTitle = generateTitle(aboutContent);

      if (newTitle !== existingWork.title) {
        updateData.title = newTitle;

        const baseSlug = slugify(newTitle);

        updateData.slug = await generateUniqueSlug(
          baseSlug,
          req.params.id
        );
      }
    }

    const work = await Work.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!work) {
      return res.status(404).json({
        success: false,
        message: 'Work not found'
      });
    }

    res.status(200).json({
      success: true,
      data: work
    });

  } catch (error) {
    console.error('Update Work Error:', error);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// 6. Delete Work
exports.deleteWork = async (req, res) => {
  try {
    const work = await Work.findByIdAndDelete(req.params.id);

    if (!work) {
      return res.status(404).json({
        success: false,
        message: 'Work not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Work deleted successfully'
    });

  } catch (error) {
    console.error('Delete Work Error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
