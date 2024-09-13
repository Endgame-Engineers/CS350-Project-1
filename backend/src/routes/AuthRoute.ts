import { Router } from 'express';


class AuthRoutes {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.get('/auth', (req, res) => {
            res.json({ message: 'Auth route' });
        });
    }
}

export default new AuthRoutes().router;