import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import dutyRoutes from './routes/duties.js';
import zoneRoutes from './routes/zones.js';
import { uploadsRoot } from './middleware/upload.js';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use('/uploads', express.static(uploadsRoot));

app.get('/api/v1/health', (req, res) => res.json({ success: true, message: 'DormDuty API OK' }));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/duties', dutyRoutes);
app.use('/api/v1/zones', zoneRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
});

export default app;
