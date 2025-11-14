const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Farmer = require('../models/farmer');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Secret key for JWT (you should keep this in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'agrohelp';

// ✅ Signup route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingFarmer = await Farmer.findOne({ email });
    if (existingFarmer) {
      return res.status(400).json({ error: 'Farmer already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newFarmer = new Farmer({ name, email, password: hashedPassword });
    await newFarmer.save();

    // Create JWT token
    const token = jwt.sign(
      { id: newFarmer._id, email: newFarmer.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Signup successful',
      farmer: {
        id: newFarmer._id,
        name: newFarmer.name,
        email: newFarmer.email,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ error: 'Signup failed', message: error.message });
  }
});

// ✅ Signin route
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingFarmer = await Farmer.findOne({ email });
    if (!existingFarmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, existingFarmer.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: existingFarmer._id, email: existingFarmer.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      farmer: {
        id: existingFarmer._id,
        name: existingFarmer.name,
        email: existingFarmer.email,
      },
      token,
    });
  } catch (error) {
    console.error('Signin error:', error.message);
    res.status(500).json({ error: 'Signin failed', message: error.message });
  }
});

// Get logged-in user details
router.get("/me", verifyToken, async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.user.id).select("-password");
    res.json({ farmer });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
