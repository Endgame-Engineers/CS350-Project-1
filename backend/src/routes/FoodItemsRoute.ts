import { Router } from 'express';
import { getFoodItems, getFoodItem, addFoodItem, FoodItem } from '../models/FoodItems';
import { fetchProductFromAPI } from '../utils/OpenFoodFacts';
const router = Router();

router.get('/food-items', (req, res) => {
    getFoodItems().then((foodItems) => {
        res.json(foodItems);
    });
});

router.get('/food-items/:barcode', (req, res) => {
    getFoodItem(req.params.barcode)
        .then((foodItem) => {
        if (foodItem !== undefined) {
            console.log('Food item found in database');
            res.json(foodItem);
        }
        else {
            console.log('Food item not found in database');
            fetchProductFromAPI(req.params.barcode)
                .then((product) => {
                if (product) {
                    addFoodItem(product);
                    res.json(product);
                }
                else {
                    res.status(404).json({ message: 'Food item not found' });
                }
            });
        }
    });
});

router.post('/food-items', (req, res) => {;
    addFoodItem(req.body);
});

export default router;