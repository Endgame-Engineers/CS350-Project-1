import axios from 'axios';
import { MealLog } from '../models/Models';

export function getMealLogs(start?: Date, end?: Date): Promise<MealLog[]> {
    if (!(start instanceof Date) || !(end instanceof Date)) {
        console.error('Invalid date objects');
        return Promise.reject(new Error('Invalid date objects'));
    }

    const uri = '/api/user/logs';
    return axios.get<MealLog[]>(uri, {
        params: {
            start: start,
            end: end
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error("Error getting meal logs", error);
            throw new Error("Could not get meal logs.");
        });
}

export function addMealLog(mealLog: MealLog): Promise<MealLog> {
    return axios.post<MealLog>('/api/user/logs', mealLog, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error("Error adding meal log", error);
            throw new Error("Could not add meal log.");
        });
}