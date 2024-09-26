import { Router } from 'express';
import FoodItems, { FoodItem } from '../models/FoodItems';
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
                if (product && 'foodname' in product) {
                    // Check again before adding to prevent duplicates
                    FoodItems.getFoodItem(req.params.barcode)
                    .then((existingItem) => {
                        if (!existingItem) {
                        FoodItems.addFoodItem(product as FoodItem);
                        }
                        res.json(product);
                    })
                    .catch((error) => {
                        console.log('Error checking food item:', error);
                        res.status(500).json({ error: (error as Error).message });
                    });
                }
                else {
                    res.status(404).json({ message: 'Food item not found' });
                }
                })
                .catch((error) => {
                console.log('Error fetching food item:', error);
                res.status(500).json({ error: (error as Error).message });
                });
            }
            })
            .catch((error) => {
            console.log('Error fetching food item:', error);
            res.status(500).json({ error: (error as Error).message });
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
                    res.status(500).json({  error: (error as Error).message });
                });
        });

        // TODO: allow endpoint to receive json array of barcodes to lookup
        // and return an array of food items
        this.router.post('/food-items', isAuthenticated, async (req, res) => {
            const barcodes = req.body.barcodes;
            if (!barcodes) {
                res.status(400).json({ error: 'No barcodes provided' });
                return;
            }

            try {
                const foodItems: FoodItem[] = await Promise.all(
                    barcodes.map(async (barcode: string) => {
                        FoodItems.getFoodItem(barcode)
                            .then((foodItem) => {
                            if (foodItem) {
                                console.log('Food item found in database');
                                return foodItem;
                            } else {
                                OpenFoodFacts.fetchProductFromAPI(barcode)
                                    .then((product) => {
                                    if (product) {
                                        console.log('Food item not found in database');
                                        if ('foodname' in product) {
                                            FoodItems.addFoodItem(product as FoodItem);
                                        }
                                        return product;
                                    }
                                })
                                .catch((error) => {
                                    console.log('Error fetching food item:', error);
                                });
                            }
                        })
                        .catch((error) => {
                            console.log('Error fetching food item:', error);
                        });
                    })
                );

                console.log('Returning food items');
                res.json(foodItems.filter(item => item !== undefined));
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });
    }
}

export default new FoodItemsRoute().router;