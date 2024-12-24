import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import logger from '../config/logger.js';
import { UserRepository } from '../repositories/user.repository.js';

export class AuthService {
  static async register(email, password) {
    try {
      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserRepository.create({
        email,
        password: hashedPassword,
      });

      const token = this.generateToken(user);
      return { token, user: { id: user.id, email: user.email } };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  static generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
  }

  static async generateRandomPassword() {
    const buffer = await crypto.randomBytes(32);
    return buffer.toString('hex');
  }
}
