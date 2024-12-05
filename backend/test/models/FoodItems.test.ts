import FoodItems from '../../src/models/FoodItems';
import ConnectToDB from '../../src/utils/ConnectToDB';

jest.mock('../../src/utils/ConnectToDB', () => ({
    getClient: jest.fn(),
}));

describe('FoodItems', () => {
    let mockClient: any;

    beforeEach(() => {
        mockClient = {
            query: jest.fn(), // Mock the query method
        };

        // Mock the getClient method to resolve with the mocked client
        (ConnectToDB.getClient as jest.Mock).mockResolvedValue(mockClient);

        // Recreate the FoodItems instance after the mock setup
        FoodItems['client'] = ConnectToDB.getClient();
    });

    it('should fetch all food items when no barcodes are provided', async () => {
        const mockRows = [
            {
                foodname: 'Apple',
                barcode: '123456',
                protein_per_serv: 0.5,
                carb_per_serv: 25,
                fat_per_serv: 0.3,
                calories_per_serv: 95,
                image: 'apple.jpg',
            },
        ];

        mockClient.query.mockResolvedValue({ rows: mockRows });

        console.debug('Calling getFoodItems...');
        const result = await FoodItems.getFoodItems();
        console.debug('getFoodItems result:', result);

        expect(mockClient.query).toHaveBeenCalledWith(
            'SELECT foodname, barcode, protein_per_serv, carb_per_serv, fat_per_serv, calories_per_serv, image FROM "FoodItems"'
        );
        expect(result).toEqual(mockRows);
    });
});