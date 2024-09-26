import { Router } from 'express';
import Users, { User } from '../models/Users';
import MealLogs from '../models/MealLogs';
import UserStats, { UserStat } from '../models/UserStats';
import { isAuthenticated } from '../utils/AuthGoogle';
import { CalculateUserStats } from '../utils/CalculateUserStats';

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
            console.log(calculatedStats.calculateBMR());
            console.log(calculatedStats.calculateTDEE());
            const caloriegoal = calculatedStats.calculateCalorieGoal();

            if (user.id) {
                res.status(201).json({ caloriegoal });
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
                            res.json(mealLogs);
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

        this.router.post('/user/logs', isAuthenticated, (req, res) => {
            const user = req.user as User;

            if (user.id) {
                const mealLog = { ...req.body, userid: user.id };
                MealLogs.addMealLog(mealLog)
                    .then((mealLog) => {
                        res.status(201).json(mealLog);
                    });
            } else {
                res.status(400).json({ error: 'User not authenticated' });
            }
        });
    }
}

export default new UserRoute().router;