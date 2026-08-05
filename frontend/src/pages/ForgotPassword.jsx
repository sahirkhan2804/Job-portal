import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('request'); // 'request' | 'reset'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const message = await forgotPassword(email);
      setInfo(message);
      setStep('reset');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await resetPassword(email, otp, newPassword);
      navigate('/login', { state: { justReset: true, email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {step === 'request' ? (
        <form className="card auth-form" onSubmit={handleRequestCode}>
          <h2>Forgot Password</h2>
          <p className="section-subtitle">Enter your email and we'll send you a 6-digit code to reset your password.</p>
          {error && <p className="error">{error}</p>}

          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Reset Code'}
          </button>
          <p><Link to="/login">Back to login</Link></p>
        </form>
      ) : (
        <form className="card auth-form" onSubmit={handleReset}>
          <h2>Enter Reset Code</h2>
          {info && <p className="success">{info}</p>}
          {error && <p className="error">{error}</p>}

          <label>6-Digit Code</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            inputMode="numeric"
            placeholder="000000"
            required
          />

          <label>New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} required />

          <label>Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={6} required />

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Resetting...' : 'Reset Password'}
          </button>
          <p>
            Didn't get a code?{' '}
            <button type="button" className="link-btn" onClick={() => setStep('request')}>Try again</button>
          </p>
        </form>
      )}
    </div>
  );
}
