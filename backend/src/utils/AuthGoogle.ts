import passport from 'passport';
import e, { NextFunction, Response, Request } from 'express';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Users, { User } from '../models/Users';
import UserStats from '../models/UserStats';
import { logger } from './Logging';

class AuthGoogle {
    constructor() {
        passport.use(
            new GoogleStrategy(
                {
                    clientID: process.env.GOOGLE_CLIENT_ID!,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                    callbackURL: '/api/auth/google/callback',
                    passReqToCallback: true,
                    scope: [
                        'profile',
                        'email',
                        'https://www.googleapis.com/auth/fitness.activity.read',
                        'https://www.googleapis.com/auth/fitness.body.read'
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
                                    await Users.updateTokens({
                                        id: user.id,
                                        accesstoken: accessToken,
                                        refreshtoken: refreshToken
                                    });
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
                                        accesstoken: accessToken,
                                        refreshtoken: refreshToken
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
    res.redirect('/login');
}