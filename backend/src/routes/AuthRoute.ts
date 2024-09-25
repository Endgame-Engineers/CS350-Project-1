import { get } from 'axios';
import { Router, Request, Response } from 'express';
import UserStats from '../models/UserStats';
import passport from 'passport';
import { User } from '../models/Users';

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
                if (req.user) {
                    res.redirect('/');
                } else {
                    res.redirect('/api/auth/google');
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

        this.router.get('/auth/google/success', async (req, res) => {
            // update req.user if req.user.profilecreated is false
            const reqUser = req.user as User;
            if (reqUser) {
                if (reqUser.profilecreated === false) {
                    // make sure its actually false
                    if (reqUser.id === undefined) {
                        throw new Error('User ID is undefined');
                    }
                    await UserStats.getUserStats(reqUser.id).then((userStats) => {
                        if (userStats !== null) {
                            reqUser.profilecreated = true;
                        }
                    });
                }
                res.json({ 
                    isAuthenticated: true,
                    user: reqUser
                });
            } else {
                res.json({ 
                    isAuthenticated: false 
                });
            }
        });
    }
}

export default new AuthRoutes().router;