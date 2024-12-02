import { Client } from 'pg';
import { config } from 'dotenv';
import { userStatsSchema, userSchema, mealLogSchema, foodItemSchema, activityLogSchema, activitiesSchema, recipeSchema, accessTokenSchema } from '../models/tableSchema';
import { logger } from './Logging';

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
        logger.info('Connecting to the database');
        this.client = new Client({
            user: process.env.DB_USERNAME,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
        });
        this.client.connect((err) => {
            if (err) {
                logger.error('Failed to connect to the database:', err);
            } else {
                logger.info('Connected to the database');
                // list all found tables
                const tablesToCreate = [
                    { name: 'Users', schema: userSchema },
                    { name: 'UserStats', schema: userStatsSchema },
                    { name: 'MealLogs', schema: mealLogSchema },
                    { name: 'FoodItems', schema: foodItemSchema },
                    { name: 'ActivityLogs', schema: activityLogSchema },
                    { name: 'Activities', schema: activitiesSchema },
                    { name: 'Recipes', schema: recipeSchema },
                    { name: 'AccessTokens', schema: accessTokenSchema },
                ];

                this.client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' ORDER BY table_name;', (err, res) => {
                    if (err) {
                        logger.error('Failed to list tables:', err);
                    } else {
                        const existingTables = res.rows.map(row => row.table_name);

                        tablesToCreate.forEach(table => {
                            if (!existingTables.includes(table.name)) {
                                try {
                                    this.createTable(table.schema);
                                    logger.info(`Created table ${table.name}`);
                                } catch (error) {
                                    logger.error(`Failed to create table ${table.name}:`, error);
                                }
                            }
                        });

                        logger.info('Tables found in the database:');
                        res.rows.forEach((row) => {
                            logger.info(row.table_name);
                        });
                    }
                });
            }
        });
    }

    createTable(schema: string): void {
        this.client.query(schema, (err, res) => {
            if (err) {
                logger.error('Failed to create table:', err);
            } else {
                logger.info('Table created');
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
        logger.info('Disconnected from the database');
    }
}

export default new ConnectToDB();


