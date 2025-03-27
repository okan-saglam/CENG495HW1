import React from 'react';
import { Link } from 'react-router-dom';
import './Banner.css';

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner-content">
        <h1 className="banner-title">Discover Quality Products</h1>
        <p className="banner-subtitle">
          From vintage vinyl records to high-performance sport watches, find exactly what you're looking for.
        </p>
        <Link to="/login" className="banner-button">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Banner;