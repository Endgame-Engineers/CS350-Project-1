import ConnectToDB from "../utils/ConnectToDB";

export interface MealLog {
    mealtype: string;
    dateadded: Date;
    barcode: string;
    userid: number;
    servingconsumed: number;
}

class MealLogs {
    private client: any;

   constructor() {
        this.client = ConnectToDB.getClient();
    }

    async getMealLogs(userid: number): Promise<any> {
        const result = await (await this.client).query('SELECT * FROM "MealLogs" WHERE userid = $1', [userid]);
        return result.rows;
    }

    async getMealLog(userid: number, start: Date, end: Date): Promise<any> {
        const result = await (await this.client).query(
            `SELECT * FROM "MealLogs" WHERE userid = $1 AND DATE(dateadded) BETWEEN DATE($2) AND DATE($3) ORDER BY dateadded`,
            [userid, start, end]
        );
        return result.rows;
    }

    async addMealLog(mealLog: MealLog): Promise<void> {
        await (await this.client).query(
            'INSERT INTO "MealLogs" (mealtype, dateadded, barcode, userid, servingconsumed) VALUES ($1, $2, $3, $4, $5)',
            [mealLog.mealtype, mealLog.dateadded, mealLog.barcode, mealLog.userid, mealLog.servingconsumed]
        );
    }

    async updateMealLogItem(userid: number, barcode: string, servingconsumed: number, dateadded: Date): Promise<void> {
        await (await this.client).query(
            'UPDATE "MealLogs" SET servingconsumed = $1 WHERE userid = $2 AND barcode = $3 AND dateadded = $4',
            [servingconsumed, userid, barcode, dateadded]
        );
    }
}

export default new MealLogs();