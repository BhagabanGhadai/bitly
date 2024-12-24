export default passport;
import passport from 'passport';
import { jwtStrategy } from './passport/jwt.strategy.js';
import { localStrategy } from './passport/local.strategy.js';
import { googleStrategy } from './passport/google.strategy.js';

export function initializePassport() {
  passport.use(jwtStrategy);
  passport.use(localStrategy);
  passport.use(googleStrategy);
  
  return passport.initialize();
}