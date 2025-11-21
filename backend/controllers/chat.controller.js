const Chat = require('../models/Chat');

// @desc    Get user's chats
// @route   GET /api/chats
// @access  Private
exports.getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id,
      isActive: true
    })
    .populate('participants', 'name email avatar')
    .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: chats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching chats'
    });
  }
};

// @desc    Get or create chat
// @route   POST /api/chats
// @access  Private
exports.getOrCreateChat = async (req, res) => {
  try {
    const { participantId } = req.body;

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, participantId] },
      isActive: true
    }).populate('participants', 'name email avatar');

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        participants: [req.user.id, participantId],
        messages: []
      });
      
      await chat.populate('participants', 'name email avatar');
    }

    res.json({
      success: true,
      data: chat
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error creating chat'
    });
  }
};

// @desc    Send message
// @route   POST /api/chats/:chatId/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { content, messageType = 'text' } = req.body;
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send message in this chat'
      });
    }

    const newMessage = {
      sender: req.user.id,
      content,
      messageType
    };

    chat.messages.push(newMessage);
    await chat.updateLastMessage(newMessage);
    await chat.save();

    await chat.populate('messages.sender', 'name avatar');
    await chat.populate('participants', 'name email avatar');

    const savedMessage = chat.messages[chat.messages.length - 1];

    res.json({
      success: true,
      data: savedMessage,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error sending message'
    });
  }
};

// @desc    Get chat messages
// @route   GET /api/chats/:chatId/messages
// @access  Private
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate('messages.sender', 'name avatar')
      .populate('participants', 'name email avatar');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    if (!chat.participants.some(participant => participant._id.toString() === req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this chat'
      });
    }

    res.json({
      success: true,
      data: chat.messages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching messages'
    });
  }
};