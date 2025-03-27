import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">MarketMingle</span>
        </Link>
        
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search for products..." 
            className="search-input"
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>
        
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
                  My Profile
                </Link>
              </li>
              
              {user.role === 'admin' && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-link admin-link" onClick={() => setMenuOpen(false)}>
                    Admin Panel
                  </Link>
                </li>
              )}
              
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link logout-button">
                  Logout
                </button>
              </li>
              
              <li className="nav-item user-greeting">
                <span>Hello, {user.username}</span>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              </li>
              
              <li className="nav-item">
                <Link to="/register" className="nav-link register-button" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;