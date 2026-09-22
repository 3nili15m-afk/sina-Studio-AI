import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../../database/models';
import { AuthenticatedRequest, authenticateToken, generateToken } from '../middleware/auth';
import { AppError } from '../../types/errors';
import config from '../../config';

const router = Router();
const publicUser = (user: any) => ({ id: user._id.toString(), email: user.email, username: user.username, role: user.role, preferences: user.preferences });
router.post('/register', async (req, res, next) => { try {
  const { email, username, password } = req.body;
  if (!email || !username || typeof password !== 'string' || password.length < 8) throw new AppError('INVALID_INPUT', 'Email, username and a password of at least 8 characters are required', 400);
  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ $or: [{ email: normalizedEmail }, { username: username.trim() }] })) throw new AppError('CONFLICT', 'Email or username is already in use', 409);
  const user = await User.create({ email: normalizedEmail, username: username.trim(), passwordHash: await bcrypt.hash(password, config.jwt.bcryptRounds) });
  res.status(201).json({ success: true, data: { user: publicUser(user), token: generateToken(user._id.toString(), user.email, user.role) } });
} catch (e) { next(e); } });
router.post('/login', async (req, res, next) => { try {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(String(password || ''), user.passwordHash))) throw new AppError('UNAUTHORIZED', 'Invalid email or password', 401);
  user.lastLoginAt = new Date(); await user.save();
  res.json({ success: true, data: { user: publicUser(user), token: generateToken(user._id.toString(), user.email, user.role) } });
} catch (e) { next(e); } });
router.post('/logout', authenticateToken, (_req, res) => res.json({ success: true, data: { loggedOut: true } }));
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res, next) => { try { const user = await User.findById(req.user!.userId); if (!user) throw new AppError('NOT_FOUND', 'User not found', 404); res.json({ success: true, data: publicUser(user) }); } catch (e) { next(e); } });
export default router;
