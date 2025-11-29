// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();

// Passport config
require("./config/passport");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Session middleware
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/users", require("./routes/users.route"));
app.use("/api/chats", require("./routes/chats.route"));
app.use("/api/sessions", require("./routes/sessions.route"));
app.use("/api/matches", require("./routes/matches.route"));
app.use("/api/connections", require("./routes/connection.route"));
app.use("/api/chat", require("./routes/chats.route"));
app.use("/api/sessions", require("./routes/sessions.route"));

// Basic route
app.get("/api", (req, res) => {
  res.json({ message: "SkillSwap API is running!" });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ------------------ EXISTING CHAT HANDLERS ------------------

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("User joined personal room:", userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (chatRoomId) => {
    socket.join(chatRoomId);
    console.log("User joined chat:", chatRoomId);
  });

  socket.on("new message", (newMessage) => {
    const receiverId = newMessage.receiver;
    socket.to(receiverId).emit("message received", newMessage);
  });

  // ------------------------------------------------------------
  // 🚀 NEW: WEBRTC VIDEO CALL SIGNALING HANDLERS
  // ------------------------------------------------------------

  // 1️⃣ A user joins a VIDEO SESSION ROOM
  socket.on("join session", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined video session room: ${roomId}`);

    // Notify the other peer
    socket.to(roomId).emit("user joined", socket.id);
  });

  // 2️⃣ Relay the SDP Offer (caller → callee)
  socket.on("offer", (data) => {
    socket.to(data.roomId).emit("offer", {
      offer: data.offer,
      sender: socket.id,
    });
  });

  // 3️⃣ Relay the SDP Answer (callee → caller)
  socket.on("answer", (data) => {
    socket.to(data.roomId).emit("answer", {
      answer: data.answer,
      sender: socket.id,
    });
  });

  // 4️⃣ Relay ICE Candidates (both directions)
  socket.on("ice-candidate", (data) => {
    socket.to(data.roomId).emit("ice-candidate", {
      candidate: data.candidate,
      sender: socket.id,
    });
  });

  // ------------------------------------------------------------

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
