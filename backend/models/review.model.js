const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    },
    comment: String
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;