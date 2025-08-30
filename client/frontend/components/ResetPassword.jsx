import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import './css/reset-password.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const password = watch('password');

  const handleResetPassword = async (data) => {
    if (!email || !token) {
      toast.error('Invalid reset link. Please request a new password reset.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          resetToken: token,
          newPassword: data.password
        })
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || 'Password reset failed');
      } else {
        toast.success('Password reset successful! You can now login with your new password.');
        setTimeout(() => navigate('/login'), 2000);
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

  if (!email || !token) {
    return (
      <div className="reset-container">
        <div className="reset-card">
          <div className="reset-icon">⚠️</div>
          <h2>Invalid Reset Link</h2>
          <p>The password reset link is invalid or has expired.</p>
          <button onClick={handleBackToLogin} className="reset-btn">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-container">
      <div className="reset-card">
        <div className="reset-icon">🔐</div>
        <h2>Reset Your Password</h2>
        <p className="reset-description">
          Enter your new password below. Make sure it's secure and easy to remember.
        </p>
        
        <div className="email-display">
          <strong>{email}</strong>
        </div>

        <form onSubmit={handleSubmit(handleResetPassword)} className="reset-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                }
              })}
              placeholder="Enter new password"
              className="reset-input"
            />
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              placeholder="Confirm new password"
              className="reset-input"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
          </div>

          <div className="password-requirements">
            <h4>Password Requirements:</h4>
            <ul>
              <li>At least 6 characters long</li>
              <li>Contains at least one uppercase letter</li>
              <li>Contains at least one lowercase letter</li>
              <li>Contains at least one number</li>
            </ul>
          </div>

          <button 
            type="submit" 
            className="reset-btn" 
            disabled={loading}
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="back-section">
          <button onClick={handleBackToLogin} className="back-btn">
            Back to Login
          </button>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
} 