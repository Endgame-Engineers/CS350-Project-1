import ConnectToDB from "../utils/ConnectToDB";

export interface MealLog {
    uuid: string;
    meal_date: Date;
    meal: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

class MealLogs {
    private client: any;
    private db: Promise<any>;

   constructor() {
        const dbConnection = new ConnectToDB();
        this.client = dbConnection.getClient();
        this.db = this.client;
    }

    async getMealLogs(uuid: string): Promise<any> {
        const result = (await this.db).query('SELECT * FROM "MealLogs" WHERE uuid = $1', [uuid]);
        return result.rows[0];
    }

    async getMealLog(uuid: string, start: Date, end: Date): Promise<any> {
        const result = (await this.db).query('SELECT * FROM "MealLogs" WHERE uuid = $1 AND meal_date >= $2 AND meal_date <= $3', [uuid, start, end]);
        return result.rows;
    }

    async addMealLog(mealLog: MealLog): Promise<void> {
        (await this.db).query(
            'INSERT INTO "MealLogs" (uuid, meal_date, meal, calories, protein, carbs, fats) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [mealLog.uuid, mealLog.meal_date, mealLog.meal, mealLog.calories, mealLog.protein, mealLog.carbs, mealLog.fats]
        );
    }

    async updateMealLog(uuid: string): Promise<void>  {
        const result = (await this.db).query('UPDATE "MealLogs" SET uuid = $1 WHERE uuid = $2', [uuid, uuid]);
        return result.rows[0];
    }
}

export default new MealLogs();