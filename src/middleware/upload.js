const multer = require('multer');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// VERCEL FIX: Use memoryStorage — Vercel's serverless containers have a
// READ-ONLY filesystem. diskStorage tries to write to 'uploads/' which
// does NOT exist and CANNOT be created on Vercel → causes ENOENT/EROFS → 500.
// Files are held in req.file.buffer (RAM). No disk write needed.
// ─────────────────────────────────────────────────────────────────────────────

// File filter - images and videos only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|wmv|flv|mkv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed!'));
  }
};

// Upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: fileFilter
});
 
module.exports = upload;