import passport from 'passport';
import { NextFunction, Response, Request } from 'express';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Users, { User } from '../models/Users';

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
                        if (profile) {
                            const existingUser = await Users.getUser(profile.id);
                            if (existingUser) {
                                console.log('User found in database');
                                await Users.updateUserLastLogin(existingUser.uuid);
                                existingUser.profilepic = profile.photos ? profile.photos[0].value : '';
                                req.user = existingUser;


                                return done(null, existingUser);
                            } else {
                                console.log('User not found in database, creating');
                                const user: User = {
                                    username: profile.displayName,
                                    email: profile.emails ? profile.emails[0].value : '',
                                    firstname: profile.name ? profile.name.givenName : '',
                                    lastname: profile.name ? profile.name.familyName : '',
                                    uuid: require('crypto').randomUUID(),
                                    lastlogin: new Date(),
                                    providername: "Google",
                                    providerid: profile.id,
                                    profilepic: profile.photos ? profile.photos[0].value : '',
                                    profilecreated: false
                                }
                                await Users.addUser(user);
                                req.user = user;
                                return done(null, user);
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
    res.redirect('/login');
}