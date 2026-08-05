const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['seeker', 'employer'], default: 'seeker' },
    company: { type: String, trim: true }, // used for employers
    headline: { type: String, trim: true }, // used for seekers
    skills: [{ type: String, trim: true }],
    resumeUrl: { type: String },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],

    // OTP fields — used for both "forgot password" reset and passwordless OTP login.
    // Only the hash is stored, never the plain OTP.
    otpHash: { type: String, select: false },
    otpPurpose: { type: String, enum: ['reset', 'login'], select: false },
    otpExpires: { type: Date, select: false },
    otpAttempts: { type: Number, default: 0, select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
