import React from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="category-filter">
      <div className="filter-title">Categories</div>
      <div className="filter-buttons">
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-button ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;