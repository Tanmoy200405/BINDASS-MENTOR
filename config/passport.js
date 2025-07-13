import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js'; // Your Mongoose user schema

// Debug log
console.log('GOOGLE_CLIENT_ID:', process.env.CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.CLIENT_SECRET);

passport.use(new GoogleStrategy({
  clientID:process.env.CLIENT_ID,       // ✅ Loaded from .env
  clientSecret:process.env.CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const name = profile.displayName;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "",     // No password for Google login
        role: "mentee"    // Default role, can be changed
      });
    }

    done(null, user);
  } catch (err) {
    console.error('Error in Google Strategy:', err);
    done(err, null);
  }
}));

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
