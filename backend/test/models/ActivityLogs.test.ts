// TODO: Kevin
import ActivityLogs from '../../src/models/ActivityLogs';
import ConnectToDB from '../../src/utils/ConnectToDB';

jest.mock('../../src/utils/ConnectToDB', () => ({
    getClient: jest.fn(),
}));

describe('ActivityLogs', () => {
    let mockClient: any;

    beforeEach(() => {
        mockClient = {
            query: jest.fn(), // Mock the query method
        };

        // Mock the getClient method to resolve with the mocked client
        (ConnectToDB.getClient as jest.Mock).mockReturnValue(mockClient);

        // Recreate the ActivityLogs instance after the mock setup
        ActivityLogs['client'] = ConnectToDB.getClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch all activities', async () => {
        const mockRows = [
            {
                id: 1,
                name: 'Running',
                calories_burned_per_minute: 10,
            },
        ];

        mockClient.query.mockResolvedValue({ rows: mockRows });

        const result = await ActivityLogs.getActivities();

        expect(mockClient.query).toHaveBeenCalledWith(
            'SELECT * FROM "Activities"'
        );
        expect(result).toEqual(mockRows);
    });

    it('should add an activity log', async () => {
        const activityLog = {
            userid: 1,
            activityid: 1,
            durationminutes: 30,
            dateadded: new Date(),
        };

        mockClient.query.mockResolvedValue({ rows: [activityLog] });

        const result = await ActivityLogs.addActivityLog(activityLog);

        expect(mockClient.query).toHaveBeenCalledWith(
            'INSERT INTO "ActivityLogs" (dateadded, userid, activityid, durationminutes) VALUES ($1, $2, $3, $4) RETURNING *',
            [activityLog.dateadded, activityLog.userid, activityLog.activityid, activityLog.durationminutes]
        );
        expect(result).toEqual(activityLog);
    });

    it('should check if an activity exists', async () => {
        const activityId = 1;
        const mockRows = [{ id: activityId }];

        mockClient.query.mockResolvedValue({ rows: mockRows });

        const result = await ActivityLogs.doesActivityExist(activityId);

        expect(mockClient.query).toHaveBeenCalledWith(
            'SELECT * FROM "Activities" WHERE id = $1',
            [activityId]
        );
        expect(result).toBe(true);
    });

    it('should return false if an activity does not exist', async () => {
        const activityId = 999;

        mockClient.query.mockResolvedValue({ rows: [] });

        const result = await ActivityLogs.doesActivityExist(activityId);

        expect(mockClient.query).toHaveBeenCalledWith(
            'SELECT * FROM "Activities" WHERE id = $1',
            [activityId]
        );
        expect(result).toBe(false);
    });
});