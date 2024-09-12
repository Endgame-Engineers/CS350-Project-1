"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FoodItems_1 = require("../models/FoodItems");
const router = (0, express_1.Router)();
router.get('/food-items', (req, res) => {
    (0, FoodItems_1.getFoodItems)().then((foodItems) => {
        res.json(foodItems);
    });
});
router.get('/food-items/:barcode', (req, res) => {
    (0, FoodItems_1.getFoodItem)(req.params.barcode).then((foodItem) => {
        res.json(foodItem);
    });
});
router.post('/food-items', (req, res) => {
    ;
    (0, FoodItems_1.addFoodItem)(req.body);
});
exports.default = router;
