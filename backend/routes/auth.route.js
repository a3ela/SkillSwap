// backend/routes/auth.js
const express = require("express");
const passport = require("passport");
const {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  oauthSuccess,
  oauthFailure,
} = require("../controllers/auth.controller");

const router = express.Router();

// Local Auth
router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

// OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/failure" }),
  oauthSuccess
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/api/auth/failure" }),
  oauthSuccess
);

router.get("/success", oauthSuccess);
router.get("/failure", oauthFailure);

module.exports = router;
