const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, sendMobileOtp } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/send-otp', sendMobileOtp);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
