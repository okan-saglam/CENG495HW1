const mongoose = require('mongoose');
const Review = require('../models/review.model');
const Item = require('../models/item.model').Item;
const User = require('../models/user.model');

// Add or Update Review
const addOrUpdateReview = async (req, res) => {
    try {
        const { itemId, rating, comment } = req.body;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: "Invalid Item ID" });
        }

        // Find the item and user - SELECT REVIEWS FIELD TOO
        const item = await Item.findById(itemId);
        const user = await User.findById(userId); // Tüm user alanlarını getir
        
        if (!item) {
            return res.status(404).json({ message: "Item does not exist" });
        }
        
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // reviews alanının varlığını kontrol et
        if (!user.reviews) {
            user.reviews = []; // Eğer yoksa boş dizi oluştur
        }
        
        let existingReview = await Review.findOne({ user: userId, item: itemId });
        let isUpdate = false;
        
        if (existingReview) {
            // Update existing review
            existingReview.rating = rating;
            existingReview.comment = comment;
            existingReview.updatedAt = new Date(); // Ensure date is set properly
            
            await existingReview.save();
            isUpdate = true;
        } else {
            // Create new review
            const newReview = new Review({
                user: userId,
                item: itemId,
                rating,
                comment,
                createdAt: new Date() // Ensure date is set properly
            });

            await newReview.save();
            
            // Add review to item's reviews array
            if (!item.reviews) item.reviews = [];
            item.reviews.push(newReview._id);
            await item.save();
            
            // Add review to user's reviews array - KONTROL EKLE
            if (!user.reviews) user.reviews = [];
            user.reviews.push(newReview._id);
            await user.save();
            
            existingReview = newReview;
        }

        // Update item's average rating - average of all reviews FOR this item
        const itemReviews = await Review.find({ item: itemId });
        if (itemReviews.length > 0) {
            const itemTotalRating = itemReviews.reduce((sum, review) => sum + review.rating, 0);
            item.rating = itemTotalRating / itemReviews.length;
            await item.save();
        }

        // Update user's average rating - average of all reviews BY this user
        const userReviews = await Review.find({ user: userId });
        if (userReviews.length > 0) {
            const userTotalRating = userReviews.reduce((sum, review) => sum + review.rating, 0);
            user.averageRating = userTotalRating / userReviews.length;
            await user.save();
        }

        // Populate the user field to return complete user info
        await existingReview.populate('user', 'username');
        
        const message = isUpdate 
            ? "Review updated successfully" 
            : "Review added successfully";
            
        res.status(201).json({ 
            message, 
            review: {
                ...existingReview._doc,
                user: {
                    _id: user._id,
                    username: user.username
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Reviews by Item
const getReviewsByItem = async (req, res) => {
    try {
        const { itemId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: "Geçersiz ürün ID formatı" });
        }

        const reviews = await Review.find({ item: itemId }).populate('user', 'username');
        
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get User's Reviews
const getUserReviews = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.id;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        
        const user = await User.findById(userId).populate({
            path: 'reviews',
            populate: {
                path: 'item',
                select: 'name image price'
            }
        });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json(user.reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get User's Review for an Item
const getUserReviewForItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user.id;

        // Validate itemId
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: "Invalid item ID format" });
        }

        // Find user's review for the item
        const review = await Review.findOne({ user: userId, item: itemId });
        
        if (!review) {
            return res.status(404).json({ message: "No review found for this user and item" });
        }
        
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addOrUpdateReview,
    getReviewsByItem,
    getUserReviews,
    getUserReviewForItem
};