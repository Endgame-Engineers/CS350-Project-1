import { Client } from 'pg';
import { config } from 'dotenv';

config();

/**
 * Class to connect to the database
 */
class ConnectToDB {
    static close: any;
    /**
     * Connect to the database
     * @returns Client
     */
    async connect(): Promise<Client> {
        const client = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
        });
        client.connect();
        return client;
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


