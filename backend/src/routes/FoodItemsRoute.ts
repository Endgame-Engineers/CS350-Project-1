import { Router } from 'express';
import FoodItem from '../models/FoodItems';
const router = Router();

router.get('/food-items', (req, res) => {
    const foodItem = new FoodItem();
    foodItem.getFoodItems().then((foodItems) => {
        res.json(foodItems);
    });
});

router.get('/food-items/:barcode', (req, res) => {
    const foodItem = new FoodItem();
    foodItem.getFoodItem(req.params.barcode).then((foodItem) => {
        res.json(foodItem);
    });
})

router.post('/food-items', (req, res) => {
    const foodItem = new FoodItem();
    foodItem.addFoodItem(req.body).then((foodItem) => {
        res.json(foodItem);
    });
});

export default router;