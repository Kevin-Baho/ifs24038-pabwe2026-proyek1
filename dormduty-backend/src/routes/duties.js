import { Router } from 'express';
import db from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { uploadProof } from '../middleware/upload.js';

const router = Router();
router.use(authenticate);

const BASE = `
  SELECT d.*, u.name AS user_name, u.nim AS user_nim, u.room_number AS user_room,
         z.name AS zone_name, z.floor AS floor, v.name AS verifier_name
  FROM duties d
  JOIN users u ON u.id = d.user_id
  JOIN zones z ON z.id = d.zone_id
  LEFT JOIN users v ON v.id = d.verified_by`;
const findOne = (id) => db.prepare(`${BASE} WHERE d.id = ?`).get(id);

function filters(q, userId) {
  const where = [];
  const params = [];
  if (q.date) { where.push('d.scheduled_date = ?'); params.push(q.date); }
  if (q.floor) { where.push('z.floor = ?'); params.push(Number(q.floor)); }
  if (q.status) { where.push('d.status = ?'); params.push(q.status); }
  if (q.is_me === '1') { where.push('d.user_id = ?'); params.push(userId); }
  return { clause: where.length ? 'WHERE ' + where.join(' AND ') : '', params };
}

// GET /duties/stats  (harus di atas /:id)
router.get('/stats', (req, res) => {
  const { clause, params } = filters({ date: req.query.date, floor: req.query.floor, is_me: req.query.is_me }, req.user.id);
  const r = db.prepare(`
    SELECT COUNT(*) AS total,
      SUM(d.status = 'approved') AS approved,
      SUM(d.status = 'submitted') AS submitted,
      SUM(d.status = 'rejected') AS rejected,
      SUM(d.status = 'pending') AS pending,
      SUM(d.status = 'pending' AND d.scheduled_date < date('now','localtime')) AS overdue
    FROM duties d JOIN zones z ON z.id = d.zone_id ${clause}`).get(...params);
  const s = Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v ?? 0]));
  res.json({
    success: true,
    data: {
      total: s.total, completed: s.approved, awaiting_verification: s.submitted,
      rejected: s.rejected, pending: s.pending, overdue: s.overdue,
      completion_rate: s.total ? Math.round((s.approved / s.total) * 100) : 0,
    },
  });
});

router.get('/', (req, res) => {
  const { clause, params } = filters(req.query, req.user.id);
  const rows = db.prepare(`${BASE} ${clause} ORDER BY d.scheduled_date DESC, d.shift, z.floor`).all(...params);
  res.json({ success: true, data: rows });
});

router.get('/:id', (req, res) => {
  const d = findOne(req.params.id);
  if (!d) return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan' });
  res.json({ success: true, data: d });
});

router.post('/', requireRole('admin', 'coordinator'), (req, res) => {
  const { user_id, zone_id, scheduled_date, shift } = req.body;
  if (!user_id || !zone_id || !scheduled_date || !['pagi', 'sore'].includes(shift))
    return res.status(400).json({ success: false, message: 'user_id, zone_id, scheduled_date, dan shift (pagi|sore) wajib valid' });
  if (!db.prepare('SELECT id FROM users WHERE id = ?').get(user_id) || !db.prepare('SELECT id FROM zones WHERE id = ?').get(zone_id))
    return res.status(400).json({ success: false, message: 'Pengguna atau zona tidak ditemukan' });
  const info = db.prepare('INSERT INTO duties (user_id, zone_id, scheduled_date, shift) VALUES (?,?,?,?)')
    .run(user_id, zone_id, scheduled_date, shift);
  res.status(201).json({ success: true, message: 'Jadwal dibuat', data: findOne(info.lastInsertRowid) });
});

router.put('/:id', requireRole('admin', 'coordinator'), (req, res) => {
  const cur = db.prepare('SELECT * FROM duties WHERE id = ?').get(req.params.id);
  if (!cur) return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan' });
  const { user_id = cur.user_id, zone_id = cur.zone_id, scheduled_date = cur.scheduled_date, shift = cur.shift } = req.body;
  if (!['pagi', 'sore'].includes(shift)) return res.status(400).json({ success: false, message: 'Shift tidak valid' });
  db.prepare('UPDATE duties SET user_id=?, zone_id=?, scheduled_date=?, shift=? WHERE id=?')
    .run(user_id, zone_id, scheduled_date, shift, cur.id);
  res.json({ success: true, message: 'Jadwal diperbarui', data: findOne(cur.id) });
});

router.delete('/:id', requireRole('admin', 'coordinator'), (req, res) => {
  const info = db.prepare('DELETE FROM duties WHERE id = ?').run(req.params.id);
  if (!info.changes) return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan' });
  res.json({ success: true, message: 'Jadwal dihapus' });
});

router.post('/:id/proof', (req, res) => {
  uploadProof(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    const d = db.prepare('SELECT * FROM duties WHERE id = ?').get(req.params.id);
    if (!d) return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan' });
    if (d.user_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Bukan tugas Anda' });
    if (!['pending', 'rejected'].includes(d.status))
      return res.status(400).json({ success: false, message: `Tugas berstatus ${d.status}, tidak dapat mengunggah bukti` });
    if (!req.file) return res.status(400).json({ success: false, message: 'Foto bukti wajib diunggah (field: proof)' });
    db.prepare(`UPDATE duties SET proof_image = ?, note = ?, status = 'submitted', verified_by = NULL WHERE id = ?`)
      .run(`/uploads/proofs/${req.file.filename}`, req.body.note || null, d.id);
    res.json({ success: true, message: 'Bukti diunggah, menunggu verifikasi', data: findOne(d.id) });
  });
});

router.put('/:id/verify', requireRole('admin', 'coordinator'), (req, res) => {
  const { status, note } = req.body;
  if (!['approved', 'rejected'].includes(status))
    return res.status(400).json({ success: false, message: "status harus 'approved' atau 'rejected'" });
  if (status === 'rejected' && !note?.trim())
    return res.status(400).json({ success: false, message: 'Catatan alasan wajib diisi saat menolak' });
  const d = db.prepare('SELECT * FROM duties WHERE id = ?').get(req.params.id);
  if (!d) return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan' });
  if (d.status !== 'submitted')
    return res.status(400).json({ success: false, message: 'Hanya tugas berstatus submitted yang dapat diverifikasi' });
  db.prepare('UPDATE duties SET status = ?, note = ?, verified_by = ? WHERE id = ?')
    .run(status, note || d.note, req.user.id, d.id);
  res.json({ success: true, message: status === 'approved' ? 'Tugas disetujui' : 'Tugas ditolak', data: findOne(d.id) });
});

export default router;
