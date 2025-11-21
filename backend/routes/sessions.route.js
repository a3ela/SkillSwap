// backend/routes/sessions.js
const express = require("express");
const {
  createSession,
  getUserSessions,
  updateSessionStatus,
} = require("../controllers/sessionController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect); // All session routes are protected

router.route("/").get(getUserSessions).post(createSession);

router.route("/:sessionId/status").put(updateSessionStatus);

module.exports = router;
