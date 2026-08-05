const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateMe,
  forgotPassword,
  resetPassword,
  requestLoginOtp,
  loginWithOtp,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

// Forgot password (OTP-based reset)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Passwordless OTP login
router.post('/request-login-otp', requestLoginOtp);
router.post('/login-otp', loginWithOtp);

module.exports = router;
