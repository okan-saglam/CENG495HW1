import React, { useState, useEffect, useContext } from 'react';
import { getUserReviewForItem, addOrUpdateReview } from '../../services/reviewService';
import { AuthContext } from '../../context/AuthContext';
import './ReviewForm.css';

const ReviewForm = ({ itemId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { updateUserData } = useContext(AuthContext); // AuthContext'ten updateUserData fonksiyonunu al

  useEffect(() => {
    // Check if user already has a review for this item
    const fetchExistingReview = async () => {
      try {
        const existingReview = await getUserReviewForItem(itemId);
        
        if (existingReview) {
          setRating(existingReview.rating);
          setComment(existingReview.comment || '');
          setIsEditing(true);
        }
      } catch (err) {
        // No existing review, or error fetching
        console.log('No existing review found');
      }
    };

    fetchExistingReview();
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating < 1 || rating > 10) {
      setError('Rating must be between 1 and 10');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await addOrUpdateReview({
        itemId,
        rating,
        comment
      });

      if (onReviewAdded && response.review) {
        // Ensure the review object structure is complete
        const reviewData = response.review;
        
        // Pass the complete review object to parent component
        onReviewAdded(reviewData);
      }
      
      // Kullanıcı verilerini güncelle - average rating değişti
      await updateUserData();
      
      setIsSubmitting(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Generate stars for rating selection
  const renderRatingStars = () => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <button
          type="button"
          key={i}
          className={`star-btn ${i <= rating ? 'active' : ''}`}
          onClick={() => setRating(i)}
        >
          {i <= rating ? <i className="fas fa-star"></i> : <i className="far fa-star"></i>}
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="review-form">
      <h4>{isEditing ? 'Update your review' : 'Write a review'}</h4>
      
      {error && <div className="auth-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rating">Rating (1-10)</label>
          <div className="rating-input">
            <input
              type="number"
              id="rating"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value) || 0)}
            />
            <div className="rating-stars">
              {renderRatingStars()}
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="comment">Your Review</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            rows="4"
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting || rating < 1}
        >
          {isSubmitting 
            ? 'Submitting...' 
            : isEditing 
              ? 'Update Review' 
              : 'Submit Review'
          }
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;