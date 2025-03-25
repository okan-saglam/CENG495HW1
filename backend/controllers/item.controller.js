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

// Remove Item
const removeItem = async (req, res) => {
    try{
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Geçersiz ID formatı" });
        }
        
        const deletedItem = await Item.findByIdAndDelete(id);
        
        if (!deletedItem) {
            return res.status(404).json({ message: "Bu ID'ye sahip öğe bulunamadı" });
        }
        
        res.status(200).json({ message: "Öğe başarıyla silindi", item: deletedItem });
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

module.exports = { addItem, removeItem, getAllItems, getItemById };