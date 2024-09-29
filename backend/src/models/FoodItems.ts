import ConnectToDB from '../utils/ConnectToDB';
import OpenFoodFacts from '../utils/OpenFoodFacts';
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
        return (product as FoodItem).foodname !== undefined;
    }

    async getFoodItems(barcodes: string[] = []): Promise<FoodItem[]> {
        if (barcodes.length === 0) {
            const result = await (await this.client).query('SELECT foodname, barcode, protein_per_serv, carb_per_serv, fat_per_serv, calories_per_serv, image FROM "FoodItems"');
            return result.rows;
        }

        const result = await (await this.client).query('SELECT foodname, barcode, protein_per_serv, carb_per_serv, fat_per_serv, calories_per_serv, image FROM "FoodItems" WHERE barcode = ANY($1)', [barcodes]);
        return result.rows;
    }


    // TODO: fix this not not fecthing food item from OpenFoodFacts and just returning null
    async getFoodItem(barcode: string): Promise<FoodItem | null> {
        const result = await (await this.client).query('SELECT foodname, barcode, protein_per_serv, carb_per_serv, fat_per_serv, calories_per_serv, image FROM "FoodItems" WHERE barcode = $1', [barcode]);
        let foodItem = result.rows[0];
        if (!foodItem) {
            return null;
        }
        return foodItem;
    }


    async addFoodItem(foodItem: FoodItem): Promise<FoodItem> {
        const existingItem = await this.getFoodItem(foodItem.barcode);
        if (existingItem) {
            return existingItem;
        }

        await (await this.client).query(
            'INSERT INTO "FoodItems" (FoodName, Barcode, protein_per_serv, carb_per_serv, fat_per_serv, calories_per_serv, image) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [foodItem.foodname, foodItem.barcode, foodItem.protein_per_serv, foodItem.carb_per_serv, foodItem.fat_per_serv, foodItem.calories_per_serv, foodItem.image]
        );

        return foodItem;
    }

    async updateFoodItem(foodItem: FoodItem): Promise<void> {
        await (await this.client).query(
            'UPDATE "FoodItems" SET FoodName = $1, protein_per_serv = $2, carb_per_serv = $3, fat_per_serv = $4, calories_per_serv = $5 WHERE Barcode = $6',
            [foodItem.foodname, foodItem.protein_per_serv, foodItem.carb_per_serv, foodItem.fat_per_serv, foodItem.calories_per_serv, foodItem.barcode]
        );
    }

    async deleteFoodItem(barcode: string): Promise<void> {
        await (await this.client).query('DELETE FROM "FoodItems" WHERE Barcode = $1', [barcode]);
    }
}

export default new FoodItems();