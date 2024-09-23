import { UserStat } from "@/models/Models";
import axios from "axios";


export async function getUserStats(): Promise<UserStat> {
    const response = await axios.get('/api/user/stats');
    return response.data;
}

export async function addUserStats(userStats: UserStat): Promise<UserStat> {
    const response = await axios.post('/api/user/stats', userStats);
    return response.data;
}