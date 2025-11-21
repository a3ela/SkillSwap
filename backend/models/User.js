const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    minlength: 6,
    select: false,
  },

  // OAuth fields
  authProvider: {
    type: String,
    enum: ["local", "google", "github"],
    default: "local",
  },
  providerId: String, // ID from OAuth provider
  avatar: { type: String, default: "" },

  // Email verification
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,

  // Password reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  bio: {
    type: String,
    maxlength: [500, "Bio cannot be more than 500 characters"],
    default: "",
  },
  location: { type: String, default: "" },

  // Skills arrays
  skillsToTeach: [
    {
      skill: String,
      proficiency: {
        type: String,
        enum: ["beginner", "intermediate", "expert"],
        default: "intermediate",
      },
    },
  ],
  skillsToLearn: [
    {
      skill: String,
      currentLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner",
      },
    },
  ],

  // Rating system
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },

  // Availability
  availability: {
    timezone: { type: String, default: "UTC" },
    slots: [
      {
        day: {
          type: String,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
        },
        start: String,
        end: String,
        available: { type: Boolean, default: true },
      },
    ],
  },

  // Gamification
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
});

// Encrypt password only if it's modified (for local auth)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.authProvider !== "local") {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.authProvider !== "local") {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate email verification token
UserSchema.methods.getEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(20).toString("hex");

  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

// Generate password reset token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
