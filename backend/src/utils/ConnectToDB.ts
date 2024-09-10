import { Client } from 'pg';
import { config } from 'dotenv';

config();

/**
 * Class to connect to the database
 */
class ConnectToDB {
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
            port: process.env.DB_PORT,
        });
        client.connect();
        return client;
    }

    /**
     * Close the connection to the database
     * @param client 
     */
    async close(client: Client): Promise<void> {
        client.end();
    }


}

export default ConnectToDB;


