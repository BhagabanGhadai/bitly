import express from 'express';
import passport from 'passport';

import { AuthService } from '../services/auth.service.js';
import { authSchema } from '../validations/index.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = authSchema.parse(req.body);
    const result = await AuthService.register(email, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info.message });

    const token = AuthService.generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email } });
  })(req, res, next);
});

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = AuthService.generateToken(req.user);
    res.redirect(`/auth-success?token=${token}`);
  }
);

export { router as authRouter };
