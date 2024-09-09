import { config } from 'dotenv';
import { Client } from 'pg';

config();

interface FoodItem {
    foodname: string;
    barcode: string;
    protein_per_serv: number;
    carb_per_serv: number;
    fat_per_serv: number;
    grams_per_serv: number;
    calories_per_serv: number;
}

class FoodItems {
    private client: Client;

    constructor() {
        this.client = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
        });
        this.client.connect();
    }

    async getFoodItems(): Promise<FoodItem[]> {
        const result = await this.client.query('SELECT * FROM "FoodItems"');
        return result.rows;
    }

    async getFoodItem(barcode: string): Promise<FoodItem> {
        const result = await this.client.query('SELECT * FROM "FoodItems" WHERE barcode = $1', [barcode]);
        return result.rows[0];
    }

    async addFoodItem(foodItem: FoodItem): Promise<void> {
        await this.client.query(
            'INSERT INTO "FoodItems" (FoodName, Barcode, protein_per_serv, carb_per_serv, fat_per_serv, grams_per_serv, calories_per_serv) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [foodItem.foodname, foodItem.barcode, foodItem.protein_per_serv, foodItem.carb_per_serv, foodItem.fat_per_serv, foodItem.grams_per_serv, foodItem.calories_per_serv]
        );
    }

    async updateFoodItem(foodItem: FoodItem): Promise<void> {
        await this.client.query(
            'UPDATE "FoodItems" SET FoodName = $1, protein_per_serv = $2, carb_per_serv = $3, fat_per_serv = $4, grams_per_serv = $5, calories_per_serv = $6 WHERE Barcode = $7',
            [foodItem.foodname, foodItem.protein_per_serv, foodItem.carb_per_serv, foodItem.fat_per_serv, foodItem.grams_per_serv, foodItem.calories_per_serv, foodItem.barcode]
        );
    }

    async deleteFoodItem(barcode: string): Promise<void> {
        await this.client.query('DELETE FROM "FoodItems" WHERE Barcode = $1', [barcode]);
    }

    close(): void {
        this.client.end();
    }
}

export default FoodItems;