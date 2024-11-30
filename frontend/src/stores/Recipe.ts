import { defineStore } from 'pinia';
import { nextTick } from 'vue';

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
            console.log('Adding ingredient:', ingredient);
            this.ingredients = [...this.ingredients, ingredient]; // Create a new array reference
            nextTick(() => {
                console.log('Updated ingredients after nextTick:', this.ingredients);
            });
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
        },

        saveCurrentRecipeState() {
            console.log('Saving current recipe state:', this.currentRecipe, this.ingredients);
        },
    },
});
