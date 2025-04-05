# E-Commerce Platform

A modern e-commerce marketplace where users can buy and sell products, leave reviews, and build reputation through ratings.

## Live Demo

[Visit Live Site](https://e-commerce-okan-saglams-projects.vercel.app/)

---

## Tech Stack

### Frontend
- **React** (with **Vite**): Fast and modular UI development
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
  - `Users`: Authentication, roles (user/admin), and profile data
  - `Items`: Specialized product models by category (e.g., electronics, furniture, shoes, vinyl)
  - `Reviews`: Linked to products and users for relational integrity
- **Inheritance Model**: Product categories extend a base item model with custom attributes
- **Authentication Flow**: Secure login/registration with JWT tokens and password hashing via `bcrypt`
- **Responsive UI**: Designed to work across all devices for a better shopping experience

---

## Features

### User Features
- **Authentication**: Register, login, view profile, logout
- **Browse Products**: Filter by categories
- **Product Detail Pages**: View detailed descriptions and category-specific specs
- **Reviews & Ratings**: Add, edit, and read product reviews
- **User Profiles**: View other users’ ratings and items for sale

### Admin Features
- **Admin Dashboard**: Accessible after login with admin credentials
- **Add Products**: Enter item-specific details based on category
- **Remove Items**: Admin-only functionality for content moderation
- **Manage Users**: View and delete users if necessary

---