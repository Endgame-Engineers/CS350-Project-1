import ConnectToDB from '../utils/ConnectToDB';

export interface User {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    uuid: string;
    lastlogin: Date;
    providername: string;
    providerid: string;
}

class Users {
    private client: any;

   constructor() {
        this.client = ConnectToDB.getClient();
    }

    async getUsers(): Promise<User[]> {
        const result = await (await this.client).query('SELECT * FROM "Users"');
        return result.rows;
    }

    async getUser(providerid: string): Promise<User | null> {
        const result = await (await this.client).query('SELECT * FROM "Users" WHERE providerid = $1', [providerid]);
        
        if (result.rows.length > 0) {
            return result.rows[0];
        }
        return null;
    }

    async addUser(user: User): Promise<void> {
        await (await this.client).query(
            'INSERT INTO "Users" (username, email, firstname, lastname, uuid, last_login, providername, providerid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [user.username, user.email, user.firstname, user.lastname, user.uuid, user.lastlogin, user.providername, user.providerid]
        );
    }

    async updateUser(user: User): Promise<void> {
        await (await this.client).query(
            'UPDATE "Users" SET email = $1, firstname = $2, lastname = $3, uuid = $4, last_login = $5 WHERE username = $6',
            [user.email, user.firstname, user.lastname, user.uuid, user.lastlogin, user.username]
        );
    }

    async deleteUser(username: string): Promise<void> {
        await (await this.client).query('DELETE FROM "Users" WHERE username = $1', [username]);
    }
}

export default new Users();
