import ConnectToDB from '../utils/ConnectToDB';
import { logger } from '../utils/Logging';
import { ErrorMessage } from './ErrorMessage';

export interface FoodItem {
    foodname: string;
    barcode: string;
    protein_per_serv: number;
    carb_per_serv: number;
    fat_per_serv: number;
    calories_per_serv: number;
    image: string;
}

class FoodItems {
    private client: any;

    constructor() {
        this.client = ConnectToDB.getClient();
    }

    isFoodItem(product: FoodItem | ErrorMessage): product is FoodItem {
        logger.info('Checking if product is a FoodItem');
        return (product as FoodItem).foodname !== undefined;
    }

    async getFoodItems(barcodes: string[] = []): Promise<FoodItem[]> {
        logger.info('Fetching food items from database');
        if (barcodes.length === 0) {
            logger.info('No barcodes provided');
            const result = await (await this.client).query('SELECT foodname, barcode, protein_per_serv, carb_per_serv, fat_per_serv, calories_per_serv, image FROM "FoodItems"');
            logger.info('Returning food items');
            return result.rows;
        }

        logger.info('Barcodes provided');
        const result = await (await this.client).query('SELECT foodname, barcode, protein_per_serv, carb_per_serv, fat_per_serv, calories_per_serv, image FROM "FoodItems" WHERE barcode = ANY($1)', [barcodes]);
        logger.info('Returning food items');
        return result.rows;
    }

    async getFoodItem(barcode: string): Promise<FoodItem | null> {
        logger.info('Fetching food item from database');
        const result = await (await this.client).query('SELECT foodname, barcode, protein_per_serv, carb_per_serv, fat_per_serv, calories_per_serv, image FROM "FoodItems" WHERE barcode = $1', [barcode]);
        let foodItem = result.rows[0];
        if (!foodItem) {
            logger.info('Food item not found');
            return null;
        }
        logger.info('Returning food');
        return foodItem;
    }

    async addFoodItem(foodItem: FoodItem): Promise<FoodItem> {
        logger.info('Adding food item to database');
        const existingItem = await this.getFoodItem(foodItem.barcode);
        if (existingItem) {
            logger.info('Food item already exists');
            logger.info('Returning existing food item');
            return existingItem;
        }

        try {
            logger.info('Inserting food item into database');
            await (await this.client).query(
                'INSERT INTO "FoodItems" (FoodName, Barcode, protein_per_serv, carb_per_serv, fat_per_serv, calories_per_serv, image) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [foodItem.foodname, foodItem.barcode, foodItem.protein_per_serv, foodItem.carb_per_serv, foodItem.fat_per_serv, foodItem.calories_per_serv, foodItem.image]
            );
            logger.info('Food item added to database');
        } catch (error: any) {
            if (error.code === '23505') {
                logger.error('Barcode must be unique');
                throw new Error('Barcode must be unique');
            } else {
                logger.error('Error adding food item');
                throw error;
            }
        }
        logger.info('Returning food item');
        return foodItem;
    }
}

export default new FoodItems();