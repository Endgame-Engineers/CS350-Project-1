import ConnectToDB from "../utils/ConnectToDB";;

export interface UserStat {
    userid: number;
    height: number;
    weight: number;
    goal: number;
    caloriegoal: number;
    activitylevel: number;
    proteinpercentage: number;
    fatpercentage: number;
    carbpercentage: number;
    proteingrams: number;
    fatgrams: number;
    carbgrams: number;
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
        const query = 'SELECT * FROM "UserStats" WHERE userid = $1 ORDER BY updatedon DESC';
        const result = await (await this.client).query(query, [id]);
        return result.rows;
    }

    async addUserStats(userStats: UserStat, userid: number): Promise<boolean> {
        if (userStats !== undefined && userStats !== null) {
            const query = 'INSERT INTO "UserStats" (userid, height, weight, goal, caloriegoal, activitylevel, proteinpercentage, fatpercentage, carbpercentage, proteingrams, fatgrams, carbgrams, sex, dateofbirth, updatedon) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())';
            const values = [userid, userStats.height, userStats.weight, userStats.goal, userStats.caloriegoal, userStats.activitylevel, userStats.proteinpercentage, userStats.fatpercentage, userStats.carbpercentage, userStats.proteingrams, userStats.fatgrams, userStats.carbgrams, userStats.sex, userStats.dateofbirth];
            await (await this.client).query(query, values);
            return true;
        }
        return false;
    }
}

export default new UserStats();