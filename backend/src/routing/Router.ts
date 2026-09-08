import logger from '../utils/logger';
import { AgnesProvider } from '../providers/agnes/AgnesProvider';
import { IProvider } from '../providers/interfaces/IProvider';

export interface RoutingContext {
  type: string;
  qualityRequired?: 'low' | 'medium' | 'high';
  costConstraint?: number;
  userPreference?: string;
}

export class Router {
  private providers: Map<string, IProvider> = new Map();

  constructor() {
    this.initializeProviders();
  }

  private async initializeProviders() {
    try {
      const agnesProvider = new AgnesProvider();
      await agnesProvider.initialize({
        name: 'agnes',
        timeout: 300000,
      });
      this.providers.set('agnes', agnesProvider);
      logger.info('Router initialized with providers');
    } catch (error) {
      logger.error('Failed to initialize providers', error);
    }
  }

  async selectProvider(context: RoutingContext): Promise<IProvider> {
    logger.info(`Selecting provider for ${context.type}`);

    // Filter providers by capability
    const capableProviders = Array.from(this.providers.values()).filter((p) =>
      p.capabilities.includes(context.type)
    );

    if (capableProviders.length === 0) {
      throw new Error(`No provider available for ${context.type}`);
    }

    // Check health and rate limits
    for (const provider of capableProviders) {
      const isHealthy = await provider.healthCheck();
      if (isHealthy) {
        const rateLimit = await provider.getRateLimit();
        if (rateLimit.remaining > 0) {
          logger.info(`Selected provider: ${provider.name}`);
          return provider;
        }
      }
    }

    // Fallback to first provider if none are healthy
    logger.warn('No healthy provider found, using fallback');
    return capableProviders[0];
  }

  getProvider(name: string): IProvider | undefined {
    return this.providers.get(name);
  }

  listProviders(): IProvider[] {
    return Array.from(this.providers.values());
  }
}
