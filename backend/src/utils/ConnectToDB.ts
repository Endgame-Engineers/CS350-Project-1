import { Client } from 'pg';
import { config } from 'dotenv';
import { userStatsSchema, userSchema, mealLogSchema, foodItemSchema, healthLogSchema } from '../models/tableSchema';
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
                const tablesToCreate = [
                    { name: 'Users', schema: userSchema },
                    { name: 'UserStats', schema: userStatsSchema },
                    { name: 'MealLogs', schema: mealLogSchema },
                    { name: 'FoodItems', schema: foodItemSchema },
                    { name: 'HealthLogs', schema: healthLogSchema }
                ];

                this.client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' ORDER BY table_name;', (err, res) => {
                    if (err) {
                        console.error('Failed to list tables:', err);
                    } else {
                        const existingTables = res.rows.map(row => row.table_name);

                        tablesToCreate.forEach(table => {
                            if (!existingTables.includes(table.name)) {
                                try {
                                    this.createTable(table.schema);
                                } catch (error) {
                                    console.error(`Failed to create table ${table.name}:`, error);
                                }
                            }
                        });

                        console.log('Found tables:');
                        res.rows.forEach((row) => {
                            console.log(row.table_name);
                        });
                    }
                });
            // Check and add missing columns
            
            tablesToCreate.forEach(table => {
                this.client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${table.name}'`, (err, res) => {
                    if (err) {
                        console.error(`Failed to list columns for table ${table.name}:`, err);
                    } else {
                        const existingColumns = res.rows.map(row => row.column_name);

                        const schemaMatch = tablesToCreate.find(t => t.name === table.name)?.schema.match(/"([^"]+)"/g);
                        const schemaColumns = schemaMatch ? schemaMatch.map((match: string) => match.replace(/"/g, '')) : [];

                        const columnsToIgnore = tablesToCreate.map(table => `${table.name}_id_seq`).concat(tablesToCreate.map(table => table.name));

                        schemaColumns.forEach(column => {
                            if (!existingColumns.includes(column) && !columnsToIgnore.includes(column)) {
                                console.error(`Column ${column} is missing from table ${table.name}`);

                                const columnMatch = table.schema.match(new RegExp(`"${column}"[^,]+`));
                                const columnDefinition = columnMatch ? columnMatch[0] : '';
                                const columnQuery = `ALTER TABLE "${table.name}" ADD COLUMN ${columnDefinition}`;

                                this.client.query(columnQuery, (err, res) => {
                                    if (err) {
                                        console.error(`Failed to add column ${column} to table ${table.name}:`, err);
                                    } else {
                                        console.log(`Added column ${column} to table ${table.name}`);
                                    }
                                });
                            }

                            if(existingColumns.includes(column) && columnsToIgnore.includes(column)) {
                                console.error(`Column ${column} is not in the schema for table ${table.name}`);

                                const columnQuery = `ALTER TABLE "${table.name}" DROP COLUMN ${column}`;
                                this.client.query(columnQuery, (err, res) => {
                                    if (err) {
                                        console.error(`Failed to drop column ${column} from table ${table.name}:`, err);
                                    } else {
                                        console.log(`Dropped column ${column} from table ${table.name}`);
                                    }
                                });
                            }
                        });
                    }
                });
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


