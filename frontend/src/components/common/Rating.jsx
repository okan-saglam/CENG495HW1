import React from 'react';
import './Rating.css';

const Rating = ({ value, total = 10 }) => {
  // Convert rating to a 5-star scale for display
  const scaledValue = (value / total) * 5;
  
  // Create array of 5 stars
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    
    // Full star
    if (starValue <= scaledValue) {
      return <i key={index} className="fas fa-star star" />;
    }
    // Half star
    else if (starValue - 0.5 <= scaledValue) {
      return <i key={index} className="fas fa-star-half-alt star" />;
    }
    // Empty star
    else {
      return <i key={index} className="far fa-star star star-empty" />;
    }
  });

  return (
    <div className="rating">
      <div className="stars">{stars}</div>
      {value > 0 && (
        <span className="rating-value">{value.toFixed(1)}/{total}</span>
      )}
    </div>
  );
};

export default Rating;