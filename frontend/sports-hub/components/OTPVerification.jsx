import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../src/AuthContext';
import './css/otp-verification.css';

export default function OTPVerification() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const type = searchParams.get('type'); // 'register' or 'reset'
  const email = searchParams.get('email');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const otp = watch('otp');

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOTPVerification = async (data) => {
    if (!data.otp || data.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      let successMessage = '';
      let redirectPath = '';

      if (type === 'login') {
        endpoint = '/api/auth/verify-otp';
        successMessage = 'Login successful! Redirecting...';
        redirectPath = '/';
      } else if (type === 'reset') {
        endpoint = '/api/auth/verify-reset-token';
        successMessage = 'Token verified! You can now reset your password.';
        redirectPath = `/reset-password?email=${email}&token=${data.otp}`;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          otp: data.otp
        })
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || 'Verification failed');
      } else {
        if (type === 'login') {
          // Store token and user data for login
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          // Update auth context
          login(result.user, result.token);
        }
        toast.success(successMessage);
        setTimeout(() => navigate(redirectPath), 2000);
      }
    } catch (err) {
      toast.error('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      let endpoint = '';
      let body = {};

      if (type === 'login') {
        endpoint = '/api/auth/resend-otp';
        body = { email };
      } else if (type === 'reset') {
        endpoint = '/api/auth/forgot-password';
        body = { email };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || 'Failed to resend OTP');
      } else {
        toast.success('New OTP sent to your email!');
        setTimeLeft(600); // Reset timer to 10 minutes
        setCanResend(false);
      }
    } catch (err) {
      toast.error('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleBackToRegister = () => {
    navigate('/register');
  };

  if (!email || !type) {
    return (
      <div className="otp-container">
        <div className="otp-card">
          <div className="otp-icon">⚠️</div>
          <h2>Invalid Verification Link</h2>
          <p>The verification link is invalid or has expired.</p>
          <button onClick={handleBackToLogin} className="otp-btn">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="otp-container">
      <div className="otp-card">
        <div className="otp-icon">
          {type === 'login' ? '🔑' : '🔐'}
        </div>
        
        <h2>
          {type === 'login' ? 'Login Verification' : 'Password Reset Verification'}
        </h2>
        
        <p className="otp-description">
          {type === 'login' 
            ? 'We\'ve sent a 6-digit verification code to your email address.'
            : 'We\'ve sent a 6-digit reset code to your email address.'
          }
        </p>
        
        <div className="email-display">
          <strong>{email}</strong>
        </div>

        <form onSubmit={handleSubmit(handleOTPVerification)} className="otp-form">
          <div className="form-group">
            <label htmlFor="otp">Enter Verification Code</label>
            <input
              type="text"
              id="otp"
              {...register('otp', {
                required: 'Verification code is required',
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: 'Please enter a valid 6-digit code'
                }
              })}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="otp-input"
            />
            {errors.otp && <span className="error-text">{errors.otp.message}</span>}
          </div>

          <button 
            type="submit" 
            className="otp-btn verify-btn" 
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        <div className="timer-section">
          {timeLeft > 0 ? (
            <p className="timer">
              Code expires in: <span className="timer-countdown">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <p className="timer expired">Code has expired</p>
          )}
        </div>

        <div className="resend-section">
          <p>Didn't receive the code?</p>
          <button 
            onClick={handleResendOTP} 
            className="resend-btn"
            disabled={!canResend || loading}
          >
            {canResend ? 'Resend Code' : 'Resend Code'}
          </button>
        </div>

        <div className="back-section">
          <button onClick={handleBackToLogin} className="back-btn">
            Back to Login
          </button>
          {type === 'login' && (
            <button onClick={handleBackToLogin} className="back-btn">
              Back to Login
            </button>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
} 