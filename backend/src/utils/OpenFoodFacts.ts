// OpenFoodFactsAPI.ts

import axios from 'axios';
import FoodItems, { FoodItem } from '../models/FoodItems';
import { ErrorMessage } from '../models/ErrorMessage';
import { logger } from './Logging';

class OpenFoodFactsAPI {
    /**
     * Fetch product information from OpenFoodFacts API
     * @param barcode string
     * @returns any
     */

    async fetchProductFromAPI(barcode: string): Promise<FoodItem | ErrorMessage> {
        logger.info('Fetching product from OpenFoodFacts API');
        return axios
            .get<{ product: any }>(
                `https://world.openfoodfacts.org/api/v3/product/${barcode}.json`,
                {
                    headers: {
                        'User-Agent': 'Carbio.fit - Web - Version 1.0.0 - https://carbio.fit',
                    },
                }
            )
            .then((response) => {
                if (!response.data.product) {
                    logger.info('Barcode does not exist');
                    return { message: 'Barcode does not exist', type: 'not_found' };
                }

                logger.info('Product fetched from API');
                const product: FoodItem = {
                    foodname: response.data.product.product_name,
                    barcode: barcode,
                    protein_per_serv:
                        parseFloat(response.data.product.nutriments.proteins_100g) / 100,
                    carb_per_serv:
                        parseFloat(response.data.product.nutriments.carbohydrates_100g) / 100,
                    fat_per_serv: parseFloat(response.data.product.nutriments.fat_100g) / 100,
                    calories_per_serv:
                        parseFloat(response.data.product.nutriments['energy-kcal_100g']) / 100,
                    image: response.data.product.image_url || "/img/No-Image-Placeholder.svg"
                };

                logger.info('Adding food item to database');
                FoodItems.addFoodItem(product);

                logger.info('Returning product');
                return product;
            })
            .catch((error) => {
                if (error.response || error.request) {
                    if (error.response) {
                        switch (error.response.status) {
                            case 404:
                                logger.error('Barcode does not exist');
                                return { message: 'Barcode does not exist', type: 'not_found' };
                            case 500:
                                logger.error('Server error');
                                return { message: 'Server error', type: 'server_error' };
                            default:
                                logger.error('Unknown error');
                                return { message: 'Unknown error', type: 'unknown' };
                        }
                    } else if (error.request) {
                        logger.error('Request error');
                        return { message: 'Request error', type: 'request_error' };
                    }
                }
                logger.error('Unknown error');
                return { message: 'Unknown error', type: 'unknown' };
            });
    }

    async searchForProductFromAPI(searchTerm: string, page: number = 1): Promise<{ products: FoodItem[], page: number, page_count: number }> {
        logger.info('Searching for product from OpenFoodFacts API');
        const response = await axios.get<{ products: any[], page: number, page_count: number }>(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchTerm}&search_simple=1&action=process&json=1&page_size=10&page=${page}`, {
            headers: {
                'User-Agent': 'Carbio.fit - Web - Version 1.0.0 - https://carbio.fit'
            }
        });
        const products = response.data.products;
        const pageCount = response.data.page_count;

        const foodItems = products.map((product) => {
            logger.info('Mapping product');
            return {
                foodname: product.product_name,
                barcode: product.code,
                protein_per_serv: parseFloat(product.nutriments.proteins_100g) / 100 || 0,
                carb_per_serv: parseFloat(product.nutriments.carbohydrates_100g) / 100 || 0,
                fat_per_serv: parseFloat(product.nutriments.fat_100g) / 100 || 0,
                calories_per_serv: parseFloat(product.nutriments['energy-kcal_100g']) / 100 || 0,
                image: product.image_url || "/img/No-Image-Placeholder.svg"
            };
        });

        logger.info('Returning products');
        return {
            products: foodItems,
            page: response.data.page,
            page_count: pageCount
        };
    }
}

export default new OpenFoodFactsAPI;