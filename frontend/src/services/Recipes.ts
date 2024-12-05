import { ref } from "vue";
import axios from "axios";
import { Recipe } from "../models/Models";

export const recipes = ref<Recipe[]>([]);

function validateIngredients(ingredients: { [key: string]: number }): void {
  // if any of the ingredients have "Recipe" as the key (or barcode), throw an error as this should not be allowed
  for (const key in ingredients) {
    if (key === "Recipe" || !/^\d+$/.test(key)) {
      throw new Error(`Invalid ingredient key: ${key}. Recipes cannot be added as ingredients.`);
    }
  }
}

export async function getRecipes(): Promise<Recipe[]> {
  try {
    const response = await axios.get<Recipe[]>('/api/user/recipes');
    recipes.value = response.data;
    console.log('Recipes retrieved');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes", error);
    throw new Error("Could not fetch recipes.");
  }
}

export async function addRecipe(recipe: Recipe): Promise<void> {
  try {
    validateIngredients(recipe.ingredients);
    await axios.post('/api/user/recipes', recipe);
    recipes.value.push(recipe);
  } catch (error) {
    console.error("Error adding recipe", error);
    throw new Error("Could not add recipe.");
  }
}

// update an existing recipe - may be changed in favor of creating recipe snapshots
export async function updateRecipe(recipe: Recipe): Promise<void> {
  try {
    validateIngredients(recipe.ingredients);
    await axios.put(`/api/user/recipes/${recipe.id}`, recipe);
    const index = recipes.value.findIndex(r => r.id === recipe.id);
    if (index !== -1) {
      recipes.value[index] = recipe;
    } else {
      recipes.value.push(recipe);
    }
    console.log(`Recipe successfully updated: ${recipe.name}`);
  } catch (error) {
    console.error("Error updating recipe", error);
    throw new Error("Could not update recipe.");
  }
}

export async function deleteRecipe(recipeId: number): Promise<void> {
  try {
    await axios.delete(`/api/user/recipes/${recipeId}`);
    recipes.value = recipes.value.filter(recipe => recipe.id !== recipeId);
  } catch (error) {
    console.error("Error deleting recipe", error);
    throw new Error("Could not delete recipe.");
  }
}