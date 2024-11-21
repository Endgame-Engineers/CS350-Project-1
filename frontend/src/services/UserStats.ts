import { UserStat, ErrorMessage } from "../models/Models";
import { ref } from "vue";
import axios from "axios";


export interface ProfileStats extends UserStat {
    [x: string]: any;
    recommendedcaloriegoal?: number;
    Error?: string;
}

export const userStats = ref<ProfileStats>({
    weight: null,
    height: null,
    caloriegoal: null,
    watergoal: null,
    dateofbirth: new Date(),
    activitylevel: 1,
    sex: 1,
    updatedon: new Date(),
    goal: 1,
    proteinpercentage: 0,
    fatpercentage: 0,
    carbpercentage: 0,
    proteingrams: 0,
    fatgrams: 0,
    carbgrams: 0,
    recommendedcaloriegoal: 0
});

// Function to fetch user stats from the backend
export async function getUserStats(): Promise<UserStat[]> {
    try {
        const response = await axios.get<UserStat[]>('/api/user/stats');
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
export async function fetchwaterGoal(userStat: UserStat): Promise<number> {
    try {
        const response = await axios.post<number>('/api/user/stats/watergoal', userStat, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching water goal", error);
        throw new Error("Could not fetch Water goal.");
    }
}
