import ConnectToDB from "../utils/ConnectToDB";
import { logger } from "../utils/Logging";

export interface ActivityLog {
    dateadded: Date;
    userid: number;
    activityid: number;
    durationminutes: number;
}

export interface Activity {
    activity: string;
    MET: number;
    description: string;
}

class ActivityLogs {
    private client: any;

    constructor() {
        this.client = ConnectToDB.getClient();
    }


    async getActivityLogs(userid: number, start?: Date, end?: Date): Promise<any> {
        logger.info('Fetching health logs from database');
        let query = 'SELECT * FROM "ActivityLogs" WHERE userid = $1';
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

    async addActivityLog(ActivityLog: ActivityLog): Promise<void> {
        logger.info('Adding health log to database');
        await (await this.client).query(
            'INSERT INTO "ActivityLogs" (dateadded, userid, activityid, durationminutes) VALUES ($1, $2, $3, $4)',
            [ActivityLog.dateadded, ActivityLog.userid, ActivityLog.activityid, ActivityLog.durationminutes]
        );
        logger.info('Health log added to database');
    }

    async deleteActivityLog(userid: number, dateadded: Date): Promise<void> {
        logger.info('Deleting health log from database');
        await (await this.client).query(
            'DELETE FROM "ActivityLogs" WHERE userid = $1 AND dateadded = $2',
            [userid, dateadded]
        );
        logger.info('Health log deleted from database');
    }

    async getActivities(): Promise<any> {
        logger.info('Fetching activities from database');
        const result = await (await this.client).query('SELECT * FROM "Activities"');
        logger.info('Returning activities');
        return result.rows;
    }

    async getActivity(activityid: number): Promise<any> {
        logger.info('Fetching activity from database');
        const result = await (await this.client).query('SELECT * FROM "Activities" WHERE id = $1', [activityid]);
        logger.info('Returning activity');
        return result.rows[0];
    }

    async doesActivityExist(activityid: number): Promise<boolean> {
        logger.info('Checking if activity exists in database');
        const result = await (await this.client).query('SELECT * FROM "Activities" WHERE id = $1', [activityid]);
        logger.info('Returning if activity exists');
        return result.rowCount > 0;
    }
}

export default new ActivityLogs();