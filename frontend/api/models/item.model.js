const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    descripton: String,
    price: {
        type: Number,
        required: true
    },
    seller: {
        type: String,
        required: true
    },
    image: String,
    rating: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, { discriminatorKey: 'category', timestamps: true });

const Item = mongoose.model('Item', ItemSchema);

// GPS Sport Watches
const GPSSportWatch = Item.discriminator('GPS Sport Watch', new mongoose.Schema({
    batteryLife: {
        type: Number,
        required: true
    }
}));

// Antique Furniture
const AntiqueFurniture = Item.discriminator('Antique Furniture', new mongoose.Schema({
    age: {
        type: Number,
        required: true
    },
    material: {
        type: String,
        required: true
    }
}));

// Running Shoes
const RunningShoes = Item.discriminator('Running Shoes', new mongoose.Schema({
    size: {
        type: Number,
        required: true
    },
    material: {
        type: String,
        required: true
    }
}));

// Vinyls
const Vinyls = Item.discriminator('Vinyls', new mongoose.Schema({
    age: {
        type: Number,
        required: true
    }
}));

module.exports = { Item, GPSSportWatch, AntiqueFurniture, RunningShoes, Vinyls };