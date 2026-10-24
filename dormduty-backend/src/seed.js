import bcrypt from 'bcryptjs';
import db from './db.js';

const hash = (p) => bcrypt.hashSync(p, 10);

// Nonaktifkan foreign keys sementara untuk pembersihan dan reset data seed
db.pragma('foreign_keys = OFF');

// Bersihkan duties lama agar tidak ada relasi menggantung
db.exec('DELETE FROM duties;');

// Hanya sisakan akun dengan NIM 000001 dan 000002 (hapus Budi, Siti, dan akun lainnya)
db.prepare(`
  DELETE FROM users 
  WHERE nim NOT IN ('000001', '000002')
`).run();

// Masukkan / update 2 akun utama (Admin & Koordinator)
const upsertUser = db.prepare(`
  INSERT INTO users (nim, name, email, password, room_number, floor, role)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(nim) DO UPDATE SET
    name = excluded.name,
    email = excluded.email,
    password = excluded.password,
    room_number = excluded.room_number,
    floor = excluded.floor,
    role = excluded.role
`);

const users = [
  ['000001', 'Admin Asrama', 'admin@dormduty.test', 'admin123', 'Kamar 101', 1, 'admin'],
  ['000002', 'Koordinator Lantai 2', 'koordinator@dormduty.test', 'koor123', 'Kamar 201', 2, 'coordinator'],
];

users.forEach(([nim, name, email, pw, room, floor, role]) => {
  upsertUser.run(nim, name, email, hash(pw), room, floor, role);
});

// Reset dan ganti seluruh data tabel zones (Total 50 Lokasi Kurve)
db.exec('DELETE FROM zones;');

const insertZone = db.prepare('INSERT INTO zones (name, description, floor) VALUES (?, ?, ?)');

const zonesFloor1 = [
  'Selasar arah SUD',
  'Selasar arah parkiran',
  'Selasar tengah hingga teras',
  'Ruang belajar A',
  'Ruang Belajar B',
  'Ruang Loker Sepatu',
  'Ruang Loker Setrika',
  'Selasar ujung arah SUD',
  'Selasar ujung arah Parkiran',
  'Ruang panel listrik, keran darurat dan wastafel Arah SUD',
  'Ruang panel listrik, keran darurat dan wastafel Arah Parkiran',
  'Halaman Depan sepanjang depan asrama',
  'Ruangan Alat Kurve',
  'Halaman samping kiri-kanan dan parit keliling asrama',
  'Tangga 1-2 tengah',
  'Tangga 1-2 arah parkiran',
  'Tangga 1-2 arah SUD',
].map((name) => [name, 'Area kurve Lantai 1', 1]);

const zonesFloor2 = [
  'Selasar kamar 1 - 6',
  'Selasar kamar 19 - 24',
  'Selasar kamar 7 - 12',
  'Selasar kamar 13 - 18',
  'Selasar tengah lantai 2 hingga teras',
  'Tangga 2 - 3 tengah',
  'Selasar ujung arah SUD',
  'Selasar ujung arah Parkiran',
  'Ruang panel listrik, keran darurat dan wastafel Arah SUD',
  'Ruang panel listrik, keran darurat dan wastafel Arah Parkiran',
  'Ruang Alat Kurve',
  'Tangga 2 - 3 arah SUD',
  'Tangga 2 - 3 arah parkiran',
].map((name) => [name, 'Area kurve Lantai 2', 2]);

const zonesFloor3 = [
  'Selasar kamar 1 - 6',
  'Selasar kamar 19 - 24',
  'Selasar tengah hingga teras',
  'Tangga 3-4 tengah',
  'Selasar ujung arah SUD',
  'Selasar ujung arah Parkiran',
  'Ruang panel listrik, keran darurat dan wastafel arah parkiran',
  'Ruangan Alat Kurve',
].map((name) => [name, 'Area kurve Lantai 3', 3]);

const zonesFloor4 = [
  'Selasar kamar 1 - 6',
  'Selasar kamar 19 - 24',
  'Selasar kamar 7 - 12',
  'Selasar kamar 13 - 18',
  'Selasar tengah hingga teras',
  'Tangga rooftop - 4',
  'Selasar ujung arah SUD',
  'Selasar ujung arah Parkiran',
  'Ruang panel listrik, keran darurat dan wastafel',
  'Ruang alat kurve',
  'Tangga 3-4 arah parkiran',
  'Tangga 3-4 arah SUD',
].map((name) => [name, 'Area kurve Lantai 4', 4]);

const allZones = [...zonesFloor1, ...zonesFloor2, ...zonesFloor3, ...zonesFloor4];

allZones.forEach(([name, desc, floor]) => {
  insertZone.run(name, desc, floor);
});

// Aktifkan kembali foreign keys
db.pragma('foreign_keys = ON');

const countUsers = db.prepare('SELECT COUNT(*) c FROM users').get().c;
const countZones = db.prepare('SELECT COUNT(*) c FROM zones').get().c;
const countDuties = db.prepare('SELECT COUNT(*) c FROM duties').get().c;

console.log(`Seed selesai.`);
console.log(`- Jumlah pengguna aktif: ${countUsers}`);
console.log(`- Jumlah zona kurve: ${countZones} (L1: 17, L2: 13, L3: 8, L4: 12)`);
console.log(`- Jumlah tugas: ${countDuties}`);
console.log('Akun tersedia:');
console.log('  1. admin@dormduty.test / admin123 (NIM: 000001, Admin)');
console.log('  2. koordinator@dormduty.test / koor123 (NIM: 000002, Coordinator)');
