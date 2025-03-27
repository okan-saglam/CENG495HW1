import React from 'react';
import './Loader.css';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default Loader;