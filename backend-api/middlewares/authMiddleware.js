// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const Farmer = require('../models/farmer');
const JWT_SECRET = process.env.JWT_SECRET || 'agrohelp';

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await Farmer.findById(decoded.id).select('-password'); // exclude password
    if (!req.user) {
      return res.status(404).json({ error: 'User not found' });
    }
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
