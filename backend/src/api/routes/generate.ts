import { Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import orchestrator from '../../orchestrator/Orchestrator';
const router = Router();
router.use(authenticateToken);
const map: Record<string, string> = { image: 'image_generation', video: 'video_generation', audio: 'audio_generation', speech: 'text_to_speech' };
router.post('/:kind', async (req: AuthenticatedRequest, res, next) => { try { const kind = map[req.params.kind]; if (!kind) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Unsupported generation type' } }); const job = await orchestrator.createJob({ userId: req.user!.userId, jobType: kind as any, input: req.body }); res.status(202).json({ success: true, data: job }); } catch (e) { next(e); } });
export default router;
