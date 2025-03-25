const express = require('express');
const router = express.Router();
const ItemControllers = require('../controllers/item.controller');

router.get('/', ItemControllers.getAllItems);
router.get('/:id', ItemControllers.getItemById);
router.post('/', ItemControllers.addItem);
router.delete('/:id', ItemControllers.removeItem);

module.exports = router;