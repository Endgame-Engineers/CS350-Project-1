import { Router } from 'express';
import Users from '../models/Users';
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

        // replace with daniels isExistingUserAuthenticated
        this.router.get('/user/logs', isAuthenticated, (req, res) => {
            const { start, end } = req.query;
            const startDate = start ? new Date(start as string) : new Date();
            const endDate = end ? new Date(end as string) : new Date();
            // TODO: get stored uuid from session
            // MealLogs.getMealLog(req.user.uuid, startDate, endDate)
            //     .then((mealLogs) => {
            //     res.json(mealLogs);
            // });
        });
        
        this.router.get('/users', isAuthenticated, (req, res) => {
            Users.getUsers().then((users) => {
                res.json(users);
            });
        });

        this.router.get('/users/:uuid', isAuthenticated, (req, res) => {
            Users.getUser(req.params.uuid)
                .then((user) => {
                if (user !== undefined) {
                    console.log('User found in database');
                    res.json(user);
                }
                else {
                    console.log('User not found in database');
                    res.status(404).json({ message: 'User not found' });
                }
            });
        });
    }
}

export default new UserRoute().router;