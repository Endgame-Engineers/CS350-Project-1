import { Router } from 'express';
import { getUsers, getUser } from '../models/Users';
import { isAuthenticated } from '../utils/AuthGoogle';

class UserRoute {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.get('/users', isAuthenticated, (req, res) => {
            getUsers().then((users) => {
                res.json(users);
            });
        });

        this.router.get('/users/:uuid', isAuthenticated, (req, res) => {
            getUser(req.params.uuid)
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