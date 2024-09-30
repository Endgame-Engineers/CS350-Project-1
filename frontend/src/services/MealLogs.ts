import axios from 'axios';
import { MealLog } from '../models/Models';

export function getMealLogs(start?: Date, end?: Date): Promise<MealLog[]> {
    const uri = '/api/user/logs';
    console.log(`Requesting meal logs from ${uri} with params:`, {
        start: start?.toISOString(),
        end: end?.toISOString()
    });

    return axios.get<MealLog[]>(uri, {
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