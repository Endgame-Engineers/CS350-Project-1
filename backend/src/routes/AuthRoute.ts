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

        this.router.get('/auth/google/success', (req, res) => {
            if (req.user) {
                res.json({ user: req.user });
            } else {
                res.status(401).json({ error: 'User not authenticated' });
            }
});
    }
}

export default new AuthRoutes().router;
