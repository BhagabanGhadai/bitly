import logger from '../config/logger.js';
import prisma from '../lib/prisma.js';

export class UserRepository {
  static async findByEmail(email) {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      return await prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      logger.error('Error finding user by id:', error);
      throw error;
    }
  }

  static async create(data) {
    try {
      return await prisma.user.create({
        data: {
          email: data.email,
          password: data.password,
        },
      });
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }
}
