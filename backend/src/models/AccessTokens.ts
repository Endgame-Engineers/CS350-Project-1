import ConnectToDB from "../utils/ConnectToDB";
import { logger } from "../utils/Logging";

export interface AccessToken {
    token: string;
    userid: number;
    expires: boolean;
    expiration?: Date;
}

class AccessTokens {
    private client: any;

    constructor() {
        this.client = ConnectToDB.getClient();
    }

    async getAccessToken(token: string): Promise<AccessToken | null> {
        logger.info('Fetching access token from database');
        const result = await (await this.client).query('SELECT * FROM "AccessTokens" WHERE token = $1', [token]);
        logger.info('Returning access token');
        return result.rows[0];
    }

    async getAccessTokens(userid: number): Promise<AccessToken[]> {
        logger.info('Fetching access tokens from database');
        const result = await (await this.client).query('SELECT * FROM "AccessTokens" WHERE userid = $1', [userid]);
        logger.info('Returning access tokens');
        return result.rows;
    }
    
    async addAccessToken(accessToken: AccessToken): Promise<void> {
        logger.info('Adding access token to database');
        await (await this.client).query(
            'INSERT INTO "AccessTokens" (token, userid, expires) VALUES ($1, $2, $3)',
            [accessToken.token, accessToken.userid, accessToken.expires]
        );
        logger.info('Access token added to database');
    }

    async deleteAccessToken(token: string): Promise<void> {
        logger.info('Deleting access token from database');
        await (await this.client).query('DELETE FROM "AccessTokens" WHERE token = $1', [token]);
        logger.info('Access token deleted from database');
    }
}

export default new AccessTokens;