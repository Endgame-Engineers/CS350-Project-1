import { google } from 'googleapis';
import { User } from '../models/Users';
import axios from 'axios';
import { logger } from './Logging';

class HealthGoogle {
    private user: User;
    private fitness: any;

    constructor(user: User) {
        this.user = user;
    }
    
    async connectToGoogle(): Promise<void> {
        // Connect to Google Fit API using user access token
        const auth = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );

        auth.setCredentials({
            access_token: this.user.accesstoken,
            refresh_token: this.user.refreshtoken
        });

        this.fitness = google.fitness({
            version: 'v1',
            auth
        });
    }

    async getHealthData(): Promise<any> {
        // Get health data from Google Fit API
        const res = await this.fitness.users.dataSources.list({
            userId: 'me'
        });

        return res.data;
    }

    async checkTokenScopes(): Promise<string> {
        const response = await axios.get<{ scope: string }>(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${this.user.accesstoken}`);
        logger.info('Token scopes:', response.data.scope);
        return response.data.scope;
    }
}

export default HealthGoogle;