// TODO: Carlos
import { FoodItem, MealLog, MealType, User, UserStat, ErrorMessage, SearchResult, ExtendedMealLog, ActivityLog, Activity, Recipe } from '../../src/models/Models';
  
  describe('Models', () => {
    it('should create a valid FoodItem object', () => {
      const foodItem: FoodItem = {
        foodname: 'Apple',
        barcode: '123456789',
        protein_per_serv: 0,
        carb_per_serv: 25,
        fat_per_serv: 0,
        calories_per_serv: 95,
        image: 'apple.jpg',
      };
  
      expect(foodItem.foodname).toBe('Apple');
      expect(foodItem.barcode).toBe('123456789');
      expect(foodItem.protein_per_serv).toBe(0);
      expect(foodItem.carb_per_serv).toBe(25);
      expect(foodItem.fat_per_serv).toBe(0);
      expect(foodItem.calories_per_serv).toBe(95);
      expect(foodItem.image).toBe('apple.jpg');
      expect(foodItem.recipeid).toBeUndefined();
    });
  
    it('should create a valid MealLog object', () => {
      const mealLog: MealLog = {
        mealtype: 'Breakfast',
        barcode: '123456789',
        servingconsumed: 2,
      };
  
      expect(mealLog.mealtype).toBe('Breakfast');
      expect(mealLog.barcode).toBe('123456789');
      expect(mealLog.servingconsumed).toBe(2);
      expect(mealLog.dateadded).toBeUndefined();
    });
  
    it('should create a valid User object', () => {
      const user: User = {
        username: 'testuser',
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
        uuid: 'uuid-123',
        lastlogin: new Date('2023-12-01'),
        providername: 'Google',
        providerid: 'google-123',
        profilepic: 'profile.jpg',
        profilecreated: true,
      };
  
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.firstname).toBe('John');
      expect(user.lastname).toBe('Doe');
      expect(user.uuid).toBe('uuid-123');
      expect(user.lastlogin).toEqual(new Date('2023-12-01'));
      expect(user.providername).toBe('Google');
      expect(user.providerid).toBe('google-123');
      expect(user.profilepic).toBe('profile.jpg');
      expect(user.profilecreated).toBe(true);
    });
  
    it('should create a valid UserStat object', () => {
      const userStat: UserStat = {
        height: 180,
        weight: 75,
        goal: 1,
        caloriegoal: 2000,
        watergoal: 2.5,
        activitylevel: 3,
        proteinpercentage: 30,
        fatpercentage: 30,
        carbpercentage: 40,
        proteingrams: 150,
        fatgrams: 67,
        carbgrams: 200,
        sex: 1,
        dateofbirth: new Date('1990-01-01'),
        updatedon: new Date('2023-12-01'),
      };
  
      expect(userStat.height).toBe(180);
      expect(userStat.weight).toBe(75);
      expect(userStat.caloriegoal).toBe(2000);
      expect(userStat.watergoal).toBe(2.5);
      expect(userStat.proteinpercentage).toBe(30);
      expect(userStat.fatpercentage).toBe(30);
      expect(userStat.carbpercentage).toBe(40);
      expect(userStat.proteingrams).toBe(150);
      expect(userStat.fatgrams).toBe(67);
      expect(userStat.carbgrams).toBe(200);
    });
  
    it('should create a valid Recipe object', () => {
      const recipe: Recipe = {
        userid: 1,
        name: 'Pasta',
        ingredients: { '123456789': 2 },
        servings: 4,
        dateadded: new Date('2023-12-01'),
        lastupdated: new Date('2023-12-02'),
        protein_per_serv: 10,
        carb_per_serv: 30,
        fat_per_serv: 5,
        calories_per_serv: 200,
        total_protein: 40,
        total_carbs: 120,
        total_fat: 20,
        total_calories: 800,
      };
  
      expect(recipe.userid).toBe(1);
      expect(recipe.name).toBe('Pasta');
      expect(recipe.ingredients).toEqual({ '123456789': 2 });
      expect(recipe.servings).toBe(4);
      expect(recipe.protein_per_serv).toBe(10);
      expect(recipe.carb_per_serv).toBe(30);
      expect(recipe.fat_per_serv).toBe(5);
      expect(recipe.calories_per_serv).toBe(200);
      expect(recipe.total_protein).toBe(40);
      expect(recipe.total_carbs).toBe(120);
      expect(recipe.total_fat).toBe(20);
      expect(recipe.total_calories).toBe(800);
    });
  });
  