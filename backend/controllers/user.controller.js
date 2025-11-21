const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

// @desc    Get potential matches
// @route   GET /api/users/matches
// @access  Private
exports.getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    // Find users who have skills we want to learn, and want skills we have
    const potentialMatches = await User.find({
      _id: { $ne: req.user.id }, // Exclude current user
      $or: [
        { 
          'skillsToTeach.skill': { 
            $in: currentUser.skillsToLearn.map(s => s.skill) 
          } 
        },
        { 
          'skillsToLearn.skill': { 
            $in: currentUser.skillsToTeach.map(s => s.skill) 
          } 
        }
      ]
    }).select('name email bio avatar skillsToTeach skillsToLearn rating');

    res.json({
      success: true,
      data: potentialMatches
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error finding matches'
    });
  }
};

// @desc    Add skill to teach
// @route   POST /api/users/skills/teach
// @access  Private
exports.addSkillToTeach = async (req, res) => {
  try {
    const { skill, proficiency } = req.body;
    
    const user = await User.findById(req.user.id);
    user.skillsToTeach.push({ skill, proficiency });
    await user.save();

    res.json({
      success: true,
      data: user.skillsToTeach,
      message: 'Skill added successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error adding skill'
    });
  }
};

// @desc    Add skill to learn
// @route   POST /api/users/skills/learn
// @access  Private
exports.addSkillToLearn = async (req, res) => {
  try {
    const { skill, currentLevel } = req.body;
    
    const user = await User.findById(req.user.id);
    user.skillsToLearn.push({ skill, currentLevel });
    await user.save();

    res.json({
      success: true,
      data: user.skillsToLearn,
      message: 'Skill added successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error adding skill'
    });
  }
};

// @desc    Remove skill
// @route   DELETE /api/users/skills/:type/:skillId
// @access  Private
exports.removeSkill = async (req, res) => {
  try {
    const { type, skillId } = req.params;
    
    const user = await User.findById(req.user.id);
    
    if (type === 'teach') {
      user.skillsToTeach = user.skillsToTeach.filter(skill => skill._id.toString() !== skillId);
    } else if (type === 'learn') {
      user.skillsToLearn = user.skillsToLearn.filter(skill => skill._id.toString() !== skillId);
    }
    
    await user.save();

    res.json({
      success: true,
      message: 'Skill removed successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error removing skill'
    });
  }
};