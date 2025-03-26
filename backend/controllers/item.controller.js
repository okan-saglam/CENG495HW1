const mongoose = require('mongoose');
const { Item, GPSSportWatch, AntiqueFurniture, RunningShoes, Vinyls } = require('../models/item.model');

// Add Item
const addItem = async (req, res) => {
    try{
        const { category, ...data } = req.body;
        let newItem;

        switch(category){
            case "GPS Sport Watch":
                newItem = new GPSSportWatch(data);
                break;
            case "Antique Furniture":
                newItem = new AntiqueFurniture(data);
                break;
            case "Running Shoes":
                newItem = new RunningShoes(data);
                break;
            case "Vinyls":
                newItem = new Vinyls(data);
                break;
            default:
                return res.status(400).json({ message: "Geçersiz kategori!" });
        }

        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Remove Item with review cleanup
const removeItem = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        
        const item = await Item.findById(id);
        
        if (!item) {
            return res.status(404).json({ message: "Item with this ID not found" });
        }
        
        const Review = mongoose.model('Review');
        const itemReviews = await Review.find({ item: id });
        
        // Process each review
        for (const review of itemReviews) {
            
            const user = await mongoose.model('User').findById(review.user);
            
            if (user) {
                // Remove this review from the user's reviews array
                user.reviews = user.reviews.filter(
                    reviewId => reviewId.toString() !== review._id.toString()
                );
                
                // Delete the review
                await Review.findByIdAndDelete(review._id);
                
                // Recalculate user's average rating based on their remaining reviews
                const userRemainingReviews = await Review.find({ user: user._id });
                
                if (userRemainingReviews.length > 0) {
                    const totalRating = userRemainingReviews.reduce(
                        (sum, review) => sum + review.rating, 0
                    );
                    user.averageRating = totalRating / userRemainingReviews.length;
                } else {
                    // No reviews left, reset to default
                    user.averageRating = 0;
                }
                
                await user.save();
            }
        }
        
        const deletedItem = await Item.findByIdAndDelete(id);
        
        res.status(200).json({ 
            message: "Item and related reviews successfully deleted", 
            item: deletedItem,
            reviewsRemoved: itemReviews.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Items
const getAllItems = async (req, res) => {
    try{
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Get Item By ID
const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Geçersiz ID formatı" });
        }
        
        const item = await Item.findById(id);
        
        if (!item) {
            return res.status(404).json({ message: "Bu ID'ye sahip öğe bulunamadı" });
        }
        
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Items By Category
const getItemsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        
        const validCategories = ['GPS Sport Watch', 'Antique Furniture', 'Running Shoes', 'Vinyls'];
        
        if (!validCategories.includes(category) && category !== 'all') {
            return res.status(400).json({ message: "Geçersiz kategori" });
        }
        
        if (category === 'all') {
            const items = await Item.find();
            return res.status(200).json(items);
        }
        
        const items = await Item.find({ category: category });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    addItem, 
    removeItem, 
    getAllItems, 
    getItemById,
    getItemsByCategory
};