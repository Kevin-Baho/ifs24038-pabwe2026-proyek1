import { Router } from 'express';
import db from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.get('/', authenticate, (req, res) => {
  const { floor } = req.query;
  const rows = floor
    ? db.prepare('SELECT * FROM zones WHERE floor = ? ORDER BY name').all(Number(floor))
    : db.prepare('SELECT * FROM zones ORDER BY floor, name').all();
  res.json({ success: true, data: rows });
});
export default router;
