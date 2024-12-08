// TODO: Kevin
import OpenFoodFacts from '../../src/utils/OpenFoodFacts';
import axios from 'axios';

jest.mock('axios');

describe('OpenFoodFacts', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchProductFromAPI', () => {
        it('should fetch a product from the Open Food Facts API', async () => {
            const barcode = '1234567890123';
            const mockResponse = {
                data: {
                    status: 1,
                    product: {
                        code: barcode,
                        product_name: 'Test Product',
                        nutriments: {
                            proteins_100g: 1.2,
                            carbohydrates_100g: 10.5,
                            fat_100g: 0.8,
                            energy_kcal_100g: 50,
                        },
                        image_url: 'http://example.com/image.jpg',
                    },
                },
            };

            (axios.get as jest.Mock).mockResolvedValue(mockResponse);

            const result = await OpenFoodFacts.fetchProductFromAPI(barcode);

            expect(axios.get).toHaveBeenCalledWith(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            expect(result).toEqual(mockResponse.data.product);
        });

        it('should return null if the product is not found', async () => {
            const barcode = '1234567890123';
            const mockResponse = {
                data: {
                    status: 0,
                },
            };

            (axios.get as jest.Mock).mockResolvedValue(mockResponse);

            const result = await OpenFoodFacts.fetchProductFromAPI(barcode);

            expect(axios.get).toHaveBeenCalledWith(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            expect(result).toBeNull();
        });

        it('should throw an error if the API request fails', async () => {
            const barcode = '1234567890123';
            const mockError = new Error('API request failed');

            (axios.get as jest.Mock).mockRejectedValue(mockError);

            await expect(OpenFoodFacts.fetchProductFromAPI(barcode)).rejects.toThrow('API request failed');
            expect(axios.get).toHaveBeenCalledWith(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        });
    });
});