import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-error">404</div>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="back-home-button">
            Back to Home
          </Link>
        </div>
      </div>
      <div className="not-found-illustration">
        <svg 
          width="300" 
          height="300" 
          viewBox="0 0 600 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="300" cy="300" r="250" stroke="#E9ECEF" strokeWidth="20" />
          <path 
            d="M300 150C300 133.431 313.431 120 330 120C346.569 120 360 133.431 360 150C360 166.569 346.569 180 330 180C313.431 180 300 166.569 300 150Z" 
            fill="#4A6DE5" 
          />
          <path 
            d="M260 450H340M260 380L340 380M150 275C150 254.624 166.624 238 187 238H413C433.376 238 450 254.624 450 275V430C450 450.376 433.376 467 413 467H187C166.624 467 150 450.376 150 430V275Z" 
            stroke="#4A6DE5" 
            strokeWidth="20" 
            strokeLinecap="round" 
          />
        </svg>
      </div>
    </div>
  );
};

export default NotFoundPage;