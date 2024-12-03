import { CalculateUserStats } from '../../src/utils/CalculateUserStats';
import { UserStat } from '../../src/models/UserStats';

describe('CalculateUserStats', () => {
  let userStats: CalculateUserStats;

  beforeEach(() => {
    // Mock user stats for the test
    const mockStats: UserStat = {
      userid: 1, // Unique identifier for the user
      weight: 154.3, // Weight in pounds
      height: 68.9, // Height in inches
      dateofbirth: new Date('1998-01-01'), // Example date of birth
      sex: 1, // Male
      activitylevel: 3, // Moderate activity
      goal: 2, // Maintenance
      proteinpercentage: 30, // Protein percentage
      fatpercentage: 25, // Fat percentage
      carbpercentage: 45, // Carb percentage
      caloriegoal: 2500, // Example calorie goal
      watergoal: 3000, // Water goal in mL (example value)
      proteingrams: 0, // Initial protein grams
      fatgrams: 0, // Initial fat grams
      carbgrams: 0, // Initial carb grams
      updatedon: new Date(), // Example updated on date
    };

    userStats = new CalculateUserStats(mockStats);
  });

  it('calculates age correctly based on date of birth', () => {
    const age = userStats['calculateAge'](new Date('1998-01-01')); // Access private method for test
    expect(age).toBe(new Date().getFullYear() - 1998); // Adjusted for current date
  });

  it('calculates BMR for males correctly', () => {
    const expectedBMR = 10 * (154.3 * 0.453592) + 6.25 * (68.9 * 2.54) - 5 * 25 + 5; // BMR formula for males
    const result = userStats.calculateBMR();
    expect(result).toBeCloseTo(expectedBMR, 2);
  });

  it('calculates BMR for females correctly', () => {
    const femaleStats: UserStat = {
      userid: 2,
      weight: 132.3,
      height: 64.9,
      dateofbirth: new Date('1993-01-01'),
      sex: 2, // Female
      activitylevel: 2,
      goal: 1,
      proteinpercentage: 30,
      fatpercentage: 25,
      carbpercentage: 45,
      caloriegoal: 2000,
      watergoal: 2500,
      proteingrams: 0,
      fatgrams: 0,
      carbgrams: 0,
      updatedon: new Date(),
    };

    const femaleUserStats = new CalculateUserStats(femaleStats);
    const expectedBMR = 10 * (132.3 * 0.453592) + 6.25 * (64.9 * 2.54) - 5 * 30 - 161; // BMR formula for females
    const result = femaleUserStats.calculateBMR();
    expect(result).toBeCloseTo(expectedBMR, 2);
  });

  it('calculates TDEE correctly based on activity level', () => {
    userStats.calculateBMR();
    const expectedTDEE = userStats.calculateBMR() * 1.55; // Moderate activity level (factor 1.55)
    const result = userStats.calculateTDEE();
    expect(result).toBeCloseTo(expectedTDEE, 2);
  });

  it('calculates calorie goal for weight maintenance correctly', () => {
    const result = userStats.calculateCalorieGoal();
    expect(result).toBeCloseTo(userStats.calculateTDEE(), 2); // Maintenance uses TDEE directly
  });

  it('calculates calorie goal for weight loss correctly', () => {
    const weightLossStats: UserStat = {
      ...userStats['stats'], // Spread the existing stats
      goal: 1, // Weight loss
    };
    const weightLossUserStats = new CalculateUserStats(weightLossStats);
    const expectedCalorieGoal = weightLossUserStats.calculateTDEE() * 0.8; // Subtract 20%
    const result = weightLossUserStats.calculateCalorieGoal();
    expect(result).toBeCloseTo(expectedCalorieGoal, 2);
  });

  it('calculates protein goal correctly', () => {
    const expectedProteinGoal = (2500 * 0.3) / 4; // 30% of calories, 4 cal/gram
    const result = userStats.calculateProteinGoal();
    expect(result).toBeCloseTo(expectedProteinGoal, 2);
  });

  it('calculates fat goal correctly', () => {
    const expectedFatGoal = (2500 * 0.25) / 9; // 25% of calories, 9 cal/gram
    const result = userStats.calculateFatGoal();
    expect(result).toBeCloseTo(expectedFatGoal, 2);
  });

  it('calculates carb goal correctly', () => {
    const expectedCarbGoal = (2500 * 0.45) / 4; // 45% of calories, 4 cal/gram
    const result = userStats.calculateCarbGoal();
    expect(result).toBeCloseTo(expectedCarbGoal, 2);
  });

  it('converts weight from lbs to kg correctly', () => {
    const result = userStats.getWeightKgs();
    const expectedWeightKgs = 154.3 * 0.453592;
    expect(result).toBeCloseTo(expectedWeightKgs, 2);
  });
});
