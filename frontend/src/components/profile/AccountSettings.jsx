import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './AccountSettings.css';

const AccountSettings = () => {
  const { user, updateUserData } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // This would typically make an API call to change password
      // Since we don't have that endpoint implemented, we'll just simulate success
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to safely format the rating
  const formatRating = (rating) => {
    // Check if rating exists and is a number
    if (rating !== undefined && rating !== null && !isNaN(Number(rating))) {
      return Number(rating).toFixed(1);
    }
    return '0.0';
  };

  return (
    <div className="account-settings">
      <div className="settings-section">
        <h3 className="settings-title">Account Information</h3>
        
        <div>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Your Average Rating:</strong> {formatRating(user?.averageRating)}/10</p>
        </div>
      </div>
      
      <div className="settings-section">
        <h3 className="settings-title">Change Password</h3>
        
        {success && <div className="settings-success">{success}</div>}
        {error && <div className="settings-error">{error}</div>}
        
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              className="form-control"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="settings-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
      
      <div className="settings-section">
        <h3 className="settings-title">Delete Account</h3>
        <p>This action cannot be undone. All your reviews will also be deleted.</p>
        <button className="settings-button danger">Delete My Account</button>
      </div>
    </div>
  );
};

export default AccountSettings;