const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const JWT_EXPIRES_IN = '7d'; // token lifetime

function sendTokenCookie(res, user) {
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // set true in prod (HTTPS)
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be 6+ chars' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash });

    sendTokenCookie(res, user);

    // fire n8n webhook if configured
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        await axios.post(process.env.N8N_WEBHOOK_URL, {
          event: 'signup',
          user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }
        });
      } catch (err) {
        console.error('n8n webhook error:', err.message);
      }
    }

    res.status(201).json({ message: 'User created', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    sendTokenCookie(res, user);

    // optional: notify n8n on login
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        await axios.post(process.env.N8N_WEBHOOK_URL, {
          event: 'login',
          user: { id: user._id, name: user.name, email: user.email, loggedAt: new Date() }
        });
      } catch (err) {
        console.error('n8n webhook error:', err.message);
      }
    }

    res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  res.json({ message: 'Logged out' });
});

// Protected: get current user
const authMiddleware = require('../middleware/auth');
router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

module.exports = router;
