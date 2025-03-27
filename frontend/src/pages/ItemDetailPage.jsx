import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById } from '../services/itemService';
import { getReviewsByItem } from '../services/reviewService';
import { AuthContext } from '../context/AuthContext';
import ReviewForm from '../components/item/ReviewForm';
import ReviewsList from '../components/item/ReviewsList';
import Rating from '../components/common/Rating';
import Loader from '../components/common/Loader';
import './ItemDetailPage.css';

const ItemDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemAndReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const itemData = await getItemById(id);
        setItem(itemData);
        
        const reviewsData = await getReviewsByItem(id);
        setReviews(reviewsData);
      } catch (err) {
        setError('Failed to load item details. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemAndReviews();
  }, [id]);

  const handleReviewAdded = (newReview) => {
    // Update reviews list after a new review is added or updated
    setReviews(prevReviews => {
      // Check if this is an update to an existing review
      const existingIndex = prevReviews.findIndex(r => 
        r.user && newReview.user && r.user._id === newReview.user._id
      );
      
      if (existingIndex >= 0) {
        // Update existing review
        const updatedReviews = [...prevReviews];
        updatedReviews[existingIndex] = newReview;
        return updatedReviews;
      } else {
        // Add new review
        return [...prevReviews, newReview];
      }
    });
    
    // Update the item's rating based on the new average
    setItem(prev => {
      // Calculate new average rating including the new review
      const updatedReviews = [...reviews];
      const existingIndex = updatedReviews.findIndex(r => 
        r.user && newReview.user && r.user._id === newReview.user._id
      );
      
      if (existingIndex >= 0) {
        updatedReviews[existingIndex] = newReview;
      } else {
        updatedReviews.push(newReview);
      }
      
      // Calculate new average
      const newAverage = updatedReviews.length > 0 
        ? updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length 
        : 0;
      
      return {
        ...prev,
        rating: newAverage
      };
    });
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="error-container">{error}</div>;
  if (!item) return <div className="error-container">Item not found</div>;

  return (
    <div className="item-detail-page">
      <div className="item-content-container">
        <div className="item-detail-grid">
          <div className="item-image-container">
            <img 
              src={item.image || 'https://via.placeholder.com/400x400?text=No+Image'} 
              alt={item.name} 
              className="item-detail-image" 
            />
          </div>
          
          <div className="item-info">
            <h1 className="item-name">{item.name}</h1>
            
            <div className="item-rating">
              <Rating value={item.rating} />
              <span className="rating-count">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            
            <div className="item-price">${item.price.toFixed(2)}</div>
            
            <div className="item-seller">Seller: {item.seller}</div>
            
            <div className="item-category">Category: {item.category}</div>
            
            {/* Display category-specific attributes */}
            {item.category === 'GPS Sport Watch' && (
              <div className="item-attribute">Battery Life: {item.batteryLife} hours</div>
            )}
            
            {item.category === 'Antique Furniture' && (
              <>
                <div className="item-attribute">Age: {item.age} years</div>
                <div className="item-attribute">Material: {item.material}</div>
              </>
            )}
            
            {item.category === 'Running Shoes' && (
              <>
                <div className="item-attribute">Size: {item.size}</div>
                <div className="item-attribute">Material: {item.material}</div>
              </>
            )}
            
            {item.category === 'Vinyls' && (
              <div className="item-attribute">Age: {item.age} years</div>
            )}
            
            <p className="item-description">{item.descripton || 'No description available.'}</p>
            
            {!isAuthenticated && (
              <div className="login-prompt">
                <p>Please <button onClick={() => navigate('/login')} className="login-link">sign in</button> to leave a review</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="item-review-section">
          <h2 className="reviews-title">Customer Reviews</h2>
          
          {isAuthenticated && (
            <ReviewForm itemId={id} onReviewAdded={handleReviewAdded} />
          )}
          
          <ReviewsList reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;