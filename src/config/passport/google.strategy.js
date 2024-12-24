import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserRepository } from '../../repositories/user.repository.js';
import { AuthService } from '../../services/auth.service.js';
import logger from '../logger.js';

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await UserRepository.findByEmail(email);

      if (!user) {
        user = await UserRepository.create({
          email,
          password: await AuthService.generateRandomPassword(),
          googleId: profile.id,
        });
      }

      return done(null, user);
    } catch (error) {
      logger.error('Google authentication error:', error);
      return done(error);
    }
  }
);