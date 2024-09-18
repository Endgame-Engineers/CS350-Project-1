import { Router } from 'express';
import { User } from '../models/Users';
import MealLogs from '../models/MealLogs';
import UserStats from '../models/UserStats';
import { isAuthenticated } from '../utils/AuthGoogle';

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
            if (user.providerid) {
                UserStats.getUserStats(user.providerid)
                    .then((userStats) => {
                        res.json(userStats);
                    });
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