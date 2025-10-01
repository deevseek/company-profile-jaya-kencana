const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
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

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', authMiddleware, upload.single('image'), createProject);
router.put('/:id', authMiddleware, upload.single('image'), updateProject);
router.delete('/:id', authMiddleware, deleteProject);

module.exports = router;
