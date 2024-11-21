import ConnectToDB from "../utils/ConnectToDB";
import { logger } from "../utils/Logging";

export interface Recipe {
    userid: number;
    name: string;
    ingredients: JSON;
    servings: number;
    dateadded?: Date;
    lastupdated?: Date;
    protein_per_serv?: number;
    carb_per_serv?: number;
    fat_per_serv?: number;
    calories_per_serv?: number;
    total_protein?: number;
    total_carbs?: number;
    total_fat?: number;
    total_calories?: number;
}

class Recipes {
    private client: any;

    constructor() {
        this.client = ConnectToDB.getClient();
    }

    async getRecipes(userid: number): Promise<any> {
        logger.info('Fetching Recipes from database');
        let query = 'SELECT * FROM "Recipes" WHERE userid = $1';
        const params: any[] = [userid];

        logger.info('Querying database');
        const result = await (await this.client).query(query, params);

        logger.info('Returning Recipes');
        return result.rows;
    }

    async addRecipe(recipe: Recipe): Promise<void> {
        logger.info('Adding recipe to database');
        await (await this.client).query(
            `INSERT INTO "Recipes" (userid, name, ingredients, servings, dateadded, lastupdated, protein_per_serv, carb_per_serv, fat_per_serv, calories_per_serv, total_protein, total_carbs, total_fat, total_calories) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
            [
                recipe.userid, recipe.name, recipe.ingredients, recipe.servings, recipe.dateadded, recipe.lastupdated,
                recipe.protein_per_serv, recipe.carb_per_serv, recipe.fat_per_serv, recipe.calories_per_serv,
                recipe.total_protein, recipe.total_carbs, recipe.total_fat, recipe.total_calories
            ]
        );
        logger.info('Recipe added to database');
    }

    async deleteRecipe(recipe: Recipe): Promise<void> {
        logger.info('Deleting recipe from database');
        await (await this.client).query(
            'DELETE FROM "Recipes" WHERE userid = $1 AND name = $2',
            [recipe.userid, recipe.name]
        );
        logger.info('Recipe deleted from database');
    }
}

export default new Recipes();