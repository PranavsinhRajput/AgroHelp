const express = require('express');
const { getDB, admin } = require('../db');
const verifyToken = require('../middlewares/authMiddleware');
const { authWriteLimiter } = require('../middlewares/rateLimiter');
const logger = require('../utils/logger');

const router = express.Router();

// ✅ Signup route - Syncs Firebase User with Firestore Profile
router.post('/signup', authWriteLimiter, verifyToken, async (req, res) => {
  try {
    const { name, village, phone } = req.body;
    const { uid, email } = req.user;

    if (!name || !village || !phone) {
      logger.warn('Signup failed: Missing fields', { uid, name, village, phone });
      return res.status(400).json({ error: 'Name, village, and phone are required' });
    }

    const db = getDB();
    const userRef = db.collection('farmers').doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      logger.info('User already registered, updating profile', { uid });
    } else {
      logger.info('New farmer registration', { uid, phone });
    }

    const farmerData = {
      uid,
      name,
      village,
      phone,
      email: email || '',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: userDoc.exists ? userDoc.data().createdAt : admin.firestore.FieldValue.serverTimestamp(),
    };

    await userRef.set(farmerData, { merge: true });

    logger.info('Farmer profile synced successfully', { uid });

    res.status(201).json({
      message: 'Signup successful',
      farmer: farmerData,
    });
  } catch (error) {
    logger.error('Signup sync error', error);
    res.status(500).json({ error: 'Signup failed', message: error.message });
  }
});

// ✅ Get logged-in user details
router.get("/me", verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const userDoc = await db.collection('farmers').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      logger.warn('User profile not found in Firestore', { uid: req.user.uid });
      return res.status(404).json({ error: 'Farmer profile not found. Please complete signup.' });
    }

    const farmerData = userDoc.data();
    logger.info('User profile fetched', { uid: req.user.uid });
    
    res.json({ farmer: { id: userDoc.id, ...farmerData } });
  } catch (error) {
    logger.error('Error fetching user data', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// ✅ Health check/Monitor auth events (Internal use or admin)
router.get("/stats", verifyToken, async (req, res) => {
  // Simple check if user is admin could be added here
  try {
    const db = getDB();
    const snapshot = await db.collection('farmers').count().get();
    res.json({ total_farmers: snapshot.data().count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
