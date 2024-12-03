// // TODO: Kevin
import request from 'supertest';
import app from '../../src/index';

describe('UserRoute', () => {
    it('should return 200 when fetching all users', async () => {
        const response = await request(app).get('/api/users');
        expect(response.status).toBe(200);
    });
});
