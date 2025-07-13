import express from 'express';
import passport from 'passport';

const router = express.Router();

// Start Google Auth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback from Google
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/signup.html' }),
  (req, res) => {
    const { name, email, role, _id } = req.user;
    const redirectUrl = `http://localhost:5500/google-success.html?name=${name}&email=${email}&role=${role}&_id=${_id}`;
    res.redirect(redirectUrl);
  }
);

export default router;
