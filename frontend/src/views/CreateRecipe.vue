<template>
    <div class="container">
      <h1>Create Recipe</h1>
      <form @submit.prevent="saveRecipe">
        <div class="mb-3">
          <label for="recipeName" class="form-label">Recipe Name</label>
          <input type="text" class="form-control" id="recipeName" v-model="recipeName" required />
        </div>
        <div class="mb-3">
          <label for="servings" class="form-label">Servings</label>
          <input type="number" class="form-control" id="servings" v-model="servings" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Ingredients</label>
          <button type="button" class="btn btn-primary ms-2" @click="addIngredient">Add Ingredient</button>
          <div v-for="(ingredient, index) in ingredients" :key="index" class="input-group mb-2">
            <input type="text" class="form-control" v-model="ingredient.barcode" placeholder="Barcode" required />
            <input type="number" class="form-control" v-model="ingredient.servings" placeholder="Servings" required />
            <button type="button" class="btn btn-danger" @click="removeIngredient(index)">Remove</button>
          </div>
        </div>
        <button type="submit" class="btn btn-outline-primary">Save Recipe</button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Recipe } from '@/models/Models'; // Adjust the import path as necessary
  import { useRouter } from 'vue-router';
  import { addRecipe } from '@/services/Recipes';
  
  export default defineComponent({
    name: 'CreateRecipe',
    setup() {
      const recipeName = ref('');
      const servings = ref(1);
      const ingredients = ref<{ barcode: string; servings: number }[]>([]);
      const router = useRouter();
  
      const addIngredient = () => {
        ingredients.value.push({ barcode: '', servings: 1 });
      };
  
      const removeIngredient = (index: number) => {
        ingredients.value.splice(index, 1);
      };
  
      const saveRecipe = async () => {
        const newRecipe: Recipe = {
          userid: 12345, // Replace with actual user ID
          name: recipeName.value,
          ingredients: ingredients.value.reduce((acc, ingredient) => {
            acc[ingredient.barcode] = ingredient.servings;
            return acc;
          }, {} as { [barcode: string]: number }),
          servings: servings.value,
          dateadded: new Date(),
          lastupdated: new Date(),
          protein_per_serv: 0, // Placeholder values
          carb_per_serv: 0,    // Placeholder values
          fat_per_serv: 0,     // Placeholder values
          calories_per_serv: 0,// Placeholder values
          total_protein: 0,    // Placeholder values
          total_carbs: 0,      // Placeholder values
          total_fat: 0,        // Placeholder values
          total_calories: 0    // Placeholder values
        };
  
        try {
          await addRecipe(newRecipe);
          router.push({ name: 'Recipes' });
        } catch (error) {
          console.error('Error saving recipe:', error);
        }
      };
  
      return {
        recipeName,
        servings,
        ingredients,
        addIngredient,
        removeIngredient,
        saveRecipe,
      };
    },
  });
  </script>