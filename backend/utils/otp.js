const crypto = require('crypto');

const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

// Generates a random numeric OTP, e.g. "483920"
function generateOtp() {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return String(crypto.randomInt(min, max));
}

// One-way hash so the plain OTP is never stored in the database
function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

function getExpiry() {
  return new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
}

module.exports = { generateOtp, hashOtp, getExpiry, OTP_TTL_MINUTES, MAX_ATTEMPTS };
