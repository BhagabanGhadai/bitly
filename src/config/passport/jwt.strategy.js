import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../../repositories/user.repository.js';

export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, done) => {
    try {
      const user = await UserRepository.findById(payload.id);
      return user ? done(null, user) : done(null, false);
    } catch (error) {
      return done(error);
    }
  }
);