"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FoodItems_1 = __importDefault(require("../models/FoodItems"));
const router = (0, express_1.Router)();
router.get('/food-items', (req, res) => {
    const foodItem = new FoodItems_1.default();
    foodItem.getFoodItems().then((foodItems) => {
        res.json(foodItems);
    });
});
router.get('/food-items/:barcode', (req, res) => {
    const foodItem = new FoodItems_1.default();
    foodItem.getFoodItem(req.params.barcode).then((foodItem) => {
        res.json(foodItem);
    });
});
router.post('/food-items', (req, res) => {
    const foodItem = new FoodItems_1.default();
    foodItem.addFoodItem(req.body).then((foodItem) => {
        res.json(foodItem);
    });
});
exports.default = router;
