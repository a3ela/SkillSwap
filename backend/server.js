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

// Basic route
app.get("/api", (req, res) => {
  res.json({ message: "SkillSwap API is running!" });
});

// Socket.io for real-time features
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-user", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("join-chat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("send-message", (data) => {
    socket.to(data.chatId).emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
