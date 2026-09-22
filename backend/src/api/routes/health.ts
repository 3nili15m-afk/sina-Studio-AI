import { Router } from 'express';
import { connectDatabase, getDatabaseStatus } from '../../database/connection';
import registry from '../../providers/registry';
const router = Router();
router.get('/', (_req, res) => res.json({ status: 'healthy', timestamp: new Date().toISOString(), version: '1.0.0' }));
router.get('/detailed', (_req, res) => { const db = getDatabaseStatus(); const providers = registry.getStatus(); const healthy = db.connected; res.status(healthy ? 200 : 503).json({ status: healthy ? 'healthy' : 'degraded', database: db, providers }); });
export default router;
