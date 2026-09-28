const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadImage } = require('../controllers/newsimageController');

// ─────────────────────────────────────────────────────────────────────────────
// VERCEL FIX: Use memoryStorage — Vercel's serverless containers have a
// READ-ONLY filesystem. diskStorage tries to write to 'uploads/' which
// does NOT exist and CANNOT be created on Vercel → causes ENOENT/EROFS → 500.
// memoryStorage keeps the file in req.file.buffer (RAM). No disk write needed.
// ─────────────────────────────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  }
});

// Error handling wrapper for multer
router.post('/', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'FILE_TOO_LARGE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 20MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
    // No error — proceed to controller
    uploadImage(req, res);
  });
});

module.exports = router;