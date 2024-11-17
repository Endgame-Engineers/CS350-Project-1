import { ref } from "vue";
import axios from "axios";
import { Recipe } from "../models/Models";

// Create a reactive state to store recipes
export const recipes = ref<Recipe[]>([]);

// Function to fetch recipes from the backend
export async function getRecipes(): Promise<Recipe[]> {
  try {
    const response = await axios.get<Recipe[]>('/api/user/recipes');
    recipes.value = response.data;
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes", error);
    throw new Error("Could not fetch recipes.");
  }
}

// Function to add a new recipe
export async function addRecipe(recipe: Recipe): Promise<void> {
  try {
    await axios.post('/api/user/recipes', recipe);
    recipes.value.push(recipe);
  } catch (error) {
    console.error("Error adding recipe", error);
    throw new Error("Could not add recipe.");
  }
}

// Function to delete a recipe
export async function deleteRecipe(recipeId: number): Promise<void> {
  try {
    await axios.delete(`/api/user/recipes/${recipeId}`);
    recipes.value = recipes.value.filter(recipe => recipe.id !== recipeId);
  } catch (error) {
    console.error("Error deleting recipe", error);
    throw new Error("Could not delete recipe.");
  }
}