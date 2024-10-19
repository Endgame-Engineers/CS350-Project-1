import { Client } from 'pg';
import { config } from 'dotenv';
import { userStatsSchema, userSchema, mealLogSchema, foodItemSchema } from '../models/tableSchema';

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
        console.log('Connecting to the database');
        this.client = new Client({
            user: process.env.DB_USERNAME,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
        });
        this.client.connect((err) => {
            if (err) {
                console.error('Failed to connect to the database:', err);
            } else {
                console.log('Successfully connected to the database');
                // list all found tables
                this.client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' ORDER BY table_name;', (err, res) => {
                    if (err) {
                        console.error('Failed to list tables:', err);
                    } else {
                        if (res.rows.length === 0) {
                            console.log('No tables found');
                            try {
                                this.createTable(userSchema);
                                this.createTable(userStatsSchema);
                                this.createTable(mealLogSchema);
                                this.createTable(foodItemSchema);
                            } catch (error) {
                                console.error('Failed to create tables:', error);
                            }
                        }
                        console.log('Found tables:');
                        res.rows.forEach((row) => {
                            console.log(row.table_name);
                        });
                    }
                });
            }
        });
    }

    createTable(schema: string): void {
        this.client.query(schema, (err, res) => {
            if (err) {
                console.error('Failed to create table:', err);
            } else {
                console.log('Table created successfully');
            }
        });
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
    async disconnect(): Promise<void> {
        await this.client.end();
        console.log('Disconnected from the database');
    }
}

export default new ConnectToDB();


