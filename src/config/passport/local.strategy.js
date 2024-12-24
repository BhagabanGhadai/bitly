import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../../repositories/user.repository.js';

export const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);