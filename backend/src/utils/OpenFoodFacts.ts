// OpenFoodFactsAPI.ts
import axios from 'axios';
import { FoodItem } from '../models/FoodItems';

class OpenFoodFactsAPI {

    /**
     * Fetch product information from OpenFoodFacts API
     * @param barcode string
     * @returns any
     */

    async fetchProductFromAPI(barcode: string): Promise<FoodItem> {
        const response = await axios.get<{ product: any }>(`https://world.openfoodfacts.org/api/v3/product/${barcode}.json`, {
            headers: {
                'User-Agent': 'Carbio.fit - Web - Version 1.0.0 - https://carbio.fit'
            }
        });
        const product: FoodItem = {
            foodname: response.data.product.product_name,
            barcode: barcode,
            protein_per_serv: parseFloat(response.data.product.nutriments.proteins_100g) / 100,
            carb_per_serv: parseFloat(response.data.product.nutriments.carbohydrates_100g) / 100,
            fat_per_serv: parseFloat(response.data.product.nutriments.fat_100g) / 100,
            calories_per_serv: parseFloat(response.data.product.nutriments['energy-kcal_100g']) / 100,
            image: response.data.product.image_url
        };
        return product;
    }
}

export default OpenFoodFactsAPI;
export function fetchProductFromAPI(barcode: string): Promise<any> {
    return new OpenFoodFactsAPI().fetchProductFromAPI(barcode);
}