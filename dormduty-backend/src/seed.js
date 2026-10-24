import bcrypt from 'bcryptjs';
import db from './db.js';

const hash = (p) => bcrypt.hashSync(p, 10);
const addUser = db.prepare(
  'INSERT OR IGNORE INTO users (nim, name, email, password, room_number, floor, role) VALUES (?,?,?,?,?,?,?)'
);
[
  ['000001', 'Admin Asrama', 'admin@dormduty.test', 'admin123', 'Kamar 101', 1, 'admin'],
  ['000002', 'Koordinator Lantai 2', 'koordinator@dormduty.test', 'koor123', 'Kamar 201', 2, 'coordinator'],
  ['210001', 'Budi Santoso', 'budi@dormduty.test', 'warga123', 'Kamar 204', 2, 'resident'],
  ['210002', 'Siti Aminah', 'siti@dormduty.test', 'warga123', 'Kamar 305', 3, 'resident'],
].forEach(([nim, name, email, pw, room, floor, role]) => addUser.run(nim, name, email, hash(pw), room, floor, role));

if (db.prepare('SELECT COUNT(*) c FROM zones').get().c === 0) {
  const addZone = db.prepare('INSERT INTO zones (name, description, floor) VALUES (?,?,?)');
  [
    ['Kamar Mandi Lantai 2', 'Seluruh kamar mandi & wastafel', 2],
    ['Koridor Sayap Barat', 'Lorong dan area tangga barat', 2],
    ['Pantry Lantai 3', 'Dapur bersama dan tempat sampah', 3],
    ['Kamar Mandi Lantai 3', 'Seluruh kamar mandi & wastafel', 3],
  ].forEach((z) => addZone.run(...z));
}

if (db.prepare('SELECT COUNT(*) c FROM duties').get().c === 0) {
  const uid = (nim) => db.prepare('SELECT id FROM users WHERE nim = ?').get(nim).id;
  const today = new Date();
  const d = (off) => new Date(today.getTime() + off * 864e5).toISOString().slice(0, 10);
  const add = db.prepare('INSERT INTO duties (user_id, zone_id, scheduled_date, shift, status) VALUES (?,?,?,?,?)');
  add.run(uid('210001'), 1, d(0), 'pagi', 'pending');
  add.run(uid('210001'), 2, d(1), 'sore', 'pending');
  add.run(uid('210002'), 3, d(0), 'sore', 'submitted');
  add.run(uid('210002'), 4, d(-1), 'pagi', 'approved');
  add.run(uid('210001'), 2, d(-2), 'pagi', 'pending'); // lalai
}
console.log('Seed selesai. Akun: admin@dormduty.test/admin123, koordinator@dormduty.test/koor123, budi@dormduty.test/warga123');
