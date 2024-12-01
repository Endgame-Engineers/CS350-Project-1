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
    console.log('Recipes retrieved');
    console.log(response.data);
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

// Function to update a recipe
export async function updateRecipe(recipe: Recipe): Promise<void> {
  try {
    await axios.put(`/api/user/recipes/${recipe.id}`, recipe);
    const index = recipes.value.findIndex(r => r.id === recipe.id);
    if (index !== -1) {
      recipes.value[index] = recipe; // Update existing recipe in state
    } else {
      recipes.value.push(recipe); // Add to state if not already present
    }
    console.log(`Recipe successfully updated: ${recipe.name}`);
  } catch (error) {
    console.error("Error updating recipe", error);
    throw new Error("Could not update recipe.");
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