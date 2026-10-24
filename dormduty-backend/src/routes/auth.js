import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { signToken, readToken } from '../middleware/auth.js';

const router = Router();
const publicUser = ({ password, ...u }) => u;

router.post('/register', (req, res) => {
  const { nim, name, email, password, room_number, floor } = req.body;
  if (!nim || !name || !email || !password || !room_number || !floor)
    return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
  if (String(password).length < 6)
    return res.status(400).json({ success: false, message: 'Kata sandi minimal 6 karakter' });

  const dup = db.prepare('SELECT id FROM users WHERE nim = ? OR email = ?').get(nim, email);
  if (dup) return res.status(409).json({ success: false, message: 'NIM atau email sudah terdaftar' });

  // Role koordinator/admin hanya boleh ditetapkan oleh admin yang sedang login
  let role = 'resident';
  const caller = readToken(req);
  if (caller?.role === 'admin' && ['coordinator', 'admin'].includes(req.body.role)) role = req.body.role;

  const info = db
    .prepare('INSERT INTO users (nim, name, email, password, room_number, floor, role) VALUES (?,?,?,?,?,?,?)')
    .run(nim, name, email, bcrypt.hashSync(password, 10), room_number, Number(floor), role);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ success: true, message: 'Registrasi berhasil', data: publicUser(user) });
});

router.post('/login', (req, res) => {
  const identifier = req.body.identifier || req.body.email || req.body.nim;
  const { password } = req.body;
  if (!identifier || !password)
    return res.status(400).json({ success: false, message: 'NIM/Email dan kata sandi wajib diisi' });

  const user = db.prepare('SELECT * FROM users WHERE email = ? OR nim = ?').get(identifier, identifier);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ success: false, message: 'Kredensial salah' });

  res.json({ success: true, message: 'Login berhasil', data: { token: signToken(user), user: publicUser(user) } });
});

export default router;
