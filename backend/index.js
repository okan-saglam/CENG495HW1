require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ItemRoute = require('./routes/item.route');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false})); // form tipinde request atmak için middleware

// Routes
app.use('/items', ItemRoute);

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Database is connected")
})
.catch(() => {
    console.log("Database is not connected")
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`)
});