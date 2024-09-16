import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config()

const client = new Client({
    user: "postgres",
    host: "172.17.0.5",
    database: "thedatabase",
    password: "Goofy-Opposing-Wagon-Surrender7",
    port: 5432,
});

client.connect();

client.query('SELECT * FROM "FoodItems"', (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(res.rows);
    client.end();
});