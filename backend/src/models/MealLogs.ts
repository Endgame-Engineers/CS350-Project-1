import ConnectToDB from "../utils/ConnectToDB";
import { logger } from "../utils/Logging";

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Water' | 'Recipe';

export interface MealLog {
    mealtype: MealType;
    dateadded: Date;
    barcode: string;
    userid: number;
    servingconsumed: number;
}

function isValidMealLog(mealLog: MealLog): mealLog is MealLog {
    const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Water'];
    return mealTypes.includes(mealLog.mealtype) && mealLog.servingconsumed > 0;
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
            if (start.getTime() === end.getTime()) {
                query += ' AND DATE(dateadded) = DATE($2) ORDER BY dateadded';
                params.push(start);
            } else {
                query += ' AND DATE(dateadded) BETWEEN DATE($2) AND DATE($3) ORDER BY dateadded';
                params.push(start, end);
            }
        }

        logger.info('Querying database');
        const result = await (await this.client).query(query, params);

        logger.info('Returning meal logs');
        return result.rows;
    }

    async addMealLog(mealLog: MealLog): Promise<void> {

        if (!isValidMealLog(mealLog)) {
            throw new Error('Invalid meal log');
        }

        logger.info('Adding meal log to database');
        await (await this.client).query(
            'INSERT INTO "MealLogs" (mealtype, dateadded, barcode, userid, servingconsumed) VALUES ($1, $2, $3, $4, $5)',
            [mealLog.mealtype, mealLog.dateadded, mealLog.barcode, mealLog.userid, mealLog.servingconsumed]
        );
        logger.info('Meal log added to database');
    }

    async deleteMealLog(id: number, userid: number): Promise<void> {
        logger.info('Deleting meal log from database');
        try {
            await (await this.client).query(
                'DELETE FROM "MealLogs" WHERE userid = $1 AND id = $2',
                [userid, id]
            );
            logger.info('Meal log deleted from database');
        } catch (error) {
            logger.error('Error deleting meal log from database:', error);
            throw new Error('Failed to delete meal log');
        }
    }
}

export default new MealLogs();