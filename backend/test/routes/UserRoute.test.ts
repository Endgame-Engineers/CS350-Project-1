// // TODO: Kevin
import request from 'supertest';
import app from '../../src/index';

const bearerToken = "c3e1f1d7-e6bd-4fd4-9689-f3b67002323d";

const expectedKeys = ['id', 'email', 'firstname', 'lastname', 'uuid', 'providername', 'providerid'];

describe('GET /api/user', () => {
    it('should return user object', async () => {
        const res = await request(app)
            .get('/api/user')
            .set('Authorization', `Bearer ${bearerToken}`);
        expect(res.status).toEqual(200);
        for (let key of expectedKeys) {
            expect(res.body).toHaveProperty(key);
        }
        expect(res.headers['content-type']).toMatch(/json/);
    }, 30000);
});