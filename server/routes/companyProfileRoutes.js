const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile
} = require('../controllers/companyProfileController');
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
const uploadFields = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'legalDocument', maxCount: 1 }
]);

router.get('/', getProfiles);
router.get('/:id', getProfile);
router.post('/', authMiddleware, uploadFields, createProfile);
router.put('/:id', authMiddleware, uploadFields, updateProfile);
router.delete('/:id', authMiddleware, deleteProfile);

module.exports = router;
