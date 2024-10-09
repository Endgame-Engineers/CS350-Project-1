import axios from 'axios';
import { MealLog, MealType } from '../models/Models';
import { logger } from './Logger';

export async function getMealLogs(start?: Date, end?: Date): Promise<MealLog[]> {
    if (!(start instanceof Date) || !(end instanceof Date)) {
        logger.error('Invalid date objects');
        return Promise.reject(new Error('Invalid date objects'));
    }

    const uri = '/api/user/logs';
    try {
        const response = await axios.get<MealLog[]>(uri, {
            params: {
                start: start,
                end: end
            }
        });
        logger.info('Meal logs retrieved');
        return response.data;
    } catch (error) {
        logger.error('Error getting meal logs', error);
        throw new Error("Could not get meal logs.");
    }
}

function isValidMealLog(mealLog: MealLog): mealLog is MealLog {
    const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Water'];
    return mealTypes.includes(mealLog.mealtype);
}

export async function addMealLog(mealLog: MealLog): Promise<MealLog> {
    logger.info('Adding meal log');

    if (!isValidMealLog(mealLog)) {
        logger.error('Invalid meal log');
        console.log('Invalid meal log');
        return Promise.reject(new Error('Invalid meal log'));
    }

    try {
        const response = await axios.post<MealLog>('/api/user/logs', mealLog, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        logger.info('Meal log added');
        return response.data;
    } catch (error) {
        console.error("Error adding meal log", error);
        throw new Error("Could not add meal log.");
    }
}


export async function deleteMealLog(numberID: number): Promise<MealLog> {
    logger.info('Deleting meal log');
    try {
        const response = await axios.delete<MealLog>(`/api/user/logs/${numberID}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        logger.info('Meal log deleted');
        return response.data;
    } catch (error) {
        console.error("Error deleting meal log", error);
        throw new Error("Could not delete meal log.");
    }
}



