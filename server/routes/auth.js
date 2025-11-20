import express from 'express';
import passport from '../config/passport.js';

const router = express.Router();

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub OAuth callback
router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: 'https://streakup-client.onrender.com/login',
  }),
  (req, res) => {
    res.redirect('https://streakup-client.onrender.com/dashboard');
  }
);

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.redirect('https://streakup-client.onrender.com/login');
  });
});

router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

export default router;
