import jwt from 'jsonwebtoken';

export const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export const readToken = (req) => {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(h.slice(7), process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

export const authenticate = (req, res, next) => {
  const payload = readToken(req);
  if (!payload) return res.status(401).json({ success: false, message: 'Token tidak valid atau kedaluwarsa' });
  req.user = payload;
  next();
};

export const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user.role)
    ? next()
    : res.status(403).json({ success: false, message: 'Akses ditolak' });
