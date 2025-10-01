const express = require('express');
const {
  getMessages,
  getMessage,
  createMessage,
  deleteMessage
} = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getMessages);
router.get('/:id', authMiddleware, getMessage);
router.post('/', createMessage);
router.delete('/:id', authMiddleware, deleteMessage);

module.exports = router;
