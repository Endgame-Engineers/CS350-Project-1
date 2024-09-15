import { Router } from 'express';
import FoodItems from '../models/FoodItems';
import { fetchProductFromAPI } from '../utils/OpenFoodFacts';

/**
 * FoodItemsRoute
 */
class FoodItemsRoute {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.get('/food-items', (req, res) => {
            FoodItems.getFoodItems().then((foodItems) => {
                res.json(foodItems);
            });
        });

        this.router.get('/food-items/:barcode', (req, res) => {
            FoodItems.getFoodItem(req.params.barcode)
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
                            FoodItems.addFoodItem(product);
                            res.json(product);
                        }
                        else {
                            res.status(404).json({ message: 'Food item not found' });
                        }
                    });
                }
            });
        });

        this.router.post('/food-items', (req, res) => {;
            FoodItems.addFoodItem(req.body);
        });
    }
}

export default new FoodItemsRoute().router;