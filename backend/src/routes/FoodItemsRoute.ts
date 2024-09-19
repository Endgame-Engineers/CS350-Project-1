import { Router } from 'express';
import FoodItems from '../models/FoodItems';
import OpenFoodFacts from '../utils/OpenFoodFacts';
import { isAuthenticated } from '../utils/AuthGoogle';

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
        this.router.get('/food-items', isAuthenticated, (req, res) => {
            FoodItems.getFoodItems().then((foodItems) => {
                res.json(foodItems);
            });
        });

        this.router.get('/food-items/:barcode', isAuthenticated, (req, res) => {
            FoodItems.getFoodItem(req.params.barcode)
                .then((foodItem) => {
                if (foodItem !== undefined) {
                    console.log('Food item found in database');
                    res.json(foodItem);
                }
                else {
                    console.log('Food item not found in database');
                    OpenFoodFacts.fetchProductFromAPI(req.params.barcode)
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

        this.router.get('/food-items/search/:searchTerm', isAuthenticated, (req, res) => {
            const searchTerm = req.params.searchTerm;
            const page = parseInt(req.query.page as string, 10) || 1;
        
            OpenFoodFacts.searchForProductFromAPI(searchTerm, page)
                .then((result) => {
                    res.json(result);
                })
                .catch((error) => {
                    res.status(500).json({ error: error.message });
                });
        });


        this.router.post('/food-items', isAuthenticated, (req, res) => {;
            FoodItems.addFoodItem(req.body);
        });
    }
}

export default new FoodItemsRoute().router;