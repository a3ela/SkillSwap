// backend/controllers/sessionController.js
const Session = require("../models/Session");

// @desc    Create session
// @route   POST /api/sessions
// @access  Private
exports.createSession = async (req, res) => {
  try {
    const { teacherId, skill, scheduledDate, duration, agenda } = req.body;

    const session = await Session.create({
      teacher: teacherId,
      learner: req.user.id,
      skill,
      scheduledDate,
      duration,
      agenda,
      status: "pending",
    });

    await session.populate("teacher", "name email avatar");
    await session.populate("learner", "name email avatar");

    res.status(201).json({
      success: true,
      data: session,
      message: "Session requested successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error creating session",
    });
  }
};

// @desc    Get user sessions
// @route   GET /api/sessions
// @access  Private
exports.getUserSessions = async (req, res) => {
  try {
    const { type = "all" } = req.query; // all, teaching, learning

    let query = {};

    if (type === "teaching") {
      query.teacher = req.user.id;
    } else if (type === "learning") {
      query.learner = req.user.id;
    } else {
      query.$or = [{ teacher: req.user.id }, { learner: req.user.id }];
    }

    const sessions = await Session.find(query)
      .populate("teacher", "name email avatar")
      .populate("learner", "name email avatar")
      .sort({ scheduledDate: 1 });

    res.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error fetching sessions",
    });
  }
};

// @desc    Update session status
// @route   PUT /api/sessions/:sessionId/status
// @access  Private
exports.updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status, notes, meetingLink } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // Check if user is teacher or learner
    if (
      session.teacher.toString() !== req.user.id &&
      session.learner.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this session",
      });
    }

    // Only teacher can confirm/cancel sessions
    if (
      ["confirmed", "cancelled"].includes(status) &&
      session.teacher.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the teacher can confirm or cancel sessions",
      });
    }

    session.status = status;
    if (notes) session.notes = notes;
    if (meetingLink) session.meetingLink = meetingLink;

    await session.save();
    await session.populate("teacher", "name email avatar");
    await session.populate("learner", "name email avatar");

    res.json({
      success: true,
      data: session,
      message: "Session updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error updating session",
    });
  }
};
