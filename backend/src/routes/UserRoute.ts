import e, { Router } from 'express';
import { User } from '../models/Users';
import MealLogs, { MealLog } from '../models/MealLogs';
import UserStats, { UserStat } from '../models/UserStats';
import ActivityLogs, { ActivityLog, Activity } from '../models/ActivityLogs';
import { isAuthenticated } from '../utils/AuthGoogle';
import { CalculateUserStats } from '../utils/CalculateUserStats';
import FoodItems, { FoodItem } from '../models/FoodItems';
import OpenFoodFacts from '../utils/OpenFoodFacts';
import { logger } from '../utils/Logging';
import { CalculateActivityLogs } from '../utils/CalculateActivityStats';

interface ExtendedMealLog extends MealLog {
    foodItem: FoodItem;
}

interface ExtendedActivityLog extends ActivityLog {
    activity: Activity;
    caloriesburned: number;
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
            
            const user = req.user as User;
            res.json(user);
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
                if (req.body.mealtype.toLowerCase() == 'water') {
                    logger.info('Meal type is water');
                    const mealLog = await MealLogs.addMealLog({ ...req.body, userid: user.id, barcode: 'Water', dateadded: req.body.dateadded || new Date() });
                    logger.info('Meal log created');
                    res.status(201).json(mealLog);
                    return;
                }

                logger.info('Checking if food item exists');
                OpenFoodFacts.fetchProductFromAPI(req.body.barcode)
                    .then(async (product) => {
                        logger.info('Food item fetched from API');
                        logger.info(product);
                        if (FoodItems.isFoodItem(product)) {
                            logger.info('Food item is valid');
                            const mealLog = await MealLogs.addMealLog({ ...req.body, userid: user.id, dateadded: req.body.dateadded || new Date() });
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

        this.router.delete('/user/logs/:id', isAuthenticated, (req, res) => {
            logger.info('/user/logs/:id DELETE');
            const user = req.user as User;

            if (req.params.id === undefined) {
                logger.error('ID is required');
                return res.status(400).json({ error: 'ID is required' });
            }

            let id: number;
            try {
                id = Number(req.params.id);
                if (isNaN(id)) {
                    logger.error('Invalid ID');
                    return res.status(400).json({ error: 'Invalid ID' });
                }
            } catch (error) {
                logger.error('Invalid ID:', (error as Error).message);
                return res.status(400).json({ error: 'Invalid ID' });
            }

            if (user.id) {
                logger.info('User authenticated');
                MealLogs.deleteMealLog(id, user.id)
                    .then((mealLog) => {
                        logger.info('Meal log deleted');
                        res.json(mealLog);
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

        this.router.get('/user/activity', isAuthenticated, async (req, res) => {
            logger.info('/user/activity GET');
            const { start, end } = req.query;
            const startDate = start ? new Date(start as string) : undefined;
            const endDate = end ? new Date(end as string) : undefined;
            const user = req.user as User;

            if (user.id) {
                logger.info('User authenticated');
                ActivityLogs.getActivityLogs(user.id, startDate, endDate)
                    .then((activityLogs: ExtendedActivityLog[]) => {
                        logger.info('Activity logs retrieved');
                        const activityLogPromises = activityLogs.map(async (activityLog: ExtendedActivityLog) => {
                            logger.info('Retrieving activity');
                            const activity = await ActivityLogs.getActivity(activityLog.activityid);
                            if (activity) {
                                logger.info('Activity retrieved');

                                const mostRecentUserStat = await UserStats.getUserStat(user.id as number);
                                const calculatedActivity = new CalculateActivityLogs(activityLog, activity, mostRecentUserStat);
                                const caloriesBurned = calculatedActivity.calculateCaloriesBurned();
                                logger.info('Mapping activity logs');
                                activityLog.activity = activity;
                                activityLog.caloriesburned = caloriesBurned;
                            }
                            return activityLog;
                        });
                        return Promise.all(activityLogPromises);
                    })
                    .then((mappedActivityLogs) => {
                        logger.info('Returning activity logs');
                        res.json(mappedActivityLogs);
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

        this.router.post('/user/activity', isAuthenticated, (req, res) => {
            logger.info('/user/activity POST');
            const user = req.user as User;

            if (!user.id) {
                logger.error('User not authenticated');
                return res.status(400).json({ error: 'User not authenticated' });
            }

            if (!req.body.activityid || !req.body.durationminutes) {
                logger.error('All fields are required');
                return res.status(400).json({ error: 'All fields are required' });
            }

            if(req.body.durationminutes < 0) {
                logger.error('Duration must be greater than 0');
                return res.status(400).json({ error: 'Duration must be greater than 0' });
            }

            if(!ActivityLogs.doesActivityExist(req.body.activityid)) {
                logger.error('Activity does not exist');
                return res.status(400).json({ error: 'Activity does not exist' });
            }

            ActivityLogs.addActivityLog({ ...req.body, userid: user.id, dateadded: req.body.dateadded || new Date() })
                .then((activityLog) => {
                    logger.info('Activity log created');
                    res.status(201).json(activityLog);
                })
                .catch((error) => {
                    logger.error(error);
                    res.status(500).json({ error: 'An error occurred' });
                });
        });
        
        this.router.get('/user/activities', isAuthenticated, (req, res) => {
            logger.info('/user/activities GET');
            const user = req.user as User;

            if (user.id) {
                logger.info('User authenticated');
                ActivityLogs.getActivities()
                    .then((activities) => {
                        logger.info('Activities retrieved');
                        res.json(activities);
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
    }
}

export default new UserRoute().router;