// TODO: Daniel

import MealLogs from '../../src/models/MealLogs';
import ConnectToDB from '../../src/utils/ConnectToDB';

jest.mock('../../src/utils/ConnectToDB', () => ({
    getClient: jest.fn(),
}));

describe('MealLogs', () => {
    let mockClient: any;

    beforeEach(() => {
        mockClient = {
            query: jest.fn(), // Mock the query method
        };

        // Mock the getClient method to resolve with the mocked client
        (ConnectToDB.getClient as jest.Mock).mockResolvedValue(mockClient);

        // Recreate the MealLogs instance after the mock setup
        MealLogs['client'] = ConnectToDB.getClient();
    });

    it('should fetch meal logs for a user without date range', async () => {
        const mockRows = [
            {
                mealtype: 'Lunch',
                dateadded: new Date('2024-12-05T12:00:00Z'),
                barcode: '123456',
                userid: 1,
                servingconsumed: 2,
                recipeid: null,
            },
        ];

        mockClient.query.mockResolvedValue({ rows: mockRows });

        console.debug('Calling getMealLogs...');
        const result = await MealLogs.getMealLogs(1);
        console.debug('getMealLogs result:', result);

        expect(mockClient.query).toHaveBeenCalledWith(
            'SELECT * FROM "MealLogs" WHERE userid = $1',
            [1]
        );
        expect(result).toEqual(mockRows);
    });
});