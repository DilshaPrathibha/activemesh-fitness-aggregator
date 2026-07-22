import express from 'express';
const router = express.Router();
// Gym routes — implemented in Phase 3 (feature/gym-listing)
router.get('/', (_req, res) => res.json({ success: true, data: [], message: 'Gyms endpoint — coming in Phase 3' }));
export default router;
