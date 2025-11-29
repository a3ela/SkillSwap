const express = require("express");
const {
  getPotentialMatches,
  connectWithUser,
} = require("../controllers/match.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", getPotentialMatches);
router.post("/:userId/connect", connectWithUser);

module.exports = router;
