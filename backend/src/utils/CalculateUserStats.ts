// this class will be used to calculate the user stats and to set/update information like weight, height, age, calorie goal, activity level, date updated, and a unique identifier to map the user to the stats.

import UserStats from "../models/UserStats";

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

interface UserStats {
    weight: number; // in kg -- would be nice to have this in lbs as well for our American friends
    height: number; // in cm -- would be nice to have this in inches as well for our American friends
    age: number;
    gender: 'male' | 'female';
    activityLevel: 'sedentary' | 'lightly active' | 'moderately active' | 'very active' | 'super active';
    goal: 'weight loss' | 'maintenance' | 'weight gain';
    tdee: number; // this would be the Total Daily Energy Expenditure
    calorieGoal: number; // this would be the adjusted calories based on the goal
    proteinPercentage?: number;
    fatPercentage?: number;
    carbPercentage?: number;
    lastUpdated: Date;
}

class CalculateUserStats {
    private weight: number;
    private height: number;
    private age: number;
    private gender: 'male' | 'female';
    private activityLevel: 'sedentary' | 'lightly active' | 'moderately active' | 'very active' | 'super active';
    private goal: 'weight loss' | 'maintenance' | 'weight gain';
    private tdee: number;
    private calorieGoal: number;
    private proteinPercentage: number;
    private fatPercentage: number;
    private carbPercentage: number;
    private lastUpdated: Date;

    constructor(userStats: UserStats) {
        this.weight = userStats.weight;
        this.height = userStats.height;
        this.age = userStats.age;
        this.gender = userStats.gender;
        this.activityLevel = userStats.activityLevel;
        this.goal = userStats.goal;
        this.tdee = userStats.tdee;
        this.proteinPercentage = userStats.proteinPercentage || 15;
        this.fatPercentage = userStats.fatPercentage || 30;
        this.carbPercentage = userStats.carbPercentage || 55;
        this.calorieGoal = userStats.calorieGoal;
        this.lastUpdated = new Date();
    }

    // Calculate BMR
    private calculateBMR(): number {
        if (this.gender === 'male') {
            return 10 * this.weight + 6.25 * this.height - 5 * this.age + 5;
        } else {
            return 10 * this.weight + 6.25 * this.height - 5 * this.age - 161;
        }
    }

    // Calculate TDEE
    private calculateTDEE(): number {
        const bmr = this.calculateBMR();
        let activityFactor: number;

        switch (this.activityLevel) {
            case 'sedentary':
                activityFactor = 1.2;
                break;
            case 'lightly active':
                activityFactor = 1.375;
                break;
            case 'moderately active':
                activityFactor = 1.55;
                break;
            case 'very active':
                activityFactor = 1.725;
                break;
            case 'super active':
                activityFactor = 1.9;
                break;
            default:
                activityFactor = 1.2;
        }

        return bmr * activityFactor;
    }

    // Adjust calorie goal based on user goal (weight loss, maintenance, or weight gain)
    private adjustForGoal(tdee: number): number {
        switch (this.goal) {
            case 'weight loss':
                return tdee * 0.8; // Subtract 20% for weight loss
            case 'maintenance':
                return tdee; // Use TDEE as is
            case 'weight gain':
                return tdee * 1.2; // Add 20% for weight gain
            default:
                return tdee;
        }
    }

    // Calculate macronutrient goals
    private calculateMacronutrientGoals(calories: number): { protein: number, fat: number, carbs: number } {
        const proteinCalories = (this.proteinPercentage / 100) * calories;
        const fatCalories = (this.fatPercentage / 100) * calories;
        const carbCalories = (this.carbPercentage / 100) * calories;

        return {
            protein: proteinCalories / 4, // 4 calories per gram of protein
            fat: fatCalories / 9, // 9 calories per gram of fat
            carbs: carbCalories / 4 // 4 calories per gram of carbs
        };
    }

    // Method to refresh all dependent stats when a key attribute (weight, height, age, etc.) changes
    public refreshStats(): void {
        this.tdee = this.calculateTDEE();
        this.calorieGoal = this.adjustForGoal(this.tdee);
        const macronutrients = this.calculateMacronutrientGoals(this.calorieGoal);
        this.lastUpdated = new Date();

        console.log('Updated Stats:', {
            bmr: this.calculateBMR(),
            tdee: this.tdee,
            calorieGoal: this.calorieGoal,
            macronutrients,
            lastUpdated: this.lastUpdated
        });
    }

    // Update methods that call refreshStats to recalculate all dependent values
    public updateWeight(weight: number): void {
        this.weight = weight;
        this.refreshStats();
    }

    public updateHeight(height: number): void {
        this.height = height;
        this.refreshStats();
    }

    public updateAge(age: number): void {
        this.age = age;
        this.refreshStats();
    }

    public updateActivityLevel(activityLevel: 'sedentary' | 'lightly active' | 'moderately active' | 'very active' | 'super active'): void {
        this.activityLevel = activityLevel;
        this.refreshStats();
    }

    public updateGoal(goal: 'weight loss' | 'maintenance' | 'weight gain'): void {
        this.goal = goal;
        this.refreshStats();
    }

    public updateMacronutrientGoals(proteinPercentage: number, fatPercentage: number, carbPercentage: number): void {
        this.proteinPercentage = proteinPercentage;
        this.fatPercentage = fatPercentage;
        this.carbPercentage = carbPercentage;
        this.refreshStats();
    }

    // This would return the latest calculated user stats
    public calculateUserStats(): { bmr: number, tdee: number, adjustedCalories: number, macronutrients: { protein: number, fat: number, carbs: number }, lastUpdated: Date } {
        return {
            bmr: this.calculateBMR(),
            tdee: this.tdee,
            adjustedCalories: this.calorieGoal,
            macronutrients: this.calculateMacronutrientGoals(this.calorieGoal),
            lastUpdated: this.lastUpdated
        };
    }
}