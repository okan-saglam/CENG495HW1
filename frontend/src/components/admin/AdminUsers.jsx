import React, { useState, useEffect, useContext } from 'react';
import { getAllUsers, createUser, removeUser } from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../common/Loader';
import './AdminUsers.css';

const AdminUsers = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'user'
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      await createUser(newUser);
      
      // Reset form and fetch updated users
      setNewUser({
        username: '',
        password: '',
        role: 'user'
      });
      setShowAddForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user.');
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    // Prevent admin from deleting themselves
    if (currentUser.id === userId) {
      setError("You cannot delete your own account.");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete user "${username}"? This will also delete all their reviews.`)) {
      try {
        setError(null);
        await removeUser(userId);
        // Refresh users list
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user.');
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return <Loader text="Loading users..." />;
  }

  return (
    <div className="admin-users">
      <div className="admin-section-header">
        <h2>Users Management</h2>
        <button 
          className="admin-action-button"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {showAddForm && (
        <div className="admin-form-container">
          <form onSubmit={handleAddUser} className="admin-form">
            <h3>Add New User</h3>
            
            <div className="form-group">
              <label htmlFor="username">Username*</label>
              <input
                type="text"
                id="username"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password*</label>
              <input
                type="password"
                id="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Role*</label>
              <select
                id="role"
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="admin-submit-button">Add User</button>
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

      <div className="admin-users-list">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Average Rating</th>
              <th>Reviews</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="admin-no-items">No users available.</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id} className={currentUser.id === user._id ? 'current-user' : ''}>
                  <td>{user.username} {currentUser.id === user._id && <span className="current-user-badge">(You)</span>}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.averageRating ? user.averageRating.toFixed(1) : '0.0'}/10</td>
                  <td>{user.reviews ? user.reviews.length : 0}</td>
                  <td>
                    <button 
                      className="admin-delete-button"
                      onClick={() => handleDeleteUser(user._id, user.username)}
                      disabled={currentUser.id === user._id}
                      title={currentUser.id === user._id ? "You cannot delete your own account" : "Delete user"}
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

export default AdminUsers;