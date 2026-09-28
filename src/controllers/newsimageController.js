// ─────────────────────────────────────────────────────────────────────────────
// VERCEL FIX:
// - Removed fs.mkdirSync — Vercel's filesystem is read-only, this throws at startup.
// - Removed req.file.filename — only exists with diskStorage (not memoryStorage).
// - Now reads req.file.buffer and returns a base64 data URL.
//   The frontend can use this URL directly in <img src="..."> or store in MongoDB.
//
// NOTE: For production scale, replace base64 with a Cloudinary/S3 upload
//       using req.file.buffer, and store the returned hosted URL instead.
// ─────────────────────────────────────────────────────────────────────────────

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Convert buffer → base64 data URL (works on Vercel, no disk required)
    const base64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const dataUrl = `data:${mimeType};base64,${base64}`;

    res.json({
      success: true,
      data: {
        url: dataUrl,
        filename: req.file.originalname,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: mimeType
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};