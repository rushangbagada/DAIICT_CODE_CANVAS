import React from 'react';
import './LoadingButton.css';

const LoadingButton = ({ 
  onClick, 
  loading = false, 
  disabled = false, 
  children, 
  className = '',
  variant = 'primary',
  ...props 
}) => {
  const handleClick = (e) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`loading-btn loading-btn--${variant} ${className} ${loading ? 'loading-btn--loading' : ''}`}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="loading-btn__spinner">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="loading-btn__spinner-icon"
          >
            <path
              d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
      <span className={`loading-btn__text ${loading ? 'loading-btn__text--loading' : ''}`}>
        {loading ? 'Sending Email...' : children}
      </span>
    </button>
  );
};

export default LoadingButton;
