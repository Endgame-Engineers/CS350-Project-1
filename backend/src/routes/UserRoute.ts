import { Router } from 'express';
import Users, { User } from '../models/Users';
import MealLogs from '../models/MealLogs';
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
        this.router.get('/user/logs', isAuthenticated, (req, res) => {
            const { start, end } = req.query;
            const startDate = start ? new Date(start as string) : new Date();
            const endDate = end ? new Date(end as string) : new Date();
            const user = req.user as User;
            if (user.id) {
                MealLogs.getMealLog(user.id, startDate, endDate)
                    .then((mealLogs) => {
                    res.json(mealLogs);
                });
            } else {
                res.status(400).json({ error: 'User not authenticated' });
            }
        });
    }
}

export default new UserRoute().router;