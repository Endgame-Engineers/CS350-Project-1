import ConnectToDB from "../utils/ConnectToDB";
import { logger } from "../utils/Logging";

export interface Recipe {
    userid: number;
    name: string;
    ingredients: string;
    servings: number;
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

    async addRecipe(Recipe: Recipe): Promise<void> {
        logger.info('Adding recipe to database');
        await (await this.client).query(
            'INSERT INTO "Recipes" (userid, name, ingredients, servings) VALUES ($1, $2, $3, $4)',
            [Recipe.userid, Recipe.name, Recipe.ingredients, Recipe.servings]
        );
        logger.info('Recipe added to database');
    }

    async deleteRecipe(Recipe: Recipe): Promise<void> {
        logger.info('Deleting recipe from database');
        await (await this.client).query(
            'DELETE FROM "Recipes" WHERE userid = $1 AND name = $2',
            [Recipe.userid, Recipe.name]
        );
        logger.info('Recipe deleted from database');
    }
}

export default new Recipes();