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
    sex: 'male' | 'female';
    activityLevel: 'sedentary' | 'lightly active' | 'moderately active' | 'very active' | 'super active';
    goal: 'weight loss' | 'maintenance' | 'weight gain';
    tdee: number; // this would be the Total Daily Energy Expenditure
    bmr: number; // this would be the Basal Metabolic Rate -- the number of calories your body needs to function at rest
    calorieGoal: number; // this would be the adjusted calories based on the goal
    proteinPercentage: number;
    fatPercentage: number;
    carbPercentage: number;
    proteinGrams: number;
    fatGrams: number;
    carbGrams: number;
    lastUpdated: Date;
}

class CalculateUserStats {
    private weight: number;
    private height: number;
    private age: number;
    private sex: 'male' | 'female';
    private activityLevel: 'sedentary' | 'lightly active' | 'moderately active' | 'very active' | 'super active';
    private goal: 'weight loss' | 'maintenance' | 'weight gain';
    private tdee: number;
    private bmr: number;
    private calorieGoal: number;
    private proteinPercentage: number; // percentage of total calories that come from protein
    private fatPercentage: number; // percentage of total calories that come from fat
    private carbPercentage: number; // percentage of total calories that come from carbs
    private proteinGrams: number; // this would be the calculated protein grams based on the protein percentage
    private fatGrams: number; // this would be the calculated fat grams based on the fat percentage
    private carbGrams: number; // this would be the calculated carb grams based on the carb percentage
    private lastUpdated: Date;

    constructor(userStats: UserStats) {
        this.weight = userStats.weight;
        this.height = userStats.height;
        this.age = userStats.age;
        this.sex = userStats.sex;
        this.activityLevel = userStats.activityLevel;
        this.goal = userStats.goal;
        this.tdee = userStats.tdee;
        this.bmr = userStats.bmr;
        this.calorieGoal = userStats.calorieGoal;
        this.proteinPercentage = userStats.proteinPercentage;
        this.fatPercentage = userStats.fatPercentage;
        this.carbPercentage = userStats.carbPercentage;
        this.proteinGrams = userStats.proteinGrams;
        this.fatGrams = userStats.fatGrams;
        this.carbGrams = userStats.carbGrams;
        this.lastUpdated = new Date();
    }

    // Calculate BMR
    // if BMR changes, then TDEE changes, if TDEE changes, then calorie goal changes, if calorie goal changes, then macronutrient goals change
    private calculateBMR(): number {
        if (this.sex === 'male') {
            return 10 * this.weight + 6.25 * this.height - 5 * this.age + 5;
        } else {
            return 10 * this.weight + 6.25 * this.height - 5 * this.age - 161;
        }
    }

    // Calculate TDEE
    // if TDEE changes, then calorie goal changes, if calorie goal changes, then macronutrient goals change
    private calculateTDEE(): number {
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

        return this.bmr * activityFactor;
    }

    // Adjust calorie goal based on user goal (weight loss, maintenance, or weight gain)
    // if user goal changes, then calorie goal changes, if calorie goal changes, then macronutrient goals change
    // TODO: allow the user to change the percentage of the adjustment -- for example, if they want to lose weight but only want to subtract 10% instead of 20%
    private calculateCalorieGoal(tdee: number): number {
        switch (this.goal) {
            case 'weight loss':
                return tdee * 0.8; // Subtract 20% for weight loss
            case 'maintenance':
                return tdee; // Use TDEE as is for maintenance
            case 'weight gain':
                return tdee * 1.2; // Add 20% for weight gain
            default:
                return tdee;
        }
    }

    // Calculate macronutrient goals -- how many grams of protein, fat, and carbs the user should consume
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

    // Method to refresh all dependent stats when a key attribute (weight, height, age, etc.) changes -- this will be particularly useful for the frontend so that they don't have to worry about recalculating everything and only need to worry about updating the specific attribute
    private refreshStats(): void { 
        // TODO: everytime this method is called, we need to also need to create a new snapshot of the user stats
        this.bmr = this.calculateBMR();
        this.tdee = this.calculateTDEE();
        this.calorieGoal = this.calculateCalorieGoal(this.tdee);
        const macronutrientQuantities = this.calculateMacronutrientGoals(this.calorieGoal);
        this.lastUpdated = new Date();

        console.log('Updated Stats:', {
            bmr: this.bmr,
            tdee: this.tdee,
            calorieGoal: this.calorieGoal,
            macronutrientQuantities,
            lastUpdated: this.lastUpdated
        });
    }

    // Update methods that call refreshStats to recalculate all dependent values
    public updateWeight(weight: number): void {
        // this.weight = weight; // This line is not needed and causes an error
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

    public updateCalorieGoal(calorieGoal: number): void {
        this.calorieGoal = calorieGoal;
        this.refreshStats();
    }

    public updateMacronutrientPercentageGoals(proteinPercentage: number, fatPercentage: number, carbPercentage: number): void {
        this.proteinPercentage = proteinPercentage;
        this.fatPercentage = fatPercentage;
        this.carbPercentage = carbPercentage;
        this.refreshStats();
    }

    // TODO: with the following methods, we would need to update the respective macronutrient percentages and recalculate the calorie goal based off the new macronutrient grams
    // TODO: allow the user to update the macronutrient grams directly as well -- I think it is important to first focus on the percentages and then allow the user to update the grams directly -- btw this is a paid myfitnesspal feature
    public updateProteinGrams(proteinGrams: number): void {
        this.proteinGrams = proteinGrams;
    }

    public updateFatGrams(fatGrams: number): void {
        this.fatGrams = fatGrams;
    }

    public updateCarbGrams(carbGrams: number): void {
        this.carbGrams = carbGrams;
    }

    // this would be used on the initial user stats creation -- we cannot use the update methods because we are not updating an existing value, we are setting the initial values
    public calculateInitialUserStats(weight: number, height: number, age: number, sex: 'male' | 'female', activityLevel: 'sedentary' | 'lightly active' | 'moderately active' | 'very active' | 'super active', goal: 'weight loss' | 'maintenance' | 'weight gain'): void {
        this.weight = weight;
        this.height = height;
        this.age = age;
        this.sex = sex;
        this.activityLevel = activityLevel;
        this.goal = goal;
    }
}