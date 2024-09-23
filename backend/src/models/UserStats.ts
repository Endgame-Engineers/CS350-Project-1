import ConnectToDB from "../utils/ConnectToDB";;

export interface UserStat {
    userid: number;
    height: number;
    weight: number;
    caloriegoal: number;
    activitylevel: number;
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

    async getUserStats(id: number): Promise<UserStat> {
        const result = await (await this.client).query('SELECT * FROM "UserStats" WHERE userid = $1', [id]);
        return result.rows;
    }

    async addUserStats(userStats: UserStat): Promise<void> {
        await (await this.client).query(
            'INSERT INTO "UserStats" (userid, height, weight, caloriegoal, activitylevel, age, sex) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [userStats.userid, userStats.height, userStats.weight, userStats.caloriegoal, userStats.activitylevel, userStats.age, userStats.sex]
        );
    }

    async updateUserStats(userid: number, height: number, weight: number, caloriegoal: number, activitylevel: number, age: number, sex: string): Promise<void> {
        await (await this.client).query(
            'UPDATE "UserStats" SET height = $1, weight = $2, caloriegoal = $3, activitylevel = $4, age = $5, sex = $6 WHERE userid = $7',
            [height, weight, caloriegoal, activitylevel, age, sex, userid]
        );
    }   
}

export default new UserStats();