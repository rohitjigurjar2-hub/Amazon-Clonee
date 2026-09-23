const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

module.exports = router;
