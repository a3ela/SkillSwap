const express = require("express");
const router = express.Router();
const {
  scheduleSession,
  getUserSessions,
  completeSession,
} = require("../controllers/session.controller");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/", scheduleSession);
router.get("/", getUserSessions);
router.put("/:id/complete", completeSession);

module.exports = router;
