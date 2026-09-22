import { Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { User } from '../../database/models';
const router = Router();
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res, next) => { try { const user = await User.findById(req.user!.userId).select('-passwordHash -apiKey'); res.json({ success: true, data: user }); } catch (e) { next(e); } });
router.patch('/me/preferences', authenticateToken, async (req: AuthenticatedRequest, res, next) => { try { const user = await User.findByIdAndUpdate(req.user!.userId, { $set: { preferences: req.body } }, { new: true }).select('-passwordHash -apiKey'); res.json({ success: true, data: user }); } catch (e) { next(e); } });
export default router;
