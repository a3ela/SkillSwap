// backend/controllers/matchController.js
const User = require("../models/User");
const { calculateMatchScore } = require("../utils/matchingAlgorithm");

// @desc    Get potential matches for user
// @route   GET /api/matches
// @access  Private
exports.getPotentialMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    // Get all other users (with pagination in production)
    const potentialUsers = await User.find({
      _id: { $ne: req.user.id },
      // Add more filters as needed (location, active status, etc.)
    }).select(
      "name email bio avatar skillsToTeach skillsToLearn rating location availability"
    );

    // Calculate match scores for each potential user
    const matchesWithScores = potentialUsers.map((potentialUser) => {
      const matchResult = calculateMatchScore(currentUser, potentialUser);

      return {
        user: {
          _id: potentialUser._id,
          name: potentialUser.name,
          email: potentialUser.email,
          bio: potentialUser.bio,
          avatar: potentialUser.avatar,
          skillsToTeach: potentialUser.skillsToTeach,
          skillsToLearn: potentialUser.skillsToLearn,
          rating: potentialUser.rating,
          location: potentialUser.location,
        },
        matchScore: matchResult.totalScore,
        breakdown: matchResult.breakdown,
        sharedSkills: findSharedSkills(currentUser, potentialUser),
      };
    });

    // Sort by match score (highest first)
    const sortedMatches = matchesWithScores.sort(
      (a, b) => b.matchScore - a.matchScore
    );

    res.json({
      success: true,
      data: sortedMatches,
      count: sortedMatches.length,
    });
  } catch (error) {
    console.error("Get matches error:", error);
    res.status(500).json({
      success: false,
      message: "Error finding matches",
    });
  }
};

// Helper function to find shared skills
const findSharedSkills = (userA, userB) => {
  const shared = [];

  // Skills userA can teach that userB wants to learn
  userA.skillsToTeach.forEach((teachSkill) => {
    userB.skillsToLearn.forEach((learnSkill) => {
      if (teachSkill.skill.toLowerCase() === learnSkill.skill.toLowerCase()) {
        shared.push({
          skill: teachSkill.skill,
          type: "you_teach_they_learn",
          yourProficiency: teachSkill.proficiency,
          theirLevel: learnSkill.currentLevel,
        });
      }
    });
  });

  // Skills userB can teach that userA wants to learn
  userB.skillsToTeach.forEach((teachSkill) => {
    userA.skillsToLearn.forEach((learnSkill) => {
      if (teachSkill.skill.toLowerCase() === learnSkill.skill.toLowerCase()) {
        shared.push({
          skill: teachSkill.skill,
          type: "they_teach_you_learn",
          theirProficiency: teachSkill.proficiency,
          yourLevel: learnSkill.currentLevel,
        });
      }
    });
  });

  return shared;
};

// @desc    Save a match (when user connects with someone)
// @route   POST /api/matches/:userId/connect
// @access  Private
exports.connectWithUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Add to user's matches array
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { matches: userId },
    });

    res.json({
      success: true,
      message: "Connection made successfully",
    });
  } catch (error) {
    console.error("Connect error:", error);
    res.status(500).json({
      success: false,
      message: "Error making connection",
    });
  }
};
