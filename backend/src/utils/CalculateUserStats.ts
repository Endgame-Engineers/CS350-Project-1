// this class will be used to calculate the user stats and to set/update information like weight, height, age, calorie goal, activity level, date updated, and a unique identifier to map the user to the stats.

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

interface UserStats {
    weight: number; // in kg -- would be nice to have this in lbs as well for our American friends
    height: number; // in cm -- would be nice to have this in inches as well for our American friends
    age: number;
    gender: 'male' | 'female';
    activityLevel: 'sedentary' | 'lightly active' | 'moderately active' | 'very active' | 'super active';
    goal: 'weight loss' | 'maintenance' | 'weight gain';
    proteinPercentage?: number;
    fatPercentage?: number;
    carbPercentage?: number;
}

class CalculateUserStats {
    private weight: number;
    private height: number;
    private age: number;
    private gender: 'male' | 'female';
    private activityLevel: 'sedentary' | 'lightly active' | 'moderately active' | 'very active' | 'super active';
    private goal: 'weight loss' | 'maintenance' | 'weight gain';
    private proteinPercentage: number;
    private fatPercentage: number;
    private carbPercentage: number;

    constructor(userStats: UserStats) {
        this.weight = userStats.weight;
        this.height = userStats.height;
        this.age = userStats.age;
        this.gender = userStats.gender;
        this.activityLevel = userStats.activityLevel;
        this.goal = userStats.goal;
        this.proteinPercentage = userStats.proteinPercentage || 15;
        this.fatPercentage = userStats.fatPercentage || 30;
        this.carbPercentage = userStats.carbPercentage || 55;
    }

    // this would be used to calculate the Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation and after calculating it initially we can store this in the DB and update it only when the user updates their weight, height, or age.
    private calculateBMR(): number {
        if (this.gender === 'male') {
            return 10 * this.weight + 6.25 * this.height - 5 * this.age + 5;
        } else {
            return 10 * this.weight + 6.25 * this.height - 5 * this.age - 161;
        }
    }

    // this would be used to calculate the Total Daily Energy Expenditure (TDEE) and after calculating it initially we can store this in the DB and update it only when the user updates their activity level
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

    private adjustForGoal(tdee: number): number {
        switch (this.goal) {
            case 'weight loss':
                return tdee * 0.8; // Subtract 20% for weight loss - caloric deficit
            case 'maintenance':
                return tdee; // Use TDEE as is (1.0)
            case 'weight gain':
                return tdee * 1.2; // Add 20% for weight gain - caloric surplus
            default:
                return tdee;
        }
    }

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

    // this would be used to calculate the user stats and return the BMR, TDEE, adjusted calories based on the goal, and macronutrient goals after the user enters age, weight, height, activity level, and goal.
    public calculateUserStats(): { bmr: number, tdee: number, adjustedCalories: number, macronutrients: { protein: number, fat: number, carbs: number } } {
        const bmr = this.calculateBMR();
        const tdee = this.calculateTDEE();
        const adjustedCalories = this.adjustForGoal(tdee);
        const macronutrients = this.calculateMacronutrientGoals(adjustedCalories);

        return {
            bmr,
            tdee,
            adjustedCalories,
            macronutrients
        };
    }
}