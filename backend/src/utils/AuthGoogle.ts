import passport from 'passport';
import e, { NextFunction, Response, Request } from 'express';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Users, { User } from '../models/Users';
import UserStats from '../models/UserStats';
import { logger } from './Logging';
import AccessTokens from '../models/AccessTokens';

class AuthGoogle {
    constructor() {
        // Initialize the GoogleStrategy instance
        const googleStrategy = new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                callbackURL: '/api/auth/google/callback',
                passReqToCallback: true,
                scope: [
                    'profile',
                    'email',
                ]
            },
            async (req, accessToken, refreshToken, profile, done) => {
                try {
                    logger.info('Handling Google OAuth callback');
                    if (profile) {
                        try {
                            const user = await Users.getUser(profile.id);
                            if (user !== null) {
                                console.log('User found in database');
                                await Users.updateUserLastLogin(user.uuid);
                                user.profilepic = profile.photos ? profile.photos[0].value : '';
                                if (user.id !== undefined) {
                                    user.profilecreated = await UserStats.getUserStats(user.id).then((userStats) => {
                                        return userStats.length > 0;
                                    });
                                    req.user = user;
                                } else {
                                    throw new Error('User ID is undefined');
                                }
                                return done(null, user);
                            } else {
                                console.log('User not found in database, creating');
                                const newUser: User = {
                                    username: profile.displayName,
                                    email: profile.emails ? profile.emails[0].value : '',
                                    firstname: profile.name ? profile.name.givenName : '',
                                    lastname: profile.name ? profile.name.familyName : '',
                                    uuid: require('crypto').randomUUID(),
                                    lastlogin: new Date(),
                                    providername: "Google",
                                    providerid: profile.id,
                                    profilepic: profile.photos ? profile.photos[0].value : '',
                                    profilecreated: false,
                                };
                                const createdUser = await Users.addUser(newUser);
                                req.user = createdUser;
                                return done(null, newUser);
                            }
                        } catch (error) {
                            console.error('Error handling Google OAuth callback:', error);
                            return done(error);
                        }
                    }
                } catch (error) {
                    console.error('Error handling Google OAuth callback:', error);
                    return done(error);
                }
            }
        );

        // Attach `authorizationParams` method to the GoogleStrategy instance
        googleStrategy.authorizationParams = (options) => {
            return {
                access_type: 'offline',
                prompt: 'consent',
            };
        };

        // Use the strategy with passport
        passport.use(googleStrategy);

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

    logger.info('User is not authenticated');
    const bearerHeader = req.headers.authorization;
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        logger.debug('Checking access token:', token);
        AccessTokens.getAccessToken(token).then((accessToken) => {
            if (accessToken !== null) {
                Users.getUserById(accessToken.userid).then((user) => {
                    if (user !== null) {
                        req.user = user;
                        return next();
                    }
                });
            }
        });
    } else {
        res.redirect('/login');
    }
}
