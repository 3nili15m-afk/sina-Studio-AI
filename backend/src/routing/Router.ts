import logger from '../utils/logger';
import { IProvider } from '../providers/interfaces/IProvider';
export class Router { async route(type: string, providers: IProvider[]): Promise<{ providerName: string; reasoning: string }> { const provider = providers.find((candidate) => candidate.capabilities.includes(type)); if (!provider) throw new Error(`No provider available for ${type}`); logger.info(`Selected provider ${provider.name} for ${type}`); return { providerName: provider.name, reasoning: `Selected by capability: ${type}` }; } }
