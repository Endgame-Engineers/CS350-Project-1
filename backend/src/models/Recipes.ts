import ConnectToDB from "../utils/ConnectToDB";
import { logger } from "../utils/Logging";

export interface Recipe {
    id?: number;
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

    async getRecipe(userid: number, name: string): Promise<any> {
        logger.info('Fetching Recipe from database');
        let query = 'SELECT * FROM "Recipes" WHERE userid = $1 AND name = $2';
        const params: any[] = [userid, name];

        logger.info('Querying database');
        const result = await (await this.client).query(query, params);

        logger.info('Returning Recipe');
        return result.rows[0];
    }

    async getRecipeById(recipeid: number): Promise<any> {
        logger.info('Fetching Recipe by ID from database');
        const query = 'SELECT * FROM "Recipes" WHERE id = $1';
        const params = [recipeid];
    
        logger.info('Querying database');
        const result = await (await this.client).query(query, params);
    
        logger.info('Returning Recipe by ID');
        return result.rows[0];
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

    async updateRecipe(recipe: Recipe): Promise<void> {
        logger.info(`Editing recipe in database: ${recipe.name}`);
        try {
            const result = await (await this.client).query(
                `UPDATE "Recipes" 
                SET name = $2, ingredients = $3, servings = $4, lastupdated = $5, protein_per_serv = $6, 
                    carb_per_serv = $7, fat_per_serv = $8, calories_per_serv = $9, total_protein = $10, 
                    total_carbs = $11, total_fat = $12, total_calories = $13
                WHERE id = $1`, // Use the `id` column here
                [
                    recipe.id,                  // $1 - ID of the recipe to update
                    recipe.name,                // $2 - Recipe name
                    JSON.stringify(recipe.ingredients), // $3 - Serialized JSON ingredients
                    recipe.servings,            // $4 - Number of servings
                    recipe.lastupdated,         // $5 - Last updated timestamp
                    recipe.protein_per_serv,    // $6 - Protein per serving
                    recipe.carb_per_serv,       // $7 - Carbs per serving
                    recipe.fat_per_serv,        // $8 - Fat per serving
                    recipe.calories_per_serv,   // $9 - Calories per serving
                    recipe.total_protein,       // $10 - Total protein
                    recipe.total_carbs,         // $11 - Total carbs
                    recipe.total_fat,           // $12 - Total fat
                    recipe.total_calories       // $13 - Total calories
                ]
            );
    
            if (result.rowCount === 0) {
                logger.error(`No rows updated. Recipe ID: ${recipe.id} may not exist.`);
                throw new Error(`Failed to update recipe. Recipe ID: ${recipe.id} may not exist.`);
            }
            logger.info(`Recipe successfully updated: ${recipe.name}`);
        } catch (error) {
            logger.error(`Error updating recipe in database: ${recipe.name}`, error);
            throw new Error('Failed to update recipe.');
        }
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