import { Router } from 'express';
import { User } from '../models/Users';
import MealLogs, { MealLog } from '../models/MealLogs';
import UserStats, { UserStat } from '../models/UserStats';
import { isAuthenticated } from '../utils/AuthGoogle';
import { CalculateUserStats } from '../utils/CalculateUserStats';
import FoodItems, { FoodItem } from '../models/FoodItems';
import OpenFoodFacts from '../utils/OpenFoodFacts';

interface ExtendedMealLog extends MealLog {
    foodItem: FoodItem;
}

class UserRoute {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.get('/user', isAuthenticated, (req, res) => {
            res.json(req.user);
        });

        this.router.get('/user/stats', isAuthenticated, (req, res) => {
            const user = req.user as User;
            if (user.id) {
                UserStats.getUserStats(user.id)
                    .then((userStats) => userStats.map((userStat) => {
                        const stats = new CalculateUserStats(userStat);
                        return {
                            ...userStat,
                            bmr: stats.calculateBMR(),
                            tdee: stats.calculateTDEE(),
                            recommendedcaloriegoal: Math.round(stats.calculateCalorieGoal()),
                        };
                    }))
                    .then((calculatedStats) => {
                        res.json(calculatedStats);
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).json({ error: 'An error occurred' });
                    });
            } else {
                res.status(400).json({ error: 'User not authenticated' });
            }
        });

        this.router.post('/user/stats', isAuthenticated, (req, res) => {
            const user = req.user as User;
            const userStat = { ...req.body, updatedon: new Date() } as UserStat;

            if (user.id) {
                UserStats.addUserStats(userStat, user.id)
                    .then((userStats) => {
                        console.log("User Stat created");
                        res.status(201).json(userStats);
                    });
            } else {
                res.status(400).json({ error: 'User not authenticated' });
            }
        });

        this.router.post('/user/stats/caloriegoal', isAuthenticated, (req, res) => {
            // TODO: restructure this ;-;
            const user = req.user as User;
            const userStat = { ...req.body, updatedon: new Date() } as UserStat;
            console.log(userStat);
            const calculatedStats = new CalculateUserStats(userStat);
            const caloriegoal = Math.round(calculatedStats.calculateCalorieGoal());

            if (user.id) {
                console.log("Calorie goal created");
                res.status(201).json(caloriegoal);
            } else {
                res.status(400).json({ error: 'User not authenticated' });
            }
        });

        this.router.get('/user/logs', isAuthenticated, (req, res) => {
            const { start, end } = req.query;
            const startDate = start ? new Date(start as string) : new Date();
            const endDate = end ? new Date(end as string) : new Date();
            const all = req.query.all === 'true';
            const user = req.user as User;
            if (user.id) {
                if (all) {
                    MealLogs.getMealLogs(user.id)
                        .then((mealLogs) => {
                            const mealLogPromises = mealLogs.map(async (mealLog: ExtendedMealLog) => {
                                const foodItem = await FoodItems.getFoodItem(mealLog.barcode);
                                if (foodItem) {
                                    mealLog.foodItem = foodItem;
                                }
                                return mealLog;
                            });
                            return Promise.all(mealLogPromises);
                        })
                        .then((mappedMealLogs) => {
                            res.json(mappedMealLogs);
                        });
                } else {
                    MealLogs.getMealLog(user.id, startDate, endDate)
                        .then((mealLogs) => {
                            res.json(mealLogs);
                        });
                }
            } else {
                res.status(400).json({ error: 'User not authenticated' });
            }
        });

        this.router.post('/user/logs', isAuthenticated, async (req, res) => {
            const user = req.user as User;

            if (!user.id) {
                console.log("User not authenticated");
                return res.status(400).json({ error: 'User not authenticated' });
            }

            if (!req.body.barcode || !req.body.mealtype || !req.body.servingconsumed) {
                console.log("All fields are required");
                return res.status(400).json({ error: 'All fields are required' });
            }

            try {
                const foodItem = await FoodItems.getFoodItem(req.body.barcode);
                if (!foodItem) {
                    console.log("Food item not found in database");
                    OpenFoodFacts.fetchProductFromAPI(req.body.barcode)
                        .then(async (product) => {
                            if (FoodItems.isFoodItem(product)) {
                                await FoodItems.addFoodItem(product);
                                console.log("Food item added to database");
                                const mealLog = await MealLogs.addMealLog({ ...req.body, userid: user.id, dateadded: new Date() });
                                res.status(201).json(mealLog);
                            } else {
                                res.status(404).json({ error: 'Food item not found' });
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).json({ error: 'An error occurred' });
                        });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'An error occurred' });
            }
        });
    }
}

export default new UserRoute().router;