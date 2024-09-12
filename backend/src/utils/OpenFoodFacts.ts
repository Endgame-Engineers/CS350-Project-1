// https://github.com/openfoodfacts/openfoodfacts-nodejs
// I need to install the package openfoodfacts-nodejs and create an interface for the api so that we can use it in the backend
// I will create a function to get the product information by barcode and return the product information

// OpenFoodFactsAPI.ts
import axios from 'axios';
import ConnectToDB from './ConnectToDB';

class OpenFoodFactsAPI {
    private db: ConnectToDB;

    constructor() {
        this.db = new ConnectToDB();
    }

    /**
     * Check if the barcode exists in the database
     * @param barcode string
     * @returns boolean
     */ 
    // TODO: remove this function. this should live in FoodItems.ts
    async barcodeExists(barcode: string): Promise<boolean> {
        const client = await this.db.connect();
        const res = await client.query('SELECT 1 FROM products WHERE barcode = $1', [barcode]);
        await this.db.disconnect(client);
        return (res.rowCount ?? 0) > 0;
    }

    /**
     * Fetch product information from OpenFoodFacts API
     * @param barcode string
     * @returns any
     */

    // this stays of course
    async fetchProductFromAPI(barcode: string): Promise<any> {
        const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        return response.data;
    }

    /**
     * Save product information to the database
     * @param product any
     */

    // TODO: remove this function. this should live in FoodItems.ts
    async saveProductToDB(product: any): Promise<void> {
        const client = await this.db.connect();
        const query = `
            INSERT INTO products (barcode, product_name, ingredients_text, nutrients)
            VALUES ($1, $2, $3, $4)
        `;
        const values = [
            product.code,
            product.product_name,
            product.ingredients_text,
            JSON.stringify(product.nutriments),
        ];
        await client.query(query, values);
        await this.db.disconnect(client);
    }

    /**
     * Get product information by barcode
     * @param barcode string
     * @returns any
     */

    // TODO: remove this function. this should live in FoodItems.ts
    async getProductByBarcode(barcode: string): Promise<any> {
        if (await this.barcodeExists(barcode)) {
            const client = await this.db.connect();
            const res = await client.query('SELECT * FROM products WHERE barcode = $1', [barcode]);
            await this.db.disconnect(client);
            return res.rows[0];
        } else {
            const product = await this.fetchProductFromAPI(barcode);
            if (product.status === 1) {
                await this.saveProductToDB(product.product);
                return product.product;
            } else {
                throw new Error('Product not found');
            }
        }
    }
}

export default OpenFoodFactsAPI;