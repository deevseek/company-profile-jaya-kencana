const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getGallery,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} = require('../controllers/galleryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

router.get('/', getGallery);
router.get('/:id', getGalleryItem);
router.post('/', authMiddleware, upload.single('image'), createGalleryItem);
router.put('/:id', authMiddleware, upload.single('image'), updateGalleryItem);
router.delete('/:id', authMiddleware, deleteGalleryItem);

module.exports = router;
