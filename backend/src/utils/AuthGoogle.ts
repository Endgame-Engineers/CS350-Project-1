import passport from 'passport';
import { NextFunction, Response, Request } from 'express';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Users, { User as User } from '../models/Users';  // Corrected import

class AuthGoogle {
    constructor() {
        passport.use(
            new GoogleStrategy(
                {
                    clientID: process.env.GOOGLE_CLIENT_ID!,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                    callbackURL: 'https://3000--main--yaydanielmadethis--ssjdan27.coder.galifrey.dev/auth/google/callback',
                },
                async (accessToken, refreshToken, profile, done) => {
                    // Here, you'd typically look up the user in your database
                    done(null, profile);
                }
            )
        );

        // Serializing user by UUID
        passport.serializeUser((user: any, done) => {
            if (user && user.uuid) {
                done(null, user.uuid);  // Using user.uuid
            } else {
                console.error("User object is missing 'uuid'");
                done(new Error("User object is missing 'uuid'"));
            }
        });

        // Deserializing user from UUID
        passport.deserializeUser(async (uuid: string, done) => {
            try {
                const users = new Users();
                const user = await users.getUser(uuid);  // Get full user object
                done(null, user);  // req.user will now contain the full user object
            } catch (err) {
                done(err);
            }
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
            const users = new Users();

            // Type assertion - assuming req.user is defined
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized: No user found in session' });
            }

            const user = req.user as User;  // Type assertion -- probably a better way to do this ;-;
            if (!user.username) {
                return res.status(400).json({ message: 'Bad request: Missing username in user object' });
            }

            const foundUser = await users.getUser(user.username);  // Accessing username from User interface

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
