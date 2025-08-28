import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelopeOpenText, FaCheckCircle, FaExclamationCircle, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/forgot-password-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send code');
      setSuccess('Verification code sent! Please check your email.');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/forgot-password-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid code');
      setSuccess('Code verified! You can now set a new password.');
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/forgot-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      setSuccess('Password reset successful! You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <section className="hero" style={{
        background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/cage22.png') center/cover no-repeat"
      }}>
        <h1>FORGOT PASSWORD</h1>
        <p>Enter your email to recover your account.</p>
      </section>
      <main className="login-main">
        <section className="login-section">
          {step === 1 && (
            <form className="login-form" onSubmit={handleRequestCode}>
              <h2>Forgot Password</h2>
              <input type="email" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)} />
              {error && <div style={{ color: 'red', marginBottom: 8 }}><FaExclamationCircle /> {error}</div>}
              {success && <div style={{ color: 'green', marginBottom: 8 }}><FaCheckCircle /> {success}</div>}
              <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Code'}</button>
            </form>
          )}
          {step === 2 && (
            <form className="login-form" onSubmit={handleVerifyCode}>
              <h2>Enter Verification Code</h2>
              <input type="text" placeholder="Enter code from email" required value={code} onChange={e => setCode(e.target.value)} />
              {error && <div style={{ color: 'red', marginBottom: 8 }}><FaExclamationCircle /> {error}</div>}
              {success && <div style={{ color: 'green', marginBottom: 8 }}><FaCheckCircle /> {success}</div>}
              <button type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify Code'}</button>
            </form>
          )}
          {step === 3 && (
            <form className="login-form" onSubmit={handleResetPassword}>
              <h2>Set New Password</h2>
              <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box', marginBottom: 12 }}>
                <FaLock style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#1ee43b' }} />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  style={{ width: '100%', paddingLeft: 36, paddingRight: 36, boxSizing: 'border-box' }}
                />
                <span
                  onClick={() => setShowNewPassword(v => !v)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888', fontSize: 18 }}
                  title={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <FaEyeSlash color="#181818" /> : <FaEye color="#181818" />}
                </span>
              </div>
              <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box', marginBottom: 12 }}>
                <FaLock style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#1ee43b' }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', paddingLeft: 36, paddingRight: 36, boxSizing: 'border-box' }}
                />
                <span
                  onClick={() => setShowConfirmPassword(v => !v)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888', fontSize: 18 }}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FaEyeSlash color="#181818" /> : <FaEye color="#181818" />}
                </span>
              </div>
              {error && <div style={{ color: 'red', marginBottom: 8 }}><FaExclamationCircle /> {error}</div>}
              {success && <div style={{ color: 'green', marginBottom: 8 }}><FaCheckCircle /> {success}</div>}
              <button type="submit" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};

export default ForgotPassword; 