// OpenFoodFactsAPI.test.ts
import axios from 'axios';
import OpenFoodFactsAPI from './OpenFoodFactsAPI';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OpenFoodFactsAPI', () => {
    let api: OpenFoodFactsAPI;

    beforeEach(() => {
        api = new OpenFoodFactsAPI();
    });

    it('should fetch product information from OpenFoodFacts API', async () => {
        const barcode = '1234567890123';
        const mockResponse = {
            data: {
                status: 1,
                product: {
                    code: barcode,
                    product_name: 'Test Product',
                    ingredients_text: 'Test Ingredients',
                    nutriments: {
                        energy: 100,
                        fat: 1,
                        carbohydrates: 20,
                        protein: 2,
                    },
                },
            },
        };

        mockedAxios.get.mockResolvedValue(mockResponse);

        const result = await api.fetchProductFromAPI(barcode);

        expect(mockedAxios.get).toHaveBeenCalledWith(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        expect(result).toEqual(mockResponse.data);
    });

    it('should handle API errors gracefully', async () => {
        const barcode = '1234567890123';
        mockedAxios.get.mockRejectedValue(new Error('API Error'));

        await expect(api.fetchProductFromAPI(barcode)).rejects.toThrow('API Error');
    });
});