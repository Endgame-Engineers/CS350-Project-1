import ConnectToDB from "../utils/ConnectToDB";;

export interface UserStat {
    userid: number;
    height: number;
    weight: number;
    goal: number;
    caloriegoal: number;
    watergoal: number;
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

    async getUserStat(id: number): Promise<UserStat> {
        const query = 'SELECT * FROM "UserStats" WHERE userid = $1 ORDER BY updatedon DESC LIMIT 1';
        const result = await (await this.client).query(query, [id]);
        return result.rows[0];
    }

    async addUserStats(userStats: UserStat, userid: number): Promise<boolean> {
        if (userStats !== undefined && userStats !== null) {
            // Check if macronutrient percentages add up to 100%
            const totalPercentage = userStats.proteinpercentage + userStats.fatpercentage + userStats.carbpercentage;
            if (totalPercentage !== 100) {
                throw new Error('Macronutrient percentages must add up to 100%');
            }
            
            const fetchQuery = 'SELECT * FROM "UserStats" WHERE userid = $1 ORDER BY updatedon DESC LIMIT 1';
            const fetchValues = [userid];
            const result = await (await this.client).query(fetchQuery, fetchValues);
    
            if (result.rows.length > 0) {
                const latestRecord = result.rows[0];

                // convert date to string so that when we compare them they are in the same format. Without this, the comparison will always return false
                const latestRecordDateOfBirth = new Date(latestRecord.dateofbirth).toISOString().split('T')[0];
                const userStatsDateOfBirth = new Date(userStats.dateofbirth).toISOString().split('T')[0];
    
                const isSame = latestRecord.height === userStats.height &&
                    latestRecord.weight === userStats.weight &&
                    latestRecord.goal === userStats.goal &&
                    latestRecord.caloriegoal === userStats.caloriegoal &&
                    latestRecord.watergoal === userStats.watergoal &&
                    latestRecord.activitylevel === userStats.activitylevel &&
                    latestRecord.proteinpercentage === userStats.proteinpercentage &&
                    latestRecord.fatpercentage === userStats.fatpercentage &&
                    latestRecord.carbpercentage === userStats.carbpercentage &&
                    latestRecord.proteingrams === userStats.proteingrams &&
                    latestRecord.fatgrams === userStats.fatgrams &&
                    latestRecord.carbgrams === userStats.carbgrams &&
                    latestRecord.sex === userStats.sex &&
                    latestRecordDateOfBirth === userStatsDateOfBirth;
                if (isSame) {
                    return false;
                }
            }
    
            const query = 'INSERT INTO "UserStats" (userid, height, weight, goal, caloriegoal, watergoal, activitylevel, proteinpercentage, fatpercentage, carbpercentage, proteingrams, fatgrams, carbgrams, sex, dateofbirth, updatedon) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())';
            const values = [userid, userStats.height, userStats.weight, userStats.goal, userStats.caloriegoal, userStats.watergoal, userStats.activitylevel, userStats.proteinpercentage, userStats.fatpercentage, userStats.carbpercentage, userStats.proteingrams, userStats.fatgrams, userStats.carbgrams, userStats.sex, userStats.dateofbirth];
            await (await this.client).query(query, values);
            return true;
        }
        return false;
    }
}
export default new UserStats();