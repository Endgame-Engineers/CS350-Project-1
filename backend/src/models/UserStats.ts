import ConnectToDB from "../utils/ConnectToDB";;

export interface UserStat {
    userid: number;
    height: number;
    weight: number;
    goal: number;
    caloriegoal: number;
    activitylevel: number;
    proteinPercentage: number;
    fatPercentage: number;
    carbPercentage: number;
    proteinGrams: number;
    fatGrams: number;
    carbGrams: number;
    age: number;
    sex: number;
    dateofbirth: Date;
    updatedon: Date;
}

class UserStats {
    private client: any;

    constructor() {
        this.client = ConnectToDB.getClient();
    }

    async getUserStats(id: number): Promise<UserStat[]> {
        const query = 'SELECT * FROM "UserStats" WHERE userid = $1 ORDER BY updatedon';
        const result = await (await this.client).query(query, [id]);
        return result.rows;
    }

    async addUserStats(userStats: UserStat, userid: number): Promise<boolean> {
        if (userStats !== undefined && userStats !== null) {
            const query = `
            INSERT INTO "UserStats" (userid, height, weight, caloriegoal, activitylevel, age, sex, dateofbirth, updatedon)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;
            const values = [
                userid,
                userStats.height,
                userStats.weight,
                userStats.caloriegoal,
                userStats.activitylevel,
                userStats.age,
                userStats.sex,
                userStats.dateofbirth || null,
                userStats.updatedon || null
            ];
            await (await this.client).query(query, values);
            return true;
        } else {
            return false;
        }
    }

    async updateUserStats(userid: number, height: number, weight: number, caloriegoal: number, activitylevel: number, age: number, sex: string): Promise<void> {
        await (await this.client).query(
            'UPDATE "UserStats" SET height = $1, weight = $2, caloriegoal = $3, activitylevel = $4, age = $5, sex = $6 WHERE userid = $7',
            [height, weight, caloriegoal, activitylevel, age, sex, userid]
        );
    }
}

export default new UserStats();