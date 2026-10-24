import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';

const router = Router();
router.use(authenticate);

const COLS = 'id, nim, name, email, room_number, floor, role, avatar_url, bio, created_at';

router.get('/', (req, res) => {
  const { floor, search } = req.query;
  const where = [];
  const params = [];
  if (floor) { where.push('floor = ?'); params.push(Number(floor)); }
  if (search) {
    where.push('(name LIKE ? OR nim LIKE ? OR room_number LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  const sql = `SELECT ${COLS} FROM users ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY floor, room_number, name`;
  res.json({ success: true, data: db.prepare(sql).all(...params) });
});

router.get('/me', (req, res) => {
  const me = db.prepare(`SELECT ${COLS} FROM users WHERE id = ?`).get(req.user.id);
  if (!me) return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
  res.json({ success: true, data: me });
});

router.put('/me', (req, res) => {
  const cur = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  const { bio = cur.bio, room_number = cur.room_number, floor = cur.floor, name = cur.name } = req.body;
  db.prepare('UPDATE users SET bio = ?, room_number = ?, floor = ?, name = ? WHERE id = ?')
    .run(bio, room_number, Number(floor), name, req.user.id);
  res.json({ success: true, message: 'Profil diperbarui', data: db.prepare(`SELECT ${COLS} FROM users WHERE id = ?`).get(req.user.id) });
});

router.post('/me/photo', (req, res) => {
  uploadAvatar(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'File foto wajib diunggah (field: photo)' });
    const url = `/uploads/avatars/${req.file.filename}`;
    db.prepare('UPDATE users SET avatar_url = ? WHERE id = ?').run(url, req.user.id);
    res.json({ success: true, message: 'Foto diperbarui', data: { avatar_url: url } });
  });
});

router.put('/me/password', (req, res) => {
  const { old_password, new_password } = req.body;
  if (!old_password || !new_password || String(new_password).length < 6)
    return res.status(400).json({ success: false, message: 'Sandi lama wajib diisi, sandi baru minimal 6 karakter' });
  const u = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
  if (!bcrypt.compareSync(old_password, u.password))
    return res.status(400).json({ success: false, message: 'Kata sandi lama salah' });
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(bcrypt.hashSync(new_password, 10), req.user.id);
  res.json({ success: true, message: 'Kata sandi berhasil diubah' });
});

export default router;
