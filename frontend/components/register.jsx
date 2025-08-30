import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import './css/register.css';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const password = watch('password');

  const onRegisterSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          password: data.password,
          mobile: data.mobile,
          year: data.year,
          department: data.department
        })
      });
      const result = await res.json();
      
      if (!res.ok) {
        toast.error(result.message || 'Registration failed');
      } else {
        toast.success('Registration successful! Please check your email for OTP to complete login.');
        navigate(`/verify-otp?type=login&email=${data.email}`);
      }
    } catch (err) {
      toast.error('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="register-container">
      {/* Header Section */}
      <header className="header-section">
        <div className="header-icon">👤</div>
        <h1>Join Campus Sports Hub</h1>
        <p>Start your athletic journey with us today</p>
      </header>

      {/* Main Form */}
      <main className="form-container">
        <div className="form-icon">👤</div>
        <h2>Personal Information</h2>
        <p className="form-subtitle">Tell us about yourself</p>
        
        <form onSubmit={handleSubmit(onRegisterSubmit)} className="register-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              {...register('fullName', { 
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
              placeholder="Enter your full name"
            />
            {errors.fullName && <span className="error-text">{errors.fullName.message}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
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
              placeholder="your.email@college.edu"
            />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password *</label>
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="mobile">Phone Number *</label>
            <input
              type="tel"
              id="mobile"
              {...register('mobile', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Please enter a valid 10-digit phone number'
                }
              })}
              placeholder="Enter 10 digit number"
            />
            {errors.mobile && <span className="error-text">{errors.mobile.message}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="year">Academic Year *</label>
            <select 
              id="year" 
              {...register('year', { required: 'Please select your year' })}
            >
              <option value="">Select your year</option>
              <option value="1st">First Year</option>
              <option value="2nd">Second Year</option>
              <option value="3rd">Third Year</option>
              <option value="4th">Final Year</option>
            </select>
            {errors.year && <span className="error-text">{errors.year.message}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="department">Department/Major *</label>
            <select 
              id="department" 
              {...register('department', { required: 'Please select your department' })}
            >
              <option value="">Select your department</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Chemical Engineering">Chemical Engineering</option>
              <option value="Biomedical Engineering">Biomedical Engineering</option>
              <option value="Environmental Engineering">Environmental Engineering</option>
              <option value="Management Studies">Management Studies</option>
              <option value="Other">Other</option>
            </select>
            {errors.department && <span className="error-text">{errors.department.message}</span>}
          </div>

          <div className="social-login">
            <button type="button" className="google-btn">
              <img
                src="https://img.icons8.com/color/16/000000/google-logo.png"
                alt="Google"
              />
              Continue with Google
            </button>
            <button type="button" className="facebook-btn">
              <img
                src="https://img.icons8.com/color/16/000000/facebook-new.png"
                alt="Facebook"
              />
              Continue with Facebook
            </button>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <div className="login-link">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </form>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
