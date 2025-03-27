import React, { useState, useEffect } from 'react';
import { getItems, getItemsByCategory } from '../services/itemService';
import Banner from '../components/home/Banner';
import CategoryFilter from '../components/home/CategoryFilter';
import ItemCard from '../components/home/ItemCard';
import Loader from '../components/common/Loader';
import './HomePage.css';

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'GPS Sport Watch', name: 'GPS Sport Watches' },
    { id: 'Antique Furniture', name: 'Antique Furniture' },
    { id: 'Running Shoes', name: 'Running Shoes' },
    { id: 'Vinyls', name: 'Vinyl Records' }
  ];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let data;
        if (activeCategory === 'all') {
          data = await getItems();
        } else {
          data = await getItemsByCategory(activeCategory);
        }
        
        setItems(data);
      } catch (err) {
        setError('Failed to fetch items. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [activeCategory]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="home-page">
      <Banner />
      
      <div className="content-container">
        <h1 className="page-title">Explore Our Collection</h1>
        
        <CategoryFilter 
          categories={categories} 
          activeCategory={activeCategory} 
          onCategoryChange={handleCategoryChange} 
        />
        
        {error && <div className="error-message">{error}</div>}
        
        {isLoading ? (
          <Loader />
        ) : (
          <div className="items-grid">
            {items.length === 0 ? (
              <p className="no-items">No items found in this category.</p>
            ) : (
              items.map(item => (
                <ItemCard key={item._id} item={item} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;