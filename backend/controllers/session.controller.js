const Session = require('../models/Session');
const Connection = require('../models/Connection'); // To verify connection

// Helper function to generate a unique Room ID
const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};


// @desc    Schedule a new session (called by the Learner or Tutor)
// @route   POST /api/sessions
exports.scheduleSession = async (req, res) => {
  try {
    const { partnerId, skill, scheduledTime, role } = req.body;
    const myId = req.user.id;

    // Security check: Must be connected
    const connection = await Connection.findOne({
        $or: [
            { requester: myId, recipient: partnerId, status: 'accepted' },
            { requester: partnerId, recipient: myId, status: 'accepted' }
        ]
    });

    if (!connection) {
        return res.status(403).json({ message: "You must be connected to schedule a session." });
    }

    const newSession = await Session.create({
        learner: role === 'learner' ? myId : partnerId,
        tutor: role === 'tutor' ? myId : partnerId,
        skill: skill,
        scheduledTime: new Date(scheduledTime),
        roomId: generateRoomId() // Unique ID for the video call
    });

    res.status(201).json({ success: true, data: newSession });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get all sessions for the current user
// @route   GET /api/sessions
exports.getUserSessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            $or: [{ learner: req.user.id }, { tutor: req.user.id }]
        })
        .populate('learner tutor', 'name avatar');
        
        res.json({ success: true, data: sessions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark a session as completed (future step for XP/Gamification)
// @route   PUT /api/sessions/:id/complete
exports.completeSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        
        if (session.status !== 'completed') {
            session.status = 'completed';
            await session.save();
            // TODO: Here is where you'd trigger the XP/Gamification logic
        }

        res.json({ success: true, message: "Session marked as complete." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};