// this class will be used to calculate the user stats and to set/update information like weight, height, age, calorie goal, activity level, date updated, and a unique identifier to map the user to the stats.
import UserStats from "../models/UserStats";
import { UserStat } from "../models/UserStats";

/*
1. Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
For men: BMR=10×weight (kg)+6.25×height (cm)−5×age (years)+5
For women: BMR=10×weight (kg)+6.25×height (cm)−5×age (years)−161

2. Calculate Total Daily Energy Expenditure (TDEE)
Multiply the BMR by an activity factor to get the TDEE:
Sedentary (little or no exercise): BMR × 1.2
Lightly active (light exercise/sports 1-3 days/week): BMR × 1.375
Moderately active (moderate exercise/sports 3-5 days/week): BMR × 1.55
Very active (hard exercise/sports 6-7 days a week): BMR × 1.725
Super active (very hard exercise/physical job & exercise 2x/day): BMR × 1.9

3. Adjust for Goal (Weight Loss, Maintenance, or Gain)
Weight Loss: Subtract 15-20% from TDEE.
Maintenance: Use TDEE as is.
Weight Gain: Add 10-20% to TDEE.

4. Macronutrient Distribution
Protein: 10-35% of total calories
Fat: 20-35% of total calories
Carbohydrates: 45-65% of total calories
Allow the user to customize these percentages based on the individual's goals (e.g., higher protein for muscle gain, higher fat for a ketogenic diet).

5. Calculate Macronutrient Goals
Protein: 4 calories per gram
Carbohydrates: 4 calories per gram
Fat: 9 calories per gram
Ex. If TDEE is 2500 calories and you want 30% from protein, that's 750 calories from protein
Divide by 4 to get the grams of protein: 750/4 = 187.5 grams

6. Adjust Based on Individual Needs
Metabolic conditions, personal preferences, or specific dietary restrictions
*/

/*
TODO: create end points for calculating and updating user stats (enter goal, enter activity level, enter weight, enter height, enter age, etc.)

1. once the user has entered their sex, weight, height, and age, then we can calculate BMR
2. Once we have BMR, we then ask for their activity level
3. Once we have activity level, we can then calculate TDEE -- which is their total daily energy expenditure
4. We now need to have the user enter their goal (weight loss, maintenance, or weight gain) -- this will determine what their calorie goal should be
5. After we have their calorie goal, we now allow the user to enter their desired macronutrient distribution with a starting recommended ration (35% protein, 20% fats, 45% carbs)
6. After we have their desired macronutrient distribution, then we calculate the macronutrient goals. For example, Protein: 4 calories per gram
Carbohydrates: 4 calories per gram
Fat: 9 calories per gram
Ex. If TDEE is 2500 calories and you want 30% from protein, that's 750 calories from protein
Divide by 4 to get the grams of protein: 750/4 = 187.5 grams

anytime that your weight, height, or age, changes -- BMR changes -- if BMR changes then tdee changes -- anytime tdee changes... then calorie goal changes -- anytime calorie goal changes, then macronutrient goals change
*/

export interface UserStats extends UserStat {
    tdee: number; // this would be the Total Daily Energy Expenditure
    bmr: number; // this would be the Basal Metabolic Rate -- the number of calories your body needs to function at rest
    age: number; // this would be the age of the user -- calculated from the date of birth
}

export class CalculateUserStats {
    private stats: UserStats;

    constructor(userStat: UserStat) {
        this.stats = userStat as UserStats;
        this.stats.age = this.calculateAge(this.stats.dateofbirth);
    }

    // Calculate BMR
    // if BMR changes, then TDEE changes, if TDEE changes, then calorie goal changes, if calorie goal changes, then macronutrient goals change
    public calculateBMR(): number {
        if (this.stats.sex === 1) { // if they are male
            this.stats.bmr = 10 * this.stats.weight + 6.25 * this.stats.height - 5 * this.stats.age + 5;
            return 10 * this.stats.weight + 6.25 * this.stats.height - 5 * this.stats.age + 5;
        } else { // if they are female
            this.stats.bmr = 10 * this.stats.weight + 6.25 * this.stats.height - 5 * this.stats.age - 161;
            return 10 * this.stats.weight + 6.25 * this.stats.height - 5 * this.stats.age - 161;
        }
    }

    // Calculate age based on date of birth
    private calculateAge(dateofbirth: Date): number {
        const today = new Date();
        const birthDate = new Date(dateofbirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();

        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    // Calculate TDEE
    // if TDEE changes, then calorie goal changes, if calorie goal changes, then macronutrient goals change
    public calculateTDEE(): number {
        let activityFactor: number;

        switch (this.stats.activitylevel) {
            case 1:
                activityFactor = 1.2;
                break;
            case 2:
                activityFactor = 1.375;
                break;
            case 3:
                activityFactor = 1.55;
                break;
            case 4:
                activityFactor = 1.725;
                break;
            case 5:
                activityFactor = 1.9;
                break;
            default:
                activityFactor = 1.2;
        }

        this.stats.tdee = this.stats.bmr * activityFactor;
        return this.stats.bmr * activityFactor;
    }

    // Adjust calorie goal based on user goal (weight loss, maintenance, or weight gain)
    // if user goal changes, then calorie goal changes, if calorie goal changes, then macronutrient goals change
    // TODO: allow the user to change the percentage of the adjustment -- for example, if they want to lose weight but only want to subtract 10% instead of 20%
    public calculateCalorieGoal(): number {
        this.calculateBMR();
        this.calculateTDEE();

        switch (this.stats.goal) {
            case 1:
            return Math.round(this.stats.tdee * 0.8); // Subtract 20% for weight loss
            case 2:
            return Math.round(this.stats.tdee); // Use TDEE as is for maintenance
            case 3:
            return Math.round(this.stats.tdee * 1.2); // Add 20% for weight gain
            default:
            return Math.round(this.stats.tdee);
        }
    }
}