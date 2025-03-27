import React from 'react';
import { Link } from 'react-router-dom';
import Rating from '../common/Rating';
import './UserReviews.css';

const UserReviews = ({ reviews }) => {
  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="no-user-reviews">
        <p>You haven't reviewed any products yet.</p>
      </div>
    );
  }

  return (
    <div className="user-reviews">
      {reviews.map((review) => (
        <div key={review._id} className="user-review-item">
          <img 
            src={review.item?.image || 'https://via.placeholder.com/80x80?text=No+Image'} 
            alt={review.item?.name} 
            className="review-item-image" 
          />
          
          <div className="review-item-content">
            <Link to={`/item/${review.item?._id}`} className="review-item-name">
              {review.item?.name || 'Unknown Product'}
            </Link>
            
            <div className="review-item-price">
              ${review.item?.price?.toFixed(2) || '0.00'}
            </div>
            
            <div className="review-item-rating">
              <Rating value={review.rating} />
            </div>
            
            <div className="review-item-date">
              {review.updatedAt 
                ? `Updated on ${formatDate(review.updatedAt)}` 
                : formatDate(review.createdAt)}
            </div>
            
            <div className="review-item-comment">
              {review.comment || 'No comment provided.'}
            </div>
            
            <div className="review-item-actions">
              <Link to={`/item/${review.item?._id}`} className="review-item-action">
                Edit review
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserReviews;