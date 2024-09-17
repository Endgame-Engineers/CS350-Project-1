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
        const response = await axios.get<{ product: any }>(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`, {
            headers: {
                'User-Agent': 'Carbio.fit - Web - Version 1.0.0 - https://carbio.fit'
            }
        });
        const product: FoodItem = {
            foodname: response.data.product.product_name,
            barcode: barcode,
            protein_per_serv: parseFloat(response.data.product.nutriments.proteins_serving),
            carb_per_serv: parseFloat(response.data.product.nutriments.carbohydrates_serving),
            fat_per_serv: parseFloat(response.data.product.nutriments.fat_serving),
            grams_per_serv: parseFloat(response.data.product.serving_quantity),
            calories_per_serv: parseFloat(response.data.product.nutriments['energy-kcal']),
            image: response.data.product.image_url
        };
        return product;
    }
}

export default OpenFoodFactsAPI;
export function fetchProductFromAPI(barcode: string): Promise<any> {
    return new OpenFoodFactsAPI().fetchProductFromAPI(barcode);
}