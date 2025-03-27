import React from 'react';
import { Link } from 'react-router-dom';
import Rating from '../common/Rating';
import './ItemCard.css';

const ItemCard = ({ item }) => {
  return (
    <div className="item-card">
      <div className="item-card-image-container">
        <div className="item-card-category-badge">{item.category}</div>
        <img 
          src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
          alt={item.name} 
          className="item-card-image" 
        />
      </div>
      
      <div className="item-card-content">
        <h2 className="item-card-title">{item.name}</h2>
        
        <div className="item-card-rating">
          <Rating value={item.rating} />
          <span className="count">
            ({item.reviews ? item.reviews.length : 0})
          </span>
        </div>
        
        <div className="item-card-seller">Seller: {item.seller}</div>
        <div className="item-card-price">${item.price.toFixed(2)}</div>
        
        <Link to={`/item/${item._id}`} className="view-button">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;