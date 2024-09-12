// https://github.com/openfoodfacts/openfoodfacts-nodejs
// I need to install the package openfoodfacts-nodejs and create an interface for the api so that we can use it in the backend
// I will create a function to get the product information by barcode and return the product information

// OpenFoodFactsAPI.ts
import axios from 'axios';
import ConnectToDB from './ConnectToDB';
import { FoodItem } from '../models/FoodItems';

class OpenFoodFactsAPI {
    private db: ConnectToDB;

    constructor() {
        this.db = new ConnectToDB();
    }

    /**
     * Fetch product information from OpenFoodFacts API
     * @param barcode string
     * @returns any
     */

    // this stays of course
    async fetchProductFromAPI(barcode: string): Promise<FoodItem> {
        const response = await axios.get<{ product: any }>(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const product: FoodItem = {
            foodname: response.data.product.product_name,
            barcode: barcode,
            protein_per_serv: response.data.product.nutriments.proteins_serving,
            carb_per_serv: response.data.product.nutriments.carbohydrates_serving,
            fat_per_serv: response.data.product.nutriments.fat_serving,
            grams_per_serv: response.data.product.nutriments.serving_size,
            calories_per_serv: response.data.product.nutriments['energy-kcal']
        };
        return product;
    }
}

export default OpenFoodFactsAPI;
export function fetchProductFromAPI(barcode: string): Promise<any> {
    return new OpenFoodFactsAPI().fetchProductFromAPI(barcode);
}