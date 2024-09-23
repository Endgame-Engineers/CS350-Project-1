import { UserStat } from "@/models/Models";
import axios from "axios";

export default class UserStatsService {
    public static async getUserStats(): Promise<UserStat> {
        const response = await axios.get('/user/stats');
        return response.data;
    }

    public static async addUserStats(userStats: UserStat): Promise<UserStat> {
        const response = await axios.post('/user/stats', userStats);
        return response.data;
    }
}