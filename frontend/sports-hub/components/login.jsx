import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../src/AuthContext';
import './css/login.css';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onLoginSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      
      if (!res.ok) {
        toast.error(result.message || 'Login failed');
      } else {
        toast.success('OTP sent to your email! Please verify to complete login.');
        navigate(`/verify-otp?type=login&email=${data.email}`);
      }
    } catch (err) {
      toast.error('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast.error('Please enter your email');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const result = await res.json();
      
      if (!res.ok) {
        toast.error(result.message);
      } else {
        toast.success('Reset token sent to your email!');
        navigate(`/verify-otp?type=reset&email=${forgotEmail}`);
      }
    } catch (err) {
      toast.error('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotEmail('');
  };

  if (showForgotPassword) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-icon">🔐</div>
          <h2>Reset Password</h2>
          
          <div className="forgot-password-form">
            <p>Enter your email to receive a reset token</p>
            <div className="form-group">
              <label htmlFor="forgotEmail">Email</label>
              <input
                type="email"
                id="forgotEmail"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <button 
              onClick={handleForgotPassword} 
              className="login-btn" 
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Token'}
            </button>
          </div>

          <div className="login-link">
            <button onClick={resetForgotPassword} className="back-btn">
              Back to Login
            </button>
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">🔑</div>
        <h2>Login to Campus Sports Hub</h2>
        <form onSubmit={handleSubmit(onLoginSubmit)} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="login-links">
          <div className="login-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>
          <div className="login-link">
            <button 
              onClick={() => setShowForgotPassword(true)} 
              className="forgot-password-btn"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
} 