import React, { useState } from 'react';
import AdminUsers from '../components/admin/AdminUsers';
import AdminItems from '../components/admin/AdminItems';
import './AdminPage.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('items');
  
  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <div className="admin-tabs">
            <button 
              className={`tab-button ${activeTab === 'items' ? 'active' : ''}`}
              onClick={() => setActiveTab('items')}
            >
              Manage Products
            </button>
            <button 
              className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Manage Users
            </button>
          </div>
        </div>
        
        <div className="admin-content">
          {activeTab === 'items' && <AdminItems />}
          {activeTab === 'users' && <AdminUsers />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;