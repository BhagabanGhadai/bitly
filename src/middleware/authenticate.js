import passport from 'passport';

export const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    req.user = user;
    next();
  })(req, res, next);
};
