import { Router } from 'express';
import { getFoodItems, getFoodItem, addFoodItem, FoodItem } from '../models/FoodItems';
const router = Router();

router.get('/food-items', (req, res) => {
    getFoodItems().then((foodItems) => {
        res.json(foodItems);
    });
});

router.get('/food-items/:barcode', (req, res) => {
    getFoodItem(req.params.barcode).then((foodItem) => {
        res.json(foodItem);
    });
})

router.post('/food-items', (req, res) => {;
    addFoodItem(req.body);
});

export default router;