import ConnectToDB from '../utils/ConnectToDB';

interface User {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    uuid: string;
    last_login: Date;
}

class Users {
    private client: ConnectToDB;
    private db: Promise<any>;

   constructor() {
        this.client = new ConnectToDB();
        this.db = this.client.connect();
    }

    
    async getUsers(): Promise<User[]> {
        const result = await (await this.db).query('SELECT * FROM "Users"');
        return result.rows;
    }

    async getUser(uuid: string): Promise<User> {
        const result = await (await this.db).query('SELECT * FROM "Users" WHERE uuid = $1', [uuid]);
        return result.rows[0];
    }

    async addUser(user: User): Promise<void> {
        await (await this.db).query(
            'INSERT INTO "Users" (username, email, firstname, lastname, uuid, last_login) VALUES ($1, $2, $3, $4, $5, $6)',
            [user.username, user.email, user.firstname, user.lastname, user.uuid, user.last_login]
        );
    }

    async updateUser(user: User): Promise<void> {
        await (await this.db).query(
            'UPDATE "Users" SET email = $1, firstname = $2, lastname = $3, uuid = $4, last_login = $5 WHERE username = $6',
            [user.email, user.firstname, user.lastname, user.uuid, user.last_login, user.username]
        );
    }

    async deleteUser(username: string): Promise<void> {
        await (await this.db).query('DELETE FROM "Users" WHERE username = $1', [username]);
    }

    close(): void {
        ConnectToDB.close(this.db);
    }
}


export function getUser(username: string): Promise<User> {
    return new Users().getUser(username);
}

export function getUsers(): Promise<User[]> {
    return new Users().getUsers();
}

export function addUser(user: User): Promise<void> {
    return new Users().addUser(user);
}

export function updateUser(user: User): Promise<void> {
    return new Users().updateUser(user);
}

export function deleteUser(username: string): Promise<void> {
    return new Users().deleteUser(username);
}


