import axios from 'axios';
import { MealLog } from '../models/Models';

export function getMealLogs(start?: Date, end?: Date): Promise<MealLog[]> {
    return axios.get<MealLog[]>('/api/user/logs', {
        params: {
            start: start?.toISOString(),
            end: end?.toISOString()
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