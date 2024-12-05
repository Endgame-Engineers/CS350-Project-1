import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { getMealLogs, addMealLog, deleteMealLog } from '../../src/services/MealLogs';
import { MealLog } from '../../src/models/Models';
import { logger } from '../../src/services/Logger';

vi.mock('axios');
vi.mock('../../src/services/Logger');

describe('MealLogs Service', () => {
    describe('getMealLogs', () => {
        it('should retrieve meal logs successfully', async () => {
            const mockData: MealLog[] = [
                { id: 1, mealtype: 'Breakfast', servingconsumed: 1, dateadded: new Date().toISOString() },
                { id: 2, mealtype: 'Lunch', servingconsumed: 2, dateadded: new Date().toISOString() }
            ];
            (axios.get as vi.Mock).mockResolvedValue({ data: mockData });

            const start = new Date();
            const end = new Date();
            const result = await getMealLogs(start, end);

            expect(result).toEqual(mockData);
            expect(axios.get).toHaveBeenCalledWith('/api/user/logs', { params: { start, end } });
            expect(logger.info).toHaveBeenCalledWith('Meal logs retrieved');
        });

        it('should throw an error for invalid date objects', async () => {
            await expect(getMealLogs('invalid' as any, 'invalid' as any)).rejects.toThrow('Invalid date objects');
            expect(logger.error).toHaveBeenCalledWith('Invalid date objects');
        });

        it('should handle errors when retrieving meal logs', async () => {
            (axios.get as vi.Mock).mockRejectedValue(new Error('Network Error'));

            const start = new Date();
            const end = new Date();
            await expect(getMealLogs(start, end)).rejects.toThrow('Could not get meal logs.');
            expect(logger.error).toHaveBeenCalledWith('Error getting meal logs', expect.any(Error));
        });
    });

    describe('addMealLog', () => {
        it('should add a meal log successfully', async () => {
            const mockMealLog: MealLog = { id: 1, mealtype: 'Breakfast', servingconsumed: 1, dateadded: new Date().toISOString() };
            (axios.post as vi.Mock).mockResolvedValue({ data: mockMealLog });

            const result = await addMealLog(mockMealLog);

            expect(result).toEqual(mockMealLog);
            expect(axios.post).toHaveBeenCalledWith('/api/user/logs', mockMealLog, { headers: { 'Content-Type': 'application/json' } });
            expect(logger.info).toHaveBeenCalledWith('Meal log added');
        });

        it('should throw an error for invalid meal log', async () => {
            const invalidMealLog: MealLog = { id: 1, mealtype: 'InvalidType', servingconsumed: 0, dateadded: new Date().toISOString() };

            await expect(addMealLog(invalidMealLog)).rejects.toThrow('Invalid meal log');
            expect(logger.error).toHaveBeenCalledWith('Invalid meal log');
        });

        it('should handle errors when adding a meal log', async () => {
            const mockMealLog: MealLog = { id: 1, mealtype: 'Breakfast', servingconsumed: 1, dateadded: new Date().toISOString() };
            (axios.post as vi.Mock).mockRejectedValue(new Error('Network Error'));

            await expect(addMealLog(mockMealLog)).rejects.toThrow('Could not add meal log.');
            expect(logger.error).toHaveBeenCalledWith('Error adding meal log', expect.any(Error));
        });
    });

    describe('deleteMealLog', () => {
        it('should delete a meal log successfully', async () => {
            const mockMealLog: MealLog = { id: 1, mealtype: 'Breakfast', servingconsumed: 1, dateadded: new Date().toISOString() };
            (axios.delete as vi.Mock).mockResolvedValue({ data: mockMealLog });

            const result = await deleteMealLog(1);

            expect(result).toEqual(mockMealLog);
            expect(axios.delete).toHaveBeenCalledWith('/api/user/logs/1', { headers: { 'Content-Type': 'application/json' } });
            expect(logger.info).toHaveBeenCalledWith('Meal log deleted');
        });

        it('should handle errors when deleting a meal log', async () => {
            (axios.delete as vi.Mock).mockRejectedValue(new Error('Network Error'));

            await expect(deleteMealLog(1)).rejects.toThrow('Could not delete meal log.');
            expect(logger.error).toHaveBeenCalledWith('Error deleting meal log', expect.any(Error));
        });
    });
});