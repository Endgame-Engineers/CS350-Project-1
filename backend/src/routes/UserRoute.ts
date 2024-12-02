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
import Recipes from '../models/Recipes';
import AccessTokens from '../models/AccessTokens';
import { v4 as uuidv4 } from 'uuid';

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
                            fatgrams: stats.calculateFatGoal(),
                            carbgrams: stats.calculateCarbGoal(),
                            proteingrams: stats.calculateProteinGoal()
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
                        res.status(201).json(userStat);
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

                const handleMealLog = async (mealLog: ExtendedMealLog) => {
                    if (mealLog.barcode === 'Recipe' && mealLog.recipeid) {
                        logger.info('Handling Recipe meal log');
                        console.log(mealLog);
                        const recipe = await Recipes.getRecipeById(mealLog.recipeid); // Fetch the recipe by ID
                        console.log(recipe);
                        if (recipe) {
                            logger.info('Recipe found, mapping to foodItem structure');
                            mealLog.foodItem = {
                                foodname: recipe.name,
                                barcode: 'Recipe',
                                protein_per_serv: recipe.protein_per_serv || 0,
                                carb_per_serv: recipe.carb_per_serv || 0,
                                fat_per_serv: recipe.fat_per_serv || 0,
                                calories_per_serv: recipe.calories_per_serv || 0,
                                image: '/img/No-Image-Placeholder.svg', // Add actual image if available
                            };
                        } else {
                            logger.error('Recipe not found, using dummy foodItem');
                            mealLog.foodItem = {
                                foodname: 'Unknown Recipe',
                                barcode: 'Recipe',
                                protein_per_serv: 0,
                                carb_per_serv: 0,
                                fat_per_serv: 0,
                                calories_per_serv: 0,
                                image: '/img/No-Image-Placeholder.svg',
                            };
                        }
                    } else {
                        logger.info('Handling non-recipe meal log');
                        const foodItem = await FoodItems.getFoodItem(mealLog.barcode); // Fetch the food item
                        if (foodItem) {
                            logger.info('Food item retrieved');
                            mealLog.foodItem = foodItem;
                        } else {
                            logger.error('Food item not found, using dummy foodItem');
                            mealLog.foodItem = {
                                foodname: 'Unknown Food Item',
                                barcode: mealLog.barcode,
                                protein_per_serv: 0,
                                carb_per_serv: 0,
                                fat_per_serv: 0,
                                calories_per_serv: 0,
                                image: '/img/No-Image-Placeholder.svg',
                            };
                        }
                    }
                    return mealLog;
                };

                const fetchAndMapMealLogs = (mealLogs: ExtendedMealLog[]) => {
                    const mealLogPromises = mealLogs.map(handleMealLog);
                    return Promise.all(mealLogPromises);
                };

                const handleLogsRetrieval = (mealLogs: ExtendedMealLog[]) => {
                    logger.info('Meal logs retrieved');
                    return fetchAndMapMealLogs(mealLogs);
                };

                if (startDate && endDate) {
                    logger.info('Using date range');
                    MealLogs.getMealLogs(user.id, startDate, endDate)
                        .then(handleLogsRetrieval)
                        .then((mappedMealLogs) => {
                            logger.info('Returning meal logs');
                            res.json(mappedMealLogs);
                        })
                        .catch((error) => {
                            logger.error('Error retrieving meal logs:', error);
                            res.status(500).json({ error: 'Failed to retrieve meal logs' });
                        });
                } else {
                    logger.info('Using all meal logs');
                    MealLogs.getMealLogs(user.id)
                        .then(handleLogsRetrieval)
                        .then((mappedMealLogs) => {
                            logger.info('Returning meal logs');
                            res.json(mappedMealLogs);
                        })
                        .catch((error) => {
                            logger.error('Error retrieving meal logs:', error);
                            res.status(500).json({ error: 'Failed to retrieve meal logs' });
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

            req.body.mealtype = req.body.mealtype.charAt(0).toUpperCase() + req.body.mealtype.slice(1);

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
                    res.status(201).json(
                        {
                            "message": "Water log created successfully",
                            "data": mealLog
                        }
                    );
                    return;
                }
                if (req.body.barcode.toLowerCase() === 'recipe') {
                    console.log('this is a Recipe meal log');
                    const recipe = await Recipes.getRecipe(user.id, req.body.recipeName);
                    console.log(recipe);
                    if (!recipe) {
                        logger.error('Recipe not found');
                        return res.status(404).json({ error: 'Recipe not found' });
                    }

                    const mealLogData = {
                        ...req.body,
                        userid: user.id,
                        dateadded: req.body.dateadded || new Date(),
                        recipeid: recipe.id, // Include the recipe id
                        recipeName: recipe.name, // Include the recipe name
                    };

                    await MealLogs.addMealLog(mealLogData);
                    logger.info('Meal log for recipe created');

                    const response = {
                        ...mealLogData,
                        foodItem: {
                            foodname: recipe.name,
                            barcode: 'Recipe',
                            protein_per_serv: recipe.protein_per_serv || 0,
                            carb_per_serv: recipe.carb_per_serv || 0,
                            fat_per_serv: recipe.fat_per_serv || 0,
                            calories_per_serv: recipe.calories_per_serv || 0,
                            image: '/img/No-Image-Placeholder.svg',
                        },
                    };

                    return res.status(201).json({
                        "message": "Recipe meal log created successfully",
                        "data": response
                    });
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
                            res.status(201).json({
                                "message": "Meal log created successfully",
                                "data": mealLog
                            });
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

            if (req.body.durationminutes <= 0) {
                logger.error('Duration must be greater than 0');
                return res.status(400).json({ error: 'Duration must be greater than 0' });
            }

            if (!ActivityLogs.doesActivityExist(req.body.activityid)) {
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

        this.router.delete('/user/activity/:id', isAuthenticated, (req, res) => {
            logger.info('/user/activity/:id DELETE');
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
                ActivityLogs.deleteActivityLog(user.id, id)
                    .then((activityLog) => {
                        logger.info('Activity log deleted');
                        res.json(activityLog);
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

        this.router.post('/user/recipes', isAuthenticated, (req, res) => {
            logger.info('/user/recipes POST');
            const user = req.user as User;

            if (user.id) {
                logger.info('User authenticated');

                Recipes.addRecipe({ ...req.body, userid: user.id })
                    .then((Recipe) => {
                        logger.info('Recipe created');
                        res.status(201).json(Recipe);
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

        this.router.get('/user/recipes', isAuthenticated, (req, res) => {
            logger.info('/user/recipes GET');
            const user = req.user as User;

            if (user.id) {
                logger.info('User authenticated for recipes');
                Recipes.getRecipes(user.id)
                    .then(async (recipes) => {
                        logger.info('Recipes retrieved');
                        for (const recipe of recipes) {
                            const foodItems = [];
                            for (const barcode of Object.keys(recipe.ingredients)) {
                                logger.info('Retrieving food item');
                                const foodItem = await FoodItems.getFoodItem(barcode);
                                foodItems.push(foodItem);
                            }
                            recipe.foodItems = foodItems;
                        }
                        res.json(recipes);
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

        this.router.put('/user/recipes/:id', isAuthenticated, async (req, res) => {
            const { id } = req.params;
            const user = req.user as User;
            const recipe = req.body;

            try {
                await Recipes.updateRecipe({ ...recipe, id: parseInt(id, 10) });
                res.status(200).json({ message: 'Recipe updated successfully' });
            } catch (error) {
                res.status(500).json({ error: 'Failed to update recipe' });
            }
        });

        this.router.delete('/user/recipes/:id', isAuthenticated, async (req, res) => {
            const { id } = req.params;
            const user = req.user as User;

            try {
                const recipe = await Recipes.getRecipeById(parseInt(id, 10));
                console.log(recipe);

                await Recipes.deleteRecipe(parseInt(id, 10));
                res.status(200).json({ message: 'Recipe deleted successfully' });
            } catch (error) {
                console.error('Failed to delete recipe:', error);
                res.status(500).json({ error: 'Failed to delete recipe' });
            }
        });

        this.router.get('/user/accesstokens', isAuthenticated, (req, res) => {
            logger.info('/user/accesstokens GET');
            const user = req.user as User;

            if (user.id) {
                logger.info('User authenticated');
                AccessTokens.getAccessTokens(user.id)
                    .then((accessTokens) => {
                        logger.info('Access tokens retrieved');
                        res.json(accessTokens);
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

        this.router.post('/user/accesstoken', isAuthenticated, (req, res) => {
            logger.info('/user/accesstokens POST');
            const user = req.user as User;

            if (user.id) {
                logger.info('User authenticated');
                const token = uuidv4();
                if (!req.body.expiration) {
                    req.body.expiration = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                    req.body.expires = true;
                } else {
                    req.body.expires = true;
                }

                logger.debug(req.body);

                if (new Date(req.body.expiration).getTime() < Date.now()) {
                    logger.error('Expiration date must be in the future');
                    return res.status(400).json({ error: 'Expiration date must be in the future' });
                }
                if (new Date(req.body.expiration).getTime() > Date.now() + 30 * 24 * 60 * 60 * 1000) {
                    logger.error('Expiration date must be within 30 days');
                    return res.status(400).json({ error: 'Expiration date must be within 30 days' });
                }

                AccessTokens.addAccessToken({ ...req.body, userid: user.id, token })
                    .then((accessToken) => {
                        logger.info('Access token created');
                        res.status(201).json({
                            token: accessToken.token,
                            expires: accessToken.expires,
                            expiration: accessToken.expiration
                        });
                    });
            } else {
                logger.error('User not authenticated');
                res.status(400).json({ error: 'User not authenticated' });
            }
        });
    }
}
export default new UserRoute().router;