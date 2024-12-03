// TODO: Daniel
import request from 'supertest';
import express from 'express';
import FoodItemsRoute from '../../src/routes/FoodItemsRoute';
import FoodItems from '../../src/models/FoodItems';
import OpenFoodFacts from '../../src/utils/OpenFoodFacts';
import { isAuthenticated } from '../../src/utils/AuthGoogle';

// Mock dependencies
jest.mock('../../src/models/FoodItems');
jest.mock('../../src/utils/OpenFoodFacts');
jest.mock('../../src/utils/AuthGoogle');

const app = express();
app.use(express.json());
app.use('/', FoodItemsRoute);

describe('FoodItemsRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /food-items', () => {
    it('should return a list of food items', async () => {
      (isAuthenticated as jest.Mock).mockImplementation((req, res, next) => next());
      (FoodItems.getFoodItems as jest.Mock).mockResolvedValue([
        { barcode: '123456', foodname: 'Test Food', calories: 100 },
      ]);

      const response = await request(app).get('/food-items');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { barcode: '123456', foodname: 'Test Food', calories: 100 },
      ]);
      expect(FoodItems.getFoodItems).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /food-items/:barcode', () => {
    it('should return a food item when found', async () => {
      (isAuthenticated as jest.Mock).mockImplementation((req, res, next) => next());
      (OpenFoodFacts.fetchProductFromAPI as jest.Mock).mockResolvedValue({
        barcode: '123456',
        foodname: 'Test Food',
        calories: 100,
      });

      const response = await request(app).get('/food-items/123456');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        barcode: '123456',
        foodname: 'Test Food',
        calories: 100,
      });
      expect(OpenFoodFacts.fetchProductFromAPI).toHaveBeenCalledWith('123456');
    });

    it('should return 404 when the food item is not found', async () => {
      (isAuthenticated as jest.Mock).mockImplementation((req, res, next) => next());
      (OpenFoodFacts.fetchProductFromAPI as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/food-items/123456');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Food item not found' });
      expect(OpenFoodFacts.fetchProductFromAPI).toHaveBeenCalledWith('123456');
    });
  });

  describe('GET /food-items/search/:searchTerm', () => {
    it('should return search results', async () => {
      (isAuthenticated as jest.Mock).mockImplementation((req, res, next) => next());
      (OpenFoodFacts.searchForProductFromAPI as jest.Mock).mockResolvedValue({
        products: [{ barcode: '123456', foodname: 'Test Food', calories: 100 }],
      });

      const response = await request(app).get('/food-items/search/test?searchTerm=test&page=1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        products: [{ barcode: '123456', foodname: 'Test Food', calories: 100 }],
      });
      expect(OpenFoodFacts.searchForProductFromAPI).toHaveBeenCalledWith('test', 1);
    });
  });

  describe('POST /food-items', () => {
    it('should return a list of valid food items', async () => {
      (isAuthenticated as jest.Mock).mockImplementation((req, res, next) => next());
      (FoodItems.getFoodItem as jest.Mock).mockResolvedValueOnce(null); // Simulate no food item in the database
      (OpenFoodFacts.fetchProductFromAPI as jest.Mock).mockResolvedValueOnce({
        barcode: '123456',
        foodname: 'Test Food',
        calories: 100,
      });

      const response = await request(app)
        .post('/food-items')
        .send({ barcodes: ['123456'] });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { barcode: '123456', foodname: 'Test Food', calories: 100 },
      ]);
      expect(FoodItems.getFoodItem).toHaveBeenCalledWith('123456');
      expect(OpenFoodFacts.fetchProductFromAPI).toHaveBeenCalledWith('123456');
    });

    it('should return 400 if barcodes are not provided', async () => {
      (isAuthenticated as jest.Mock).mockImplementation((req, res, next) => next());

      const response = await request(app).post('/food-items').send({});
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'No barcodes provided or invalid format' });
    });

    it('should return 500 if an error occurs', async () => {
      (isAuthenticated as jest.Mock).mockImplementation((req, res, next) => next());
      (FoodItems.getFoodItem as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/food-items')
        .send({ barcodes: ['123456'] });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });
});
