import { Router, Request, Response } from 'express';
import passport from 'passport';

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
                res.json({ 
                    isAuthenticated: true,
                    user: req.user
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