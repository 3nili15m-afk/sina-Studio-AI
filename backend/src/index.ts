/**
 * Server entry point
 */

import config from './config';
import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './database/connection';
import registry from './providers/registry';
import orchestrator from './orchestrator/Orchestrator';
import logger from './utils/logger';

/**
 * Start server
 */
async function start(): Promise<void> {
  try {
    logger.info('Starting AI Platform backend server...');

    // Connect to database
    logger.info('Connecting to database...');
    await connectDatabase();
    logger.info('Database connected');

    // Initialize providers
    logger.info('Initializing providers...');
    await registry.initializeAll();
    const availableProviders = registry.getAvailableProviders();
    logger.info(`${availableProviders.length} providers initialized`);

    // Register providers with orchestrator
    for (const provider of availableProviders) {
      orchestrator.registerProvider(provider);
    }

    // Create Express app
    const app = createApp();

    // Start listening
    const server = app.listen(config.port, config.host, () => {
      logger.info(
        `Server listening on http://${config.host}:${config.port}`,
      );
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`API Version: ${config.apiVersion}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`Received ${signal}, shutting down gracefully...`);

      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDatabase();
        logger.info('Database disconnected');
        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown due to timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

// Start if not imported as module
if (require.main === module) {
  start();
}

export { start };
