import passport from 'passport';
import { NextFunction, Response, Request } from 'express';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Users, { User } from '../models/Users';  // Corrected import

class AuthGoogle {
    constructor() {
        passport.use(
            new GoogleStrategy(
                {
                    clientID: process.env.GOOGLE_CLIENT_ID!,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                    callbackURL: '/api/auth/google/callback',
                    passReqToCallback: true, 
                },
                async (req, accessToken, refreshToken, profile, done) => {
                    try {
                        if (req.user) {
                            const user = req.user as User;

                            const existingUser = await Users.getUser(user.uuid);

                            if (existingUser) {
                                console.log('User found in database');
                                return done(null, user);
                            } else {
                                console.log('User not found in database');
                                return done(null, false);
                            }
                        } else {
                            console.log('No user found in session');
                            return done(null, false);
                        }
                    } catch (error) {
                        console.error('Error handling Google OAuth callback:', error);
                        return done(error);
                    }
                }
            )
        );

        passport.serializeUser((user, done) => {
            done(null, user as Express.User);
        });

        passport.deserializeUser((user, done) => {
            done(null, user as Express.User);
        });
    }
}

export default AuthGoogle;

// Middleware to check if the user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized');
}

// Check if the user exists in the database AND is authenticated
export async function isExistingAuthenticatedUser(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        try {
            // Type assertion - assuming req.user is defined
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized: No user found in session' });
            }

            const user = req.user as User;  // Type assertion -- probably a better way to do this ;-;
            if (!user.username) {
                return res.status(400).json({ message: 'Bad request: Missing username in user object' });
            }

            const foundUser = await Users.getUser(user.username);  // Accessing username from User interface

            if (foundUser) {
                console.log('User found in database');
                return next();
            } else {
                console.log('User not found in database');
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            console.error('Error checking user in database:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(401).send('Unauthorized');
    }
}
