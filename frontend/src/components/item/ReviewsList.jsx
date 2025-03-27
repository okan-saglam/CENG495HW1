import React from 'react';
import Rating from '../common/Rating';
import './ReviewsList.css';

const ReviewsList = ({ reviews }) => {
  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString || dateString === "Invalid Date") {
      return "Unknown Date";
    }
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Unknown Date";
      }
      
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    } catch (e) {
      console.error("Date formatting error:", e);
      return "Unknown Date";
    }
  };

  // Get initials from username for avatar
  const getInitials = (username) => {
    return username
      ? username.charAt(0).toUpperCase()
      : '?';
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="reviews-list">
        <div className="no-reviews">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-list">
      {reviews.map((review) => (
        <div key={review._id} className="review-item">
          <div className="review-header">
            <div className="review-user">
              <div className="review-avatar">
                {getInitials(review.user?.username)}
              </div>
              <div>
                <div className="review-username">
                  {review.user?.username || 'Anonymous'}
                </div>
                <div className="review-date">
                  {review.updatedAt 
                    ? `Updated on ${formatDate(review.updatedAt)}` 
                    : formatDate(review.createdAt)}
                </div>
              </div>
            </div>
            <div className="review-rating">
              <Rating value={review.rating} />
            </div>
          </div>
          
          <div className="review-content">
            {review.comment || 'No comment provided.'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;