import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getUserReviews } from '../services/reviewService';
import { AuthContext } from '../context/AuthContext';
import UserReviews from '../components/profile/UserReviews';
import AccountSettings from '../components/profile/AccountSettings';
import Loader from '../components/common/Loader';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { username } = useParams();
  
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwnProfile = !username || (user && user.username === username);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const reviewsData = await getUserReviews();
        setReviews(reviewsData);
      } catch (err) {
        setError('Failed to load profile data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="profile-page">
        <div className="content-container">
          <div className="not-logged-in">
            <h2>Please log in to view your profile</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-user-info">
            <h1>{isOwnProfile ? 'My Profile' : `${username}'s Profile`}</h1>
            <div className="user-role-badge">{user.role}</div>
          </div>
          
          <div className="profile-tabs">
            <button 
              className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              My Reviews
            </button>
            {isOwnProfile && (
              <button 
                className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                Account Settings
              </button>
            )}
          </div>
        </div>
        
        <div className="profile-content">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              {activeTab === 'reviews' && (
                <UserReviews reviews={reviews} />
              )}
              
              {activeTab === 'settings' && isOwnProfile && (
                <AccountSettings />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;