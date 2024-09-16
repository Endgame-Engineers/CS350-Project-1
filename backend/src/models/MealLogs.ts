import ConnectToDB from "../utils/ConnectToDB";

export interface MealLog {
    uuid: string;
    date_added: Date;
    barcode: string;
    userid: string;
    servingconsumed: number;
}

class MealLogs {
    private client: any;

   constructor() {
        this.client = ConnectToDB.getClient();
    }

    async getMealLogs(userid: string): Promise<any> {
        const result = (await this.client).query('SELECT * FROM "MealLogs" WHERE userid = $1', [userid]);
        return result.rows;
    }

    async getMealLog(userid: string, start: Date, end: Date): Promise<any> {
        const result = (await this.client).query('SELECT * FROM "MealLogs" WHERE userid = $1 AND date_added BETWEEN $2 AND $3', [userid, start, end]);
        return result.rows;
    }

    async addMealLog(mealLog: MealLog): Promise<void> {
        (await this.client).query(
            'INSERT INTO "MealLogs" (uuid, date_added, barcode, userid, servingconsumed) VALUES ($1, $2, $3, $4, $5)',
            [mealLog.uuid, mealLog.date_added, mealLog.barcode, mealLog.userid, mealLog.servingconsumed]
        );
    }

    async updateMealLogItem(userid: string, barcode: string, servingconsumed: number, date_added: Date): Promise<void> {
        (await this.client).query(
            'UPDATE "MealLogs" SET servingconsumed = $1 WHERE userid = $2 AND barcode = $3 AND date_added = $4',
            [servingconsumed, userid, barcode, date_added]
        );
    }
}

export default new MealLogs();