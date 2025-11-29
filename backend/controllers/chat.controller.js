const Chat = require("../models/Chat");
const Connection = require("../models/Connection");

// @desc    Send a message
// @route   POST /api/chats
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.user.id;

    // Security: Check if users are actually connected
    const isConnected = await Connection.findOne({
      $or: [
        { requester: senderId, recipient: recipientId, status: "accepted" },
        { requester: recipientId, recipient: senderId, status: "accepted" },
      ],
    });

    if (!isConnected) {
      return res
        .status(403)
        .json({ message: "You must be connected to message this user." });
    }

    const newMessage = await Chat.create({
      sender: senderId,
      receiver: recipientId,
      message,
    });

    // Populate sender info so frontend can display it immediately if needed
    await newMessage.populate("sender", "name avatar");

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get conversation with a specific user
// @route   GET /api/chats/:userId
exports.getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const myId = req.user.id;

    const messages = await Chat.find({
      $or: [
        { sender: myId, receiver: otherUserId },
        { sender: otherUserId, receiver: myId },
      ],
    }).sort({ createdAt: 1 });

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
