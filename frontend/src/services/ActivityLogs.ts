import { ActivityLog } from '../models/Models';
import { logger } from './Logger';
import axios from 'axios';

export async function getActivityLogs(start?: Date, end?: Date): Promise<ActivityLog[]> {
    if (!(start instanceof Date) || !(end instanceof Date)) {
        logger.error('Invalid date objects');
        return Promise.reject(new Error('Invalid date objects'));
    }

    const uri = '/api/user/activity';
    try {
        const response = await axios.get<ActivityLog[]>(uri, {
            params: {
                start: start,
                end: end
            }
        });
        logger.info('Meal logs retrieved');
        return response.data
            .sort(
                (a: ActivityLog, b: ActivityLog) =>
                    new Date(b.dateadded ?? 0).getTime() -
                    new Date(a.dateadded ?? 0).getTime()
            );
    } catch (error) {
        logger.error('Error getting meal logs', error);
        throw new Error("Could not get meal logs.");
    }
}
