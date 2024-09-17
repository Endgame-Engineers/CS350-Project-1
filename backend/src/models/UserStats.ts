import ConnectToDB from "../utils/ConnectToDB";;

export interface UserStat {
    providerid: string;
    height: number;
    weight: number;
    caloriegoal: number;
    activitylevel: number;
    age: number;
    sex: string;
}

class UserStats {
    private client: any;

    constructor() {
        this.client = ConnectToDB.getClient();
    }

    async getUserStats(providerid: string): Promise<UserStat> {
        const result = await (await this.client).query('SELECT * FROM "UserStats" WHERE providerid = $1', [providerid]);
        return result.rows[0];
    }

    async addUserStats(userStats: UserStat): Promise<void> {
        await (await this.client).query(
            'INSERT INTO "UserStats" (providerid, height, weight, caloriegoal, activitylevel, age, sex) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [userStats.providerid, userStats.height, userStats.weight, userStats.caloriegoal, userStats.activitylevel, userStats.age, userStats.sex]
        );
    }

    async updateUserStats(providerid: string, height: number, weight: number, caloriegoal: number, activitylevel: number, age: number, sex: string): Promise<void> {
        await (await this.client).query(
            'UPDATE "UserStats" SET height = $1, weight = $2, caloriegoal = $3, activitylevel = $4, age = $5, sex = $6 WHERE providerid = $7',
            [height, weight, caloriegoal, activitylevel, age, sex, providerid]
        );
    }   
}

export default new UserStats();