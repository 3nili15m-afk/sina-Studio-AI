import logger from '../utils/logger';
import { AgnesProvider } from './agnes/AgnesProvider';
class ProviderRegistry { private providers = new Map<string, AgnesProvider>(); async initializeAll(): Promise<void> { const provider = new AgnesProvider(); if (process.env.AGNES_ENABLED === 'true') { await provider.initialize({ name: 'agnes', apiKey: process.env.AGNES_API_KEY, apiUrl: process.env.AGNES_API_URL, timeout: Number(process.env.AGNES_TIMEOUT || 300000) }); this.providers.set('agnes', provider); logger.info('Agnes provider initialized'); } } getAvailableProviders() { return Array.from(this.providers.values()); } getStatus() { return Object.fromEntries(Array.from(this.providers.keys()).map((name) => [name, { initialized: true }])); } }
export default new ProviderRegistry();
