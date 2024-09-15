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
            // placeholder for now
            res.json(req.user);
        });

        this.router.post('/user', isAuthenticated, async (req, res) => {
            // Check if the user is authenticated and exists in req.user
            if (req.user) {
                const users = new Users();
                const user = req.user as User;  // Cast req.user as the User interface
                
                try {
                    // Check if the user already exists in the database by UUID
                    const existingUser = await users.getUser(user.uuid);
        
                    if (existingUser) {
                        // If the user exists, return a 400 status with a message
                        return res.status(400).json({ message: 'User already exists' });
                    }
        
                    // If the user doesn't exist, create a new user
                    await users.addUser(user);  // Call addUser function to insert the new user into the database
        
                    // Return a success message with a 200 status
                    return res.status(200).json({ message: 'User successfully created' });
                } catch (error) {
                    console.error('Error creating user:', error);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
            }
        
            // If req.user doesn't exist, return an unauthorized error
            return res.status(401).json({ message: 'Unauthorized: No user found in session' });
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