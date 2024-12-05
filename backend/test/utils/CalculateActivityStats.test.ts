// TODO: Daniel

import { CalculateActivityLogs } from '../../src/utils/CalculateActivityStats';
import { ActivityLog, Activity } from '../../src/models/ActivityLogs';
import { UserStat } from '../../src/models/UserStats';

describe('CalculateActivityLogs', () => {
    it('calculates calories burned correctly for running', () => {
        const activityLog: ActivityLog = {
            userid: 1,
            activityid: 1,
            durationminutes: 30,
            dateadded: new Date(),
        };

        const activity: Activity = {
            activity: 'Running at 8 km/h',
            MET: 8.3,
            description: 'Running at a moderate pace of 8 km/h',
        };

        const userStat: UserStat = {
            userid: 1,
            weight: 150,
            height: 70,
            dateofbirth: new Date('1990-01-01'),
            sex: 1,
            activitylevel: 2,
            goal: 1,
            proteinpercentage: 30,
            fatpercentage: 20,
            carbpercentage: 50,
            caloriegoal: 0,
            watergoal: 0,
            proteingrams: 0,
            fatgrams: 0,
            carbgrams: 0,
            updatedon: new Date(),
        };

        const calculateActivityLogs = new CalculateActivityLogs(activityLog, activity, userStat);
        
        // expected calories burned calculation
        const weightKgs = 150 * 0.453592; // convert lbs to kgs
        const expectedCaloriesBurned = 8.3 * weightKgs * (30 / 60); // MET * weight (kg) * hours

        const result = calculateActivityLogs.calculateCaloriesBurned();

        expect(result).toBeCloseTo(expectedCaloriesBurned, 2);
    });

    it('calculates calories burned correctly for cycling', () => {
        const activityLog: ActivityLog = {
            userid: 2,
            activityid: 2,
            durationminutes: 60,
            dateadded: new Date(),
        };

        const activity: Activity = {
            activity: 'Cycling at 16-19 km/h',
            MET: 6.8,
            description: 'Cycling at a moderate pace of 16-19 km/h',
        };

        const userStat: UserStat = {
            userid: 2,
            weight: 180,
            height: 72,
            dateofbirth: new Date('1985-01-01'),
            sex: 1,
            activitylevel: 3,
            goal: 2,
            proteinpercentage: 25,
            fatpercentage: 30,
            carbpercentage: 45,
            caloriegoal: 2500,
            watergoal: 3000,
            proteingrams: 0,
            fatgrams: 0,
            carbgrams: 0,
            updatedon: new Date(),
        };

        const calculateActivityLogs = new CalculateActivityLogs(activityLog, activity, userStat);
        
        // expected calories burned calculation
        const weightKgs = 180 * 0.453592; // convert lbs to kgs
        const expectedCaloriesBurned = 6.8 * weightKgs * (60 / 60); // MET * weight (kg) * hours

        const result = calculateActivityLogs.calculateCaloriesBurned();

        expect(result).toBeCloseTo(expectedCaloriesBurned, 2);
    });

    it('calculates zero calories burned for zero duration', () => {
        const activityLog: ActivityLog = {
            userid: 3,
            activityid: 3,
            durationminutes: 0, // no activity duration
            dateadded: new Date()
        };

        const activity: Activity = {
            activity: 'Walking at a moderate pace',
            MET: 5.0, 
            description: 'Walking at a moderate pace',
        };

        const userStat: UserStat = {
            userid: 3,
            weight: 140,
            height: 65,
            dateofbirth: new Date('1995-01-01'),
            sex: 2,
            activitylevel: 1,
            goal: 3,
            proteinpercentage: 20,
            fatpercentage: 35,
            carbpercentage: 45,
            caloriegoal: 2000,
            watergoal: 2500,
            proteingrams: 0,
            fatgrams: 0,
            carbgrams: 0,
            updatedon: new Date(),
        };

        const calculateActivityLogs = new CalculateActivityLogs(activityLog, activity, userStat);
        
        // expected calories burned calculation
        const expectedCaloriesBurned = 0; // zero duration should yield zero calories

        const result = calculateActivityLogs.calculateCaloriesBurned();

        expect(result).toBe(expectedCaloriesBurned);
    });
});
