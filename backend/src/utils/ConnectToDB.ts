import { Client } from 'pg';
import { config } from 'dotenv';

config();

/**
 * Class to connect to the database
 */
class ConnectToDB {
    static close: any;
    private client: Client;

    /**
     * Connect to the database
     */
    constructor() {
        this.client = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
        });
        this.client.connect();
    }

    /**
     * Get the database client
     * @returns Client
     */
    getClient(): Client {
        return this.client;
    }


    /**
     * Disconnect from the database
     * @param client Client
     */
    async disconnect(client: any): Promise<void> {
        client.end();
    }
}

export default ConnectToDB;


