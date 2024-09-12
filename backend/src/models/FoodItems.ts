import { json } from 'express';
import ConnectToDB from '../utils/ConnectToDB';

export interface FoodItem {
    foodname: string;
    barcode: string;
    protein_per_serv: number;
    carb_per_serv: number;
    fat_per_serv: number;
    grams_per_serv: number;
    calories_per_serv: number;
    image: string;
}

class FoodItems {
    private client = new ConnectToDB().connect();

    /**
     * Get all food items from db
     * @returns Promise<FoodItem[]>
     */
    async getFoodItems(): Promise<FoodItem[]> {
        const result = await (await this.client).query('SELECT foodname, barcode, protein_per_serv, carb_per_serv, fat_per_serv, grams_per_serv, calories_per_serv, image FROM "FoodItems"');
        return result.rows;
    }

    /**
     * Get a food item by barcode
     * @param barcode 
     * @returns 
     */
    async getFoodItem(barcode: string): Promise<FoodItem> {
        const result = await (await this.client).query('SELECT foodname, barcode, protein_per_serv, carb_per_serv, fat_per_serv, grams_per_serv, calories_per_serv, image FROM "FoodItems" WHERE barcode = $1', [barcode]);
        return result.rows[0];
    }

    /**
     * Add a food item to the db
     * @param foodItem 
     * @returns foodItem
     */
    async addFoodItem(foodItem: FoodItem): Promise<FoodItem> {
        await (await this.client).query(
            'INSERT INTO "FoodItems" (FoodName, Barcode, protein_per_serv, carb_per_serv, fat_per_serv, grams_per_serv, calories_per_serv, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [foodItem.foodname, foodItem.barcode, foodItem.protein_per_serv, foodItem.carb_per_serv, foodItem.fat_per_serv, foodItem.grams_per_serv, foodItem.calories_per_serv, foodItem.image]
        );

        return foodItem;
    }

    /**
     * Update a food item in the db
     * @param foodItem 
     */
    async updateFoodItem(foodItem: FoodItem): Promise<void> {
        await (await this.client).query(
            'UPDATE "FoodItems" SET FoodName = $1, protein_per_serv = $2, carb_per_serv = $3, fat_per_serv = $4, grams_per_serv = $5, calories_per_serv = $6 WHERE Barcode = $7',
            [foodItem.foodname, foodItem.protein_per_serv, foodItem.carb_per_serv, foodItem.fat_per_serv, foodItem.grams_per_serv, foodItem.calories_per_serv, foodItem.barcode]
        );
    }

    /**
     * Delete a food item from the db
     * @param barcode 
     */
    async deleteFoodItem(barcode: string): Promise<void> {
        await (await this.client).query('DELETE FROM "FoodItems" WHERE Barcode = $1', [barcode]);
    }

    /**
     * Close the db connection
     */
    close(): void {
        ConnectToDB.close(this.client);
    }
}

export function addFoodItem(foodItem: FoodItem): void {
    new FoodItems().addFoodItem(foodItem);
}
export function updateFoodItem(foodItem: FoodItem): void {
    new FoodItems().updateFoodItem(foodItem);
}
export function deleteFoodItem(barcode: string): void {
    new FoodItems().deleteFoodItem(barcode);
}
export function getFoodItems(): Promise<FoodItem[]> {
    return new FoodItems().getFoodItems();
}
export function getFoodItem(barcode: string): Promise<FoodItem> {
    return new FoodItems().getFoodItem(barcode);
}