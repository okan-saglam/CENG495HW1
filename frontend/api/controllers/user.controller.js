const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Register (public endpoint for regular users)
const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        
        const user = new User({ 
            username, 
            password,
            role: 'user'
        });
        await user.save();
        
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Create User (admin endpoint for creating users with any role)
const createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        
        if (role !== 'admin' && role !== 'user') {
            return res.status(400).json({ message: "Invalid role. Must be 'admin' or 'user'" });
        }
        
        const user = new User({ username, password, role });
        await user.save();
        
        res.status(201).json({ 
            message: `${role === 'admin' ? 'Admin' : 'User'} created successfully`,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login
const login = async (req, res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ 
            username: user.username, 
            id: user._id,
            role: user.role,
            averageRating: user.averageRating
        }, process.env.JWT_SECRET, 
        { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove User with review cleanup
const removeUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        
        // Find the user to be deleted
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: "User with this ID not found" });
        }
        
        // Find all reviews by this user
        const Review = mongoose.model('Review');
        const userReviews = await Review.find({ user: id });
        
        // Process each review
        for (const review of userReviews) {
            // Find the item this review belongs to
            const Item = mongoose.model('Item');
            const item = await Item.findById(review.item);
            
            if (item) {
                // Remove this review from the item's reviews array
                item.reviews = item.reviews.filter(
                    reviewId => reviewId.toString() !== review._id.toString()
                );
                
                // Delete the review
                await Review.findByIdAndDelete(review._id);
                
                // Recalculate item's average rating based on remaining reviews
                const itemRemainingReviews = await Review.find({ item: item._id });
                
                if (itemRemainingReviews.length > 0) {
                    const totalRating = itemRemainingReviews.reduce(
                        (sum, review) => sum + review.rating, 0
                    );
                    item.rating = totalRating / itemRemainingReviews.length;
                } else {
                    // No reviews left, reset to default
                    item.rating = 0;
                }
                
                await item.save();
            } else {
                // If the item doesn't exist, just delete the review
                await Review.findByIdAndDelete(review._id);
            }
        }
        
        // Finally delete the user
        const deletedUser = await User.findByIdAndDelete(id);
        
        res.status(200).json({ 
            message: "User and related reviews successfully deleted", 
            user: {
                username: deletedUser.username,
                role: deletedUser.role
            },
            reviewsRemoved: userReviews.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    getAllUsers,
    removeUser,
    createUser,
    getCurrentUser
};