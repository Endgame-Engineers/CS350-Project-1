import { Client } from 'pg';
import { config } from 'dotenv';

config();

class  ConnectToDB {
    static close(client: Promise<Client>) {
        throw new Error('Method not implemented.');
    }
  constructor() {}

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

    async close(client: Client): Promise<void> {
        client.end();
    }


}

export default ConnectToDB;


