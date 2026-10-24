import 'dotenv/config';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(process.env.DB_PATH || path.join(__dirname, '..', 'dormduty.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nim TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  room_number TEXT NOT NULL,
  floor INTEGER NOT NULL,
  role TEXT DEFAULT 'resident',
  avatar_url TEXT DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS zones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  floor INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS duties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  zone_id INTEGER REFERENCES zones(id),
  scheduled_date DATE NOT NULL,
  shift TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  proof_image TEXT DEFAULT NULL,
  note TEXT DEFAULT NULL,
  verified_by INTEGER REFERENCES users(id) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_duties_date ON duties(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_duties_user ON duties(user_id);
`);

export default db;
