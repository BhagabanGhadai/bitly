import fs from 'fs/promises';
import path from 'path';

import logger from '../config/logger.js';

const LOGS_DIR = path.join(process.cwd(), 'logs');
const MAX_AGE_DAYS = 7;

async function cleanOldLogs() {
  try {
    const files = await fs.readdir(LOGS_DIR);
    const now = Date.now();
    const maxAge = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

    for (const file of files) {
      const filePath = path.join(LOGS_DIR, file);
      const stats = await fs.stat(filePath);
      const age = now - stats.mtime.getTime();

      if (age > maxAge) {
        await fs.unlink(filePath);
        logger.info(`Deleted old log file: ${file}`);
      }
    }
  } catch (error) {
    logger.error('Error cleaning log files:', error);
  }
}

// Run cleanup if script is called directly
if (process.argv[1] === import.meta.url) {
  cleanOldLogs();
}

export default cleanOldLogs;
