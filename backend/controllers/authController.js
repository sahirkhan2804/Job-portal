const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOtp, hashOtp, getExpiry, MAX_ATTEMPTS } = require('../utils/otp');
const { sendOtpEmail } = require('../utils/email');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// @route POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, company, headline } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === 'employer' ? 'employer' : 'seeker',
      company,
      headline,
    });

    const token = generateToken(user._id);
    res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};

// @route PUT /api/auth/me
exports.updateMe = async (req, res) => {
  try {
    const allowedFields = ['name', 'company', 'headline', 'skills', 'resumeUrl'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- Forgot password (OTP-based reset) ----------

// @route POST /api/auth/forgot-password  { email }
// Always responds with a generic success message, whether or not the
// email exists, so this endpoint can't be used to enumerate accounts.
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (user) {
      const otp = generateOtp();
      user.otpHash = hashOtp(otp);
      user.otpPurpose = 'reset';
      user.otpExpires = getExpiry();
      user.otpAttempts = 0;
      await user.save({ validateBeforeSave: false });
      await sendOtpEmail(user.email, otp, 'reset');
    }

    res.json({ message: 'If an account exists for that email, a reset code has been sent.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/auth/reset-password  { email, otp, newPassword }
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, code and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email }).select('+otpHash +otpPurpose +otpExpires +otpAttempts');
    if (!user || !user.otpHash || user.otpPurpose !== 'reset') {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'This code has expired. Please request a new one.' });
    }
    if (user.otpAttempts >= MAX_ATTEMPTS) {
      return res.status(429).json({ message: 'Too many attempts. Please request a new code.' });
    }
    if (user.otpHash !== hashOtp(otp)) {
      user.otpAttempts += 1;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({ message: 'Incorrect code' });
    }

    user.password = newPassword; // pre-save hook will hash it
    user.otpHash = undefined;
    user.otpPurpose = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- Passwordless OTP login ----------

// @route POST /api/auth/request-login-otp  { email }
exports.requestLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (user) {
      const otp = generateOtp();
      user.otpHash = hashOtp(otp);
      user.otpPurpose = 'login';
      user.otpExpires = getExpiry();
      user.otpAttempts = 0;
      await user.save({ validateBeforeSave: false });
      await sendOtpEmail(user.email, otp, 'login');
    }

    res.json({ message: 'If an account exists for that email, a login code has been sent.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/auth/login-otp  { email, otp }
exports.loginWithOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and code are required' });

    const user = await User.findOne({ email }).select('+otpHash +otpPurpose +otpExpires +otpAttempts');
    if (!user || !user.otpHash || user.otpPurpose !== 'login') {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'This code has expired. Please request a new one.' });
    }
    if (user.otpAttempts >= MAX_ATTEMPTS) {
      return res.status(429).json({ message: 'Too many attempts. Please request a new code.' });
    }
    if (user.otpHash !== hashOtp(otp)) {
      user.otpAttempts += 1;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({ message: 'Incorrect code' });
    }

    user.otpHash = undefined;
    user.otpPurpose = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
