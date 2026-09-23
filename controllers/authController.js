const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getDb, saveDb } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function registerUser(req, res) {
  const { name, email, password, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide name, email, and password.' });
  }

  const db = getDb();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    return res.status(400).json({ success: false, error: 'User with this email already exists.' });
  }

  const userId = `user-${Date.now()}`;
  const passwordHash = hashPassword(password);

  const newUser = {
    id: userId,
    name,
    email: email.toLowerCase(),
    passwordHash,
    address: address || '',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb(db);

  const token = jwt.sign({ id: newUser.id, name: newUser.name, email: newUser.email }, JWT_SECRET, { expiresIn: '30d' });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      address: newUser.address
    }
  });
}

function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide email and password.' });
  }

  const db = getDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid email or password.' });
  }

  const passwordHash = hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    return res.status(401).json({ success: false, error: 'Invalid email or password.' });
  }

  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

  res.json({
    success: true,
    message: 'Logged in successfully',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address || ''
    }
  });
}

function getUserProfile(req, res) {
  const db = getDb();
  const user = db.users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address || '',
      createdAt: user.createdAt
    }
  });
}

function updateUserProfile(req, res) {
  const db = getDb();
  const user = db.users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }

  const { name, address } = req.body;
  if (name) user.name = name;
  if (address !== undefined) user.address = address;

  saveDb(db);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address
    }
  });
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
