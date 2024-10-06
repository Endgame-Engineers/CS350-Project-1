import ConnectToDB from "../utils/ConnectToDB";
import { logger } from "../utils/Logging";

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

    async getMealLogs(userid: number, start?: Date, end?: Date): Promise<any> {
        logger.info('Fetching meal logs from database');
        let query = 'SELECT * FROM "MealLogs" WHERE userid = $1';
        const params: any[] = [userid];

        if (start && end) {
            logger.info('Using date range');
            query += ' AND DATE(dateadded) BETWEEN DATE($2) AND DATE($3) + INTERVAL \'1 day\' ORDER BY dateadded';
            params.push(start, end);
        }

        logger.info('Querying database');
        const result = await (await this.client).query(query, params);

        logger.info('Returning meal logs');
        return result.rows;
    }

    async addMealLog(mealLog: MealLog): Promise<void> {
        logger.info('Adding meal log to database');
        await (await this.client).query(
            'INSERT INTO "MealLogs" (mealtype, dateadded, barcode, userid, servingconsumed) VALUES ($1, $2, $3, $4, $5)',
            [mealLog.mealtype, mealLog.dateadded, mealLog.barcode, mealLog.userid, mealLog.servingconsumed]
        );
        logger.info('Meal log added to database');
    }

    async deleteMealLog(mealLog: MealLog): Promise<void> {
        logger.info('Deleting meal log from database');
        try {
            await (await this.client).query(
                'DELETE FROM "MealLogs" WHERE userid = $1 AND dateadded = $2 and mealtype = $3 and barcode = $4 and servingconsumed = $5', 
                [mealLog.userid, mealLog.dateadded, mealLog.mealtype, mealLog.barcode, mealLog.servingconsumed]
            );
            logger.info('Meal log deleted from database');
        } catch (error) {
            logger.error('Error deleting meal log from database:', error);
            throw new Error('Failed to delete meal log');
        }
    }
}

export default new MealLogs();