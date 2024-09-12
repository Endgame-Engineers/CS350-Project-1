import { Router, Request, Response } from 'express';
import User from '../models/Users';
const router = Router();

class UserRoute {
    router: Router;
    user: User;

    constructor() {
        this.router = Router();
        this.user = new User();
        this.router.get('/users', this.getUsers);
    }

    getUsers = (req: Request, res: Response) => {
        this.user.getUsers().then((users) => {
            res.json(users);
        });
    }
}

export default new UserRoute().router;