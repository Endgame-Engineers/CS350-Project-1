import { Client } from 'pg';
import { config } from 'dotenv';

config();

interface User {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    uuid: string;
    last_login: Date;
}

class Users {
    private client: Client;

    constructor() {
        this.client = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
        });
        this.client.connect();
    }

    async getUsers(): Promise<User[]> {
        const result = await this.client.query('SELECT * FROM "Users"');
        return result.rows;
    }

    async getUser(username: string): Promise<User> {
        const result = await this.client.query('SELECT * FROM "Users" WHERE username = $1', [username]);
        return result.rows[0];
    }

    async addUser(user: User): Promise<void> {
        await this.client.query(
            'INSERT INTO "Users" (username, email, firstname, lastname, uuid, last_login) VALUES ($1, $2, $3, $4, $5, $6)',
            [user.username, user.email, user.firstname, user.lastname, user.uuid, user.last_login]
        );
    }

    async updateUser(user: User): Promise<void> {
        await this.client.query(
            'UPDATE "Users" SET email = $1, firstname = $2, lastname = $3, uuid = $4, last_login = $5 WHERE username = $6',
            [user.email, user.firstname, user.lastname, user.uuid, user.last_login, user.username]
        );
    }

    async deleteUser(username: string): Promise<void> {
        await this.client.query('DELETE FROM "Users" WHERE username = $1', [username]);
    }

    close(): void {
        this.client.end();
    }
}

export default Users;