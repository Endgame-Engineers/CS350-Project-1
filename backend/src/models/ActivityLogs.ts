import ConnectToDB from "../utils/ConnectToDB";
import { logger } from "../utils/Logging";

export interface HealthLog {
    dateadded: Date;
    userid: number;
    caloruiesburned: number;
    steps: number;
    heartrate: number;
}

class HealthLogs {
    private client: any;

    constructor() {
        this.client = ConnectToDB.getClient();
    }


    async getHealthLogs(userid: number, start?: Date, end?: Date): Promise<any> {
        logger.info('Fetching health logs from database');
        let query = 'SELECT * FROM "HealthLogs" WHERE userid = $1';
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

        logger.info('Returning health logs');
        return result.rows;
    }

    async addHealthLog(healthLog: HealthLog): Promise<void> {
        logger.info('Adding health log to database');
        await (await this.client).query(
            'INSERT INTO "HealthLogs" (dateadded, userid, caloriesburned, steps, heartrate) VALUES ($1, $2, $3, $4, $5)',
            [healthLog.dateadded, healthLog.userid, healthLog.caloruiesburned, healthLog.steps, healthLog.heartrate]
        );
        logger.info('Health log added to database');
    }

    async deleteHealthLog(userid: number, dateadded: Date): Promise<void> {
        logger.info('Deleting health log from database');
        await (await this.client).query(
            'DELETE FROM "HealthLogs" WHERE userid = $1 AND dateadded = $2',
            [userid, dateadded]
        );
        logger.info('Health log deleted from database');
    }
}

export default new HealthLogs();