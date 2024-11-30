import { defineStore } from 'pinia';

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    ingredients: [] as {
      name: string;
      barcode: string;
      servings: number;
      protein_per_serv: number;
      carb_per_serv: number;
      fat_per_serv: number;
      calories_per_serv: number;
    }[],
    currentRecipe: {
      name: '',
      servings: 1,
    },
    hasUnSavedChanges: false, // Tracks if changes were made
  }),

  actions: {
    addIngredient(ingredient: {
      name: string;
      barcode: string;
      servings: number;
      protein_per_serv: number;
      carb_per_serv: number;
      fat_per_serv: number;
      calories_per_serv: number;
    }) {
      this.ingredients = [...this.ingredients, ingredient];
      this.hasUnSavedChanges = true; // Mark changes as unsaved
    },

    setCurrentRecipe(name: string, servings: number) {
      this.currentRecipe.name = name;
      this.currentRecipe.servings = servings;
    },

    clearIngredients() {
      this.ingredients = [];
    },

    clearStore() {
      this.ingredients = [];
      this.currentRecipe = {
        name: '',
        servings: 1,
      };
      this.hasUnSavedChanges = false;
    },

    markChangesSaved() {
      this.hasUnSavedChanges = false; // Reset unsaved changes flag
    },
  },
});
