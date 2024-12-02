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
      OpenFoodFacts.fetchProductFromAPI(req.params.barcode)
        .then((foodItem) => {
          if (foodItem) {
            res.json(foodItem);
          } else {
            res.status(404).json({ error: 'Food item not found' });
          }
        })
        .catch((error) => {
          console.error('Error fetching food item:', error);
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
          res.status(500).json({ error: (error as Error).message });
        });
    });

    this.router.post('/food-items', isAuthenticated, async (req, res) => {
      const barcodes = req.body.barcodes;

      if (!barcodes || !Array.isArray(barcodes)) {
        res.status(400).json({ error: 'No barcodes provided or invalid format' });
        return;
      }

      try {
        // Use Promise.all with proper async/await
        const foodItems = await Promise.all(
          barcodes.map(async (barcode: string) => {
            try {
              const foodItem = await FoodItems.getFoodItem(barcode);
              if (foodItem) {
                console.log('Food item found in database:', foodItem);
                return foodItem; // Return the food item from the database
              } else {
                const product = await OpenFoodFacts.fetchProductFromAPI(barcode);
                if (product && 'foodname' in product) {
                  console.log('Food item not found in database. Adding to database:', product);
                  await FoodItems.addFoodItem(product as FoodItem); // Save fetched product to DB
                  return product; // Return the fetched product
                }
                console.log(`No product found for barcode: ${barcode}`);
                return null; // Return null if no product found
              }
            } catch (error) {
              console.error(`Error processing barcode ${barcode}:`, error);
              return null; // Return null on error for this barcode
            }
          })
        );

        // Filter out null values
        const validFoodItems: FoodItem[] = foodItems.filter((item): item is FoodItem => item !== null);

        console.log('Returning valid food items:', validFoodItems);
        res.json(validFoodItems);
      } catch (error) {
        console.error('Error processing food items:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

  }
}

export default new FoodItemsRoute().router;