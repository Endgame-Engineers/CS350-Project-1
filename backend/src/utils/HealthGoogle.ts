import { google } from 'googleapis';
import { User } from '../models/Users';

class HealthGoogle {
    async connectToGoogle(user: User): Promise<void> {
        // Connect to Google Fit API using user access token
        const auth = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );

        auth.setCredentials({
            access_token: user.accesstoken,
            refresh_token: user.refreshtoken
        });

    }
}