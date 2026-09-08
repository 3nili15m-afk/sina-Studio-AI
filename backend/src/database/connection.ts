/**
 * Database connection and configuration
 */

import mongoose from 'mongoose';
import config from '../config';
import logger from '../utils/logger';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(config.database.url, {
      maxPoolSize: config.database.poolSize,
      serverSelectionTimeoutMS: config.database.timeout,
      socketTimeoutMS: config.database.timeout,
    });
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('Database disconnected');
  } catch (error) {
    logger.error('Database disconnection failed', error);
    throw error;
  }
}

export function getDatabaseStatus(): { connected: boolean; timestamp: Date } {
  return {
    connected: mongoose.connection.readyState === 1,
    timestamp: new Date(),
  };
}
