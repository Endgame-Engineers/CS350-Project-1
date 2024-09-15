import { Router } from 'express';
import passport from 'passport';

class AuthRoutes {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes() {
        // Google OAuth routes

        // Redirect the user to Google for authentication.  When complete, Google will redirect the user back to the application at /auth/google/callback
        this.router.get('/auth/google', 
            passport.authenticate('google', { scope: ['profile', 'email'] })
        );
        
        // Google OAuth callback route. This route will redirect the user to the home page after authentication.
        this.router.get('/auth/google/callback', (req, res) => {
            passport.authenticate('google', { failureRedirect: '/' })(req, res, () => {
                res.redirect('/');
            });
        });

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