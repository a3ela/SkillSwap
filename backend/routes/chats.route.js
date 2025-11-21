// backend/routes/chats.js
const express = require('express');
const {
  getUserChats,
  getOrCreateChat,
  sendMessage,
  getChatMessages
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All chat routes are protected

router.route('/')
  .get(getUserChats)
  .post(getOrCreateChat);

router.route('/:chatId/messages')
  .get(getChatMessages)
  .post(sendMessage);

module.exports = router;