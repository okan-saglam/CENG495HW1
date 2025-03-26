const express = require('express');
const router = express.Router();
const ItemControllers = require('../controllers/item.controller');
const { authMiddleware, adminMiddleware } = require('../middleware');

router.get('/', ItemControllers.getAllItems);
router.get('/category/:category', ItemControllers.getItemsByCategory);
router.get('/:id', ItemControllers.getItemById);
router.post('/', authMiddleware, adminMiddleware, ItemControllers.addItem);
router.delete('/:id', authMiddleware, adminMiddleware, ItemControllers.removeItem);

module.exports = router;