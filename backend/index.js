require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ItemRoute = require('./routes/item.route');
const UserRoute = require('./routes/user.route');
const ReviewRoute = require('./routes/review.route');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false})); // form tipinde request atmak için middleware

// CORS middleware for frontend access
app.use((req, res, next) => {
    // Tüm kaynaklardan gelen isteklere izin verin (geliştirme ve üretim için)
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://e-commerce-ruby-kappa-47.vercel.app'
    ];
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    } else {
        res.header('Access-Control-Allow-Origin', '*');
    }
    
    // İzin verilen başlıklar ve methodlar
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({});
    }
    
    next();
});

// Routes
app.get('/api', (req, res) => {
    res.status(200).json({ message: 'API is running correctly' });
});

// Tüm API rotalarını /api prefix'i altında grupla
app.use('/api/items', ItemRoute);
app.use('/api/users', UserRoute);
app.use('/api/reviews', ReviewRoute);

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Database is connected")
})
.catch((err) => {
    console.log("Database is not connected", err)
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`)
});