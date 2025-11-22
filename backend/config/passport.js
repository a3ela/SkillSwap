const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          $or: [
            { email: profile.emails[0].value },
            { providerId: profile.id, authProvider: "google" },
          ],
        });

        if (user) {
          // Update user if they exist
          user.avatar = profile.photos[0].value;
          user.lastActive = new Date();
          await user.save();
        } else {
          // Create new user
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            authProvider: "google",
            providerId: profile.id,
            isEmailVerified: true, 
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // GitHub might not return email in profile
        const email =
          profile.emails && profile.emails[0]
            ? profile.emails[0].value
            : `${profile.username}@github.user`;

        let user = await User.findOne({
          $or: [
            { email: email },
            { providerId: profile.id, authProvider: "github" },
          ],
        });

        if (user) {
          user.avatar = profile.photos[0].value;
          user.lastActive = new Date();
          await user.save();
        } else {
          user = await User.create({
            name: profile.displayName || profile.username,
            email: email,
            avatar: profile.photos[0].value,
            authProvider: "github",
            providerId: profile.id,
            isEmailVerified: true, // Trust GitHub authentication
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
