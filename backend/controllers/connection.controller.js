const Connection = require("../models/Connection");
const User = require("../models/User");

// @desc    Send a connection request
// @route   POST /api/connections/request/:userId
exports.sendConnectionRequest = async (req, res) => {
  console.log("here: nowwww");
  try {
    const recipientId = req.params.userId;
    const requesterId = req.user.id;

    if (recipientId === requesterId) {
      return res
        .status(400)
        .json({ message: "You cannot connect with yourself" });
    }

    const existingConnection = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existingConnection) {
      return res
        .status(400)
        .json({ message: "Connection request already exists" });
    }

    const newConnection = await Connection.create({
      requester: requesterId,
      recipient: recipientId,
      status: "pending",
    });

    res.status(201).json({ success: true, data: newConnection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all my connections (pending & accepted)
// @route   GET /api/connections
exports.getMyConnections = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [{ requester: req.user.id }, { recipient: req.user.id }],
    }).populate("requester recipient", "name avatar email"); // Get user details

    res.json({ success: true, data: connections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const { status } = req.body; 
    const connectionId = req.params.id;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (connection.recipient.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to handle this request" });
    }

    connection.status = status;
    await connection.save();

    res.json({ success: true, data: connection, message: `Request ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
