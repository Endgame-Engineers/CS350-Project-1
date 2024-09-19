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

    async searchForProductFromAPI(searchTerm: string, page: number = 1): Promise<{ products: FoodItem[], page: number, page_count: number }> {
        const response = await axios.get<{ products: any[], page: number, page_count: number }>(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchTerm}&search_simple=1&action=process&json=1&page_size=10&page=${page}`, {
            headers: {
                'User-Agent': 'Carbio.fit - Web - Version 1.0.0 - https://carbio.fit'
            }
        });
        const products = response.data.products;
        const pageCount = response.data.page_count;

        const foodItems = products.map((product) => {
            return {
                foodname: product.product_name,
                barcode: product.code,
                protein_per_serv: parseFloat(product.nutriments.proteins_100g) / 100,
                carb_per_serv: parseFloat(product.nutriments.carbohydrates_100g) / 100,
                fat_per_serv: parseFloat(product.nutriments.fat_100g) / 100,
                calories_per_serv: parseFloat(product.nutriments['energy-kcal_100g']) / 100,
                image: product.image_url
            };
        });

        return {
            products: foodItems,
            page: response.data.page,
            page_count: pageCount
        };
    }
}

export default new OpenFoodFactsAPI;