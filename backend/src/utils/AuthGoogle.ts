import passport from 'passport';
import { NextFunction, Response, Request } from 'express';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

class AuthGoogle {
    constructor() {
        passport.use(
            new GoogleStrategy(
                {
                    clientID: process.env.GOOGLE_CLIENT_ID!,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                    callbackURL: 'https://3000--main--cs350-test--sirbomble.coder.galifrey.dev/api/auth/google/callback',
                },
                (accessToken, refreshToken, profile, done) => {
                    done(null, profile);
                }
            ));
        passport.serializeUser((user, done) => {
            done(null, user as Express.User);
        });

        passport.deserializeUser((user, done) => {
            done(null, user as Express.User);
        });
    }
}

export default AuthGoogle;

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized');
}