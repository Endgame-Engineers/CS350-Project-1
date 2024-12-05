import { ActivityLog, Activity } from '../models/Models';
import { logger } from './Logger';
import axios from 'axios';

export interface ExtendedActivityLog {
    activityName: string;
    duration?: number;
    subActivity?: Activity;
}

export async function getActivityLogs(start?: Date, end?: Date): Promise<ActivityLog[]> {
    if (!(start instanceof Date) || isNaN(start.getTime()) || !(end instanceof Date) || isNaN(end.getTime())) {
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

export async function addActivityLog(activityLog: ActivityLog): Promise<ActivityLog> {
    const uri = '/api/user/activity';
    try {
        const response = await axios.post<ActivityLog>(uri, activityLog);
        logger.info('Activity log added');
        return response.data;
    } catch (error) {
        logger.error('Error adding activity log', error);
        throw new Error("Could not add activity log.");
    }
}

export async function deleteActivityLog(id: number): Promise<void> {
    const uri = `/api/user/activity/${id}`;
    try {
        await axios.delete(uri);
        logger.info('Activity log deleted');
    } catch (error) {
        logger.error('Error deleting activity log', error);
        throw new Error("Could not delete activity log.");
    }
}

export async function getActivities(): Promise<Activity[]> {
    const uri = '/api/user/activities';
    try {
        const response = await axios.get<Activity[]>(uri);

        logger.info('Activities retrieved');
        return response.data;
    } catch (error) {
        logger.error('Error getting activities', error);
        throw new Error("Could not get activities.");
    }
}
