import React, { useState, useEffect } from 'react';
import { getItems } from '../../services/itemService';
import { addItem, removeItem } from '../../services/adminService';
import Loader from '../common/Loader';
import './AdminItems.css';

const AdminItems = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    seller: '',
    category: '',
    descripton: '',
    image: '',
    batteryLife: '',
    age: '',
    material: '',
    size: ''
  });

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getItems();
      setItems(data);
    } catch (err) {
      setError('Failed to fetch items. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      
      // Format the data based on the category
      const itemData = {
        name: newItem.name,
        price: parseFloat(newItem.price),
        seller: newItem.seller,
        category: newItem.category,
        descripton: newItem.descripton,
        image: newItem.image
      };

      // Add category-specific fields
      switch(newItem.category) {
        case 'GPS Sport Watch':
          itemData.batteryLife = parseInt(newItem.batteryLife);
          break;
        case 'Antique Furniture':
          itemData.age = parseInt(newItem.age);
          itemData.material = newItem.material;
          break;
        case 'Running Shoes':
          itemData.size = parseFloat(newItem.size);
          itemData.material = newItem.material;
          break;
        case 'Vinyls':
          itemData.age = parseInt(newItem.age);
          break;
        default:
          break;
      }
      
      await addItem(itemData);
      
      // Reset form and fetch updated items
      setNewItem({
        name: '',
        price: '',
        seller: '',
        category: '',
        descripton: '',
        image: '',
        batteryLife: '',
        age: '',
        material: '',
        size: ''
      });
      setShowAddForm(false);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item.');
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item? This will also delete all reviews for this item.')) {
      try {
        setError(null);
        await removeItem(itemId);
        // Refresh items list
        fetchItems();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete item.');
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return <Loader text="Loading items..." />;
  }

  return (
    <div className="admin-items">
      <div className="admin-section-header">
        <h2>Products Management</h2>
        <button 
          className="admin-action-button"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {showAddForm && (
        <div className="admin-form-container">
          <form onSubmit={handleAddItem} className="admin-form">
            <h3>Add New Product</h3>
            
            <div className="form-group">
              <label htmlFor="name">Product Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Price*</label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                value={newItem.price}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="seller">Seller*</label>
              <input
                type="text"
                id="seller"
                name="seller"
                value={newItem.seller}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category*</label>
              <select
                id="category"
                name="category"
                value={newItem.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                <option value="GPS Sport Watch">GPS Sport Watch</option>
                <option value="Antique Furniture">Antique Furniture</option>
                <option value="Running Shoes">Running Shoes</option>
                <option value="Vinyls">Vinyls</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="text"
                id="image"
                name="image"
                value={newItem.image}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="descripton">Description</label>
              <textarea
                id="descripton"
                name="descripton"
                value={newItem.descripton}
                onChange={handleInputChange}
                rows="3"
              ></textarea>
            </div>
            
            {/* Category-specific fields */}
            {newItem.category === 'GPS Sport Watch' && (
              <div className="form-group">
                <label htmlFor="batteryLife">Battery Life (hours)*</label>
                <input
                  type="number"
                  id="batteryLife"
                  name="batteryLife"
                  value={newItem.batteryLife}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            
            {(newItem.category === 'Antique Furniture' || newItem.category === 'Vinyls') && (
              <div className="form-group">
                <label htmlFor="age">Age (years)*</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={newItem.age}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            
            {(newItem.category === 'Antique Furniture' || newItem.category === 'Running Shoes') && (
              <div className="form-group">
                <label htmlFor="material">Material*</label>
                <input
                  type="text"
                  id="material"
                  name="material"
                  value={newItem.material}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            
            {newItem.category === 'Running Shoes' && (
              <div className="form-group">
                <label htmlFor="size">Size*</label>
                <input
                  type="number"
                  id="size"
                  name="size"
                  step="0.5"
                  value={newItem.size}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            
            <div className="form-actions">
              <button type="submit" className="admin-submit-button">Add Product</button>
              <button 
                type="button" 
                className="admin-cancel-button"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-items-list">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Seller</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="7" className="admin-no-items">No products available.</td>
              </tr>
            ) : (
              items.map(item => (
                <tr key={item._id}>
                  <td>
                    <div className="admin-item-image">
                      <img src={item.image || 'https://via.placeholder.com/50x50?text=No+Image'} alt={item.name} />
                    </div>
                  </td>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.category}</td>
                  <td>{item.seller}</td>
                  <td>{item.rating.toFixed(1)}</td>
                  <td>
                    <button 
                      className="admin-delete-button"
                      onClick={() => handleDeleteItem(item._id)}
                      title="Delete product"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminItems;