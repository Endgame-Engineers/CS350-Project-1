import e, { Router } from 'express';
import { User } from '../models/Users';
import MealLogs, { MealLog } from '../models/MealLogs';
import UserStats, { UserStat } from '../models/UserStats';
import { isAuthenticated } from '../utils/AuthGoogle';
import { CalculateUserStats } from '../utils/CalculateUserStats';
import FoodItems, { FoodItem } from '../models/FoodItems';
import OpenFoodFacts from '../utils/OpenFoodFacts';
import { logger } from '../utils/Logging';

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
            logger.info('/user GET');
            logger.info('User authenticated');
            res.json(req.user);
        });

        this.router.get('/user/stats', isAuthenticated, (req, res) => {
            logger.info('/user/stats GET');
            const user = req.user as User;
            if (user.id) {
                logger.info('User authenticated');
                UserStats.getUserStats(user.id)
                    .then((userStats) => userStats.map((userStat) => {
                        logger.info('User stats retrieved');
                        const stats = new CalculateUserStats(userStat);
                        logger.info('User stats calculated');
                        return {
                            ...userStat,
                            bmr: stats.calculateBMR(),
                            tdee: stats.calculateTDEE(),
                            recommendedcaloriegoal: Math.round(stats.calculateCalorieGoal()),
                        };
                    }))
                    .then((calculatedStats) => {
                        logger.info('User stats calculated');
                        res.json(calculatedStats);
                    })
                    .catch((error) => {
                        logger.error(error);
                        res.status(500).json({ error: 'An error occurred' });
                    });
            } else {
                logger.error('User not authenticated');
                res.status(400).json({ error: 'User not authenticated' });
            }
        });

        this.router.post('/user/stats', isAuthenticated, (req, res) => {
            logger.info('/user/stats POST');
            const user = req.user as User;
            const userStat = { ...req.body, updatedon: new Date() } as UserStat;

            if (user.id) {
                UserStats.addUserStats(userStat, user.id)
                    .then((userStats) => {
                        console.log("User Stat created");
                        res.status(201).json(userStats);
                    })
                    .catch((error) => {
                        console.error('Error creating user stat:', error);
                        res.status(500).json({ error: 'Failed to create user stat' });
                    });
            } else {
                res.status(400).json({ error: 'User not authenticated' });
            }
        });

        this.router.post('/user/stats/caloriegoal', isAuthenticated, (req, res) => {
            logger.info('/user/stats/caloriegoal POST');
            // TODO: restructure this ;-;
            const user = req.user as User;
            const userStat = { ...req.body, updatedon: new Date() } as UserStat;
            const calculatedStats = new CalculateUserStats(userStat);
            const caloriegoal = Math.round(calculatedStats.calculateCalorieGoal());

            if (user.id) {
                logger.info('User authenticated');
                logger.info('Calorie goal calculated');
                res.status(201).json(caloriegoal);
            } else {
                logger.error('User not authenticated');
                res.status(400).json({ error: 'User not authenticated' });
            }
        });

        this.router.get('/user/logs', isAuthenticated, (req, res) => {
            logger.info('/user/logs GET');
            const { start, end } = req.query;
            const startDate = start ? new Date(start as string) : undefined;
            const endDate = end ? new Date(end as string) : undefined;
            const user = req.user as User;
            if (user.id) {
                logger.info('User authenticated');
                if (startDate && endDate) {
                    logger.info('Using date range');
                    MealLogs.getMealLogs(user.id, startDate, endDate)
                        .then((mealLogs) => {
                            logger.info('Meal logs retrieved');
                            const mealLogPromises = mealLogs.map(async (mealLog: ExtendedMealLog) => {
                                logger.info('Retrieving food item');
                                const foodItem = await FoodItems.getFoodItem(mealLog.barcode);
                                if (foodItem) {
                                    logger.info('Food item retrieved');
                                    logger.info('Mapping meal logs');
                                    mealLog.foodItem = foodItem;
                                }
                                return mealLog;
                            });
                            return Promise.all(mealLogPromises);
                        })
                        .then((mappedMealLogs) => {
                            logger.info('Returning meal logs');
                            res.json(mappedMealLogs);
                        });
                } else {
                    logger.info('Using all meal logs');
                    MealLogs.getMealLogs(user.id)
                        .then((mealLogs) => {
                            logger.info('Meal logs retrieved');
                            const mealLogPromises = mealLogs.map(async (mealLog: ExtendedMealLog) => {
                                const foodItem = await FoodItems.getFoodItem(mealLog.barcode);
                                if (foodItem) {
                                    logger.info('Food item retrieved');
                                    logger.info('Mapping meal logs');
                                    mealLog.foodItem = foodItem;
                                }
                                return mealLog;
                            });
                            return Promise.all(mealLogPromises);
                        })
                        .then((mappedMealLogs) => {
                            logger.info('Returning meal logs');
                            res.json(mappedMealLogs);
                        });
                }
            } else {
                logger.error('User not authenticated');
                res.status(400).json({ error: 'User not authenticated' });
            }
        });

        this.router.post('/user/logs', isAuthenticated, async (req, res) => {
            logger.info('/user/logs POST');
            const user = req.user as User;

            if (!user.id) {
                logger.error('User not authenticated');
                return res.status(400).json({ error: 'User not authenticated' });
            }

            if (!req.body.barcode || !req.body.mealtype || !req.body.servingconsumed) {
                logger.error('All fields are required');
                return res.status(400).json({ error: 'All fields are required' });
            }

            try {
                logger.info('Checking if food item exists');
                OpenFoodFacts.fetchProductFromAPI(req.body.barcode)
                    .then(async (product) => {
                        logger.info('Food item fetched from API');
                        if (FoodItems.isFoodItem(product)) {
                            logger.info('Food item is valid');
                            const mealLog = await MealLogs.addMealLog({ ...req.body, userid: user.id, dateadded: new Date() });
                            logger.info('Meal log created');
                            res.status(201).json(mealLog);
                        } else {
                            logger.error('Food item is not valid');
                            res.status(404).json({ error: 'Food item not found' });
                        }
                    })
                    .catch((error) => {
                        logger.error(error);
                        res.status(500).json({ error: 'An error occurred' });
                    });
            } catch (error) {
                logger.error(error);
                res.status(500).json({ error: 'An error occurred' });
            }
        });
    }
}

export default new UserRoute().router;