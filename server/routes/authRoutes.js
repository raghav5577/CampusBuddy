const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, verifyOTP } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/verify', verifyOTP);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
