import { Router, Request, Response } from 'express';
import passport from 'passport';
import Users, { User } from '../models/Users';  // Import User model

class AuthRoutes {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes() {
        // Google OAuth routes

        // Redirect the user to Google for authentication.
        this.router.get(
            '/auth/google',
            passport.authenticate('google', { scope: ['profile', 'email'] })
        );

        // Google OAuth callback route
        this.router.get('/auth/google/callback', (req: Request, res: Response) => {
            passport.authenticate('google', { failureRedirect: '/' })(req, res, async () => {
                // Check if the user exists in the database using the UUID from req.user
                if (req.user) {
                    const profile = req.user as User;

                    try {
                        const user = await Users.getUser(profile.uuid);  // Assuming uuid is used as the identifier

                        if (user) {
                            // If the user exists, log them in and redirect
                            console.log('User found in database');
                            res.redirect('/api/user');
                        } else {
                            // If the user does not exist, return a 404 error
                            console.log('User not found in database');
                            res.status(404).json({ message: 'User not found' });
                        }
                    } catch (error) {
                        console.error('Error handling Google OAuth callback:', error);
                        res.status(500).json({ message: 'Internal Server Error' });
                    }
                } else {
                    res.status(401).json({ message: 'Unauthorized: No user found in session' });
                }
            });
        });

        // Logout route
        this.router.get('/auth/logout', (req, res) => {
            req.logout((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Logout failed' });
                }
                req.session.destroy((err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Failed to destroy session' });
                    }
                    res.clearCookie('connect.sid');
                    res.redirect('/');
                });
            });
        });
    }
}

export default new AuthRoutes().router;
