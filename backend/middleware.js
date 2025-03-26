require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if(!authHeader){
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : authHeader;

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(err){
        return res.status(401).json({ message: 'Invalid Token' });
    }
};

const adminMiddleware = (req, res, next) => {
    if(req.user.role !== 'admin'){
        return res.status(403).json({ message: req.user.role + ' role is not authorized' });
    }
    next();
};

module.exports = {
    authMiddleware,
    adminMiddleware
};