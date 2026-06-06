const admin = require('firebase-admin');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || '',
    };
    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
