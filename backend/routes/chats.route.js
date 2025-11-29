const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getConversation,
} = require("../controllers/chat.controller");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/", sendMessage);
router.get("/:userId", getConversation);

module.exports = router;
