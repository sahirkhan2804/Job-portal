const nodemailer = require('nodemailer');

const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

let transporter = null;
if (smtpConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Sends an OTP email. If SMTP isn't configured (e.g. local dev without
// mail credentials set up yet), the OTP is logged to the console instead
// so the flow still works end-to-end during development.
async function sendOtpEmail(to, otp, purpose) {
  const subject = purpose === 'login' ? 'Your JobPortal login code' : 'Reset your JobPortal password';
  const text = `Your one-time code is: ${otp}\n\nThis code expires in 10 minutes. If you didn't request this, you can safely ignore this email.`;

  if (!transporter) {
    console.log(`\n[DEV EMAIL FALLBACK] To: ${to} | Subject: ${subject}\nOTP: ${otp}\n`);
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html: `<p>Your one-time code is:</p><h2 style="letter-spacing:4px">${otp}</h2><p>This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>`,
  });
}

module.exports = { sendOtpEmail };
