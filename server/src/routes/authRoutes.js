import express from 'express';
const router = express.Router();
// Auth routes — implemented in Phase 1 (feature/auth)
router.get('/me', (_req, res) => res.status(401).json({ success: false, message: 'Not authenticated' }));
export default router;
