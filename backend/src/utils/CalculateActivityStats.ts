import { ActivityLog, Activity } from '../models/ActivityLogs';
import { UserStat } from '../models/UserStats';

export class CalculateActivityLogs {
    private activityLog: ActivityLog;
    private activity: Activity;
    private weightkgs: number;

    constructor(activityLog: ActivityLog, activity: Activity, userStat: UserStat) {
        this.activityLog = activityLog;
        this.activity = activity;
        this.weightkgs = userStat.weight * 0.453592; 
    }

    // Calculate calories burned from activity
    public calculateCaloriesBurned(): number {
        const caloriesBurned = this.activity.MET * this.weightkgs * (this.activityLog.durationminutes / 60);
        return caloriesBurned;
    }
}
