import { UserStat, ErrorMessage } from "../models/Models";
import axios from "axios";

// Function to fetch user stats from the backend
export async function getUserStats(): Promise<UserStat> {
    try {
        const response = await axios.get<UserStat>('/api/user/stats');
        return response.data;
    } catch (error) {
        console.error("Error fetching user stats", error);
        throw new Error("Could not fetch user stats.");
    }
}

export async function getUserStat(): Promise<UserStat | ErrorMessage> {
    try {
        const response = await axios.get<UserStat[]>('/api/user/stats');
        if (response.data.length === 0) {
            return {
                message: "No user stats found",
                type: "warning"
            };
        }
        return response.data[0];
    } catch (error) {
        console.error("Error fetching user stats", error);
        throw new Error("Could not fetch user stats.");
    }
}

// Function to submit new user stats to the backend
export async function addUserStats(userStats: UserStat): Promise<UserStat> {
    try {
        const response = await axios.post<UserStat>('/api/user/stats', userStats, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding user stats", error);
        throw new Error("Could not add user stats.");
    }
}

export async function fetchCalorieGoal(userStat: UserStat): Promise<number> {
    try {
        const response = await axios.post<number>('/api/user/stats/caloriegoal', userStat, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching calorie goal", error);
        throw new Error("Could not fetch calorie goal.");
    }
}

