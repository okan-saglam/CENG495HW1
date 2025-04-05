# E-Commerce Platform

A modern e-commerce marketplace where users can buy and sell products, leave reviews, and build reputation through ratings.

---

## Live Demo

[Visit Live Site](https://e-commerce-okan-saglams-projects.vercel.app/)

---

## Tech Stack

### Frontend
- **React (with Vite)**: Fast and modular UI development
- **React Router**: Smooth client-side routing
- **Custom CSS**: Clean, mobile-friendly responsive design
- **Axios**: Simplified API requests with built-in error handling
- **Context API**: Lightweight global state management (auth, cart, etc.)

### Backend
- **Node.js**: JavaScript runtime for server-side logic
- **Express**: RESTful API server
- **MongoDB**: Flexible NoSQL database for users, items, and reviews
- **JWT**: Secure authentication using JSON Web Tokens
- **bcrypt**: Secure password encryption

---

## Architecture & Design

- **Separation of Concerns**: Frontend and backend are developed and maintained independently  
- **MongoDB Schema Design**:
  - **Users**: Authentication, roles (user/admin), and profile data  
  - **Items**: Specialized product models by category (e.g., electronics, furniture, shoes, vinyl)  
  - **Reviews**: Linked to products and users for relational integrity  
- **Inheritance Model**: Product categories extend a base item model with custom attributes  
- **Authentication Flow**: Secure login/registration with JWT tokens and password hashing via `bcrypt`  
- **Responsive UI**: Designed to work across all devices for a better shopping experience  

---

## Features

### User Features
- Authentication: Register, login, view profile, logout  
- Browse Products: Filter by categories  
- Product Detail Pages: View detailed descriptions and category-specific specs  
- Reviews & Ratings: Add, edit, and read product reviews  
- User Profiles: View other users' ratings and items for sale  

### Admin Features
- Admin Dashboard: Accessible after login with admin credentials  
- Add Products: Enter item-specific details based on category  
- Remove Items: Admin-only functionality for content moderation  
- Manage Users: View and delete users if necessary  

---

## Why These Technology Choices?

### JavaScript Ecosystem
Chose JavaScript for both frontend and backend to maintain a consistent language across the entire stack:

- Shared code and data structures between client and server  
- Faster development with a single language  
- Easy JSON handling on both ends  

### React
React was selected as the frontend framework because:

- Component-based architecture improves code reusability  
- Virtual DOM provides excellent performance for interactive UIs  
- Large ecosystem with extensive community support  
- Easy integration with other libraries (e.g., React Router)  

### Node.js & Express
The backend is built on Node.js and Express because:

- Non-blocking I/O is perfect for handling multiple concurrent connections  
- Ideal for creating RESTful APIs  
- Shared language with frontend reduces context switching  
- Mongoose ODM simplifies MongoDB interactions  

### MongoDB
MongoDB was chosen because:

- Schema flexibility is ideal for e-commerce platforms with varied product types  
- JSON-like document structure aligns perfectly with JavaScript  
- Excellent performance for read-heavy operations  
- Built-in support for geospatial queries (great for future feature expansion)  

---

## User Guide

### Login Information

You can access the application in two ways:

#### Regular User Access
- **Username**: `testuser1`  
- **Password**: `123456`  
- **Capabilities**: Browse products, leave reviews, view profile  

#### Admin Access
- **Username**: `testadmin`  
- **Password**: `test1234`  
- **Capabilities**: All regular user features plus access to admin panel for managing products and users  

---

## Basic Navigation

- **Home Page**: Browse all products or filter by category  
- **Product Details**: Click on any product to view full details and reviews  
- **User Profile**: Access your profile through the navbar after logging in  
- **Admin Panel**: Available in the navbar after logging in as admin  

---

## For Regular Users

1. Register an account or log in with existing credentials  
2. Browse products by categories on the homepage  
3. Click on products to view details and reviews  
4. Leave your own reviews and ratings on product pages  
5. View your profile to see your review history  

---

## For Administrators

1. Log in with admin credentials  
2. Access the admin panel via the navigation bar  

### Manage Products:
- Add new products with the "Add New Product" button  
- Fill in product details (vary by product category)  
- Delete products using the delete button in the products table  

### Manage Users:
- View all registered users  
- Add new users with admin or regular privileges  
- Delete users (except your own account)  

---
