import axios from 'axios';
import { MealLog } from '../models/Models';

export function getMealLogs(): Promise<MealLog[]> {
    return axios.get<MealLog[]>('/api/user/logs?all=true')
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching meal logs", error);
            throw new Error("Could not fetch meal logs.");
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