// backend/routes/users.js
const express = require("express");
const {
  getProfile,
  updateProfile,
  getMatches,
  addSkillToTeach,
  addSkillToLearn,
  removeSkill,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect); // All user routes are protected

router.route("/profile").get(getProfile).put(updateProfile);

router.get("/matches", getMatches);

router.route("/skills/teach").post(addSkillToTeach);

router.route("/skills/learn").post(addSkillToLearn);

router.route("/skills/:type/:skillId").delete(removeSkill);

module.exports = router;
