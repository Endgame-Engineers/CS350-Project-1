<template>
  <div class="container">
    <h1>{{ isEditing ? 'Edit Recipe' : 'Create Recipe' }}</h1>
    <form @submit.prevent="saveRecipe">
      <div class="mb-3">
        <label for="recipeName" class="form-label">Recipe Name</label>
        <input type="text" class="form-control" id="recipeName" v-model="recipeName" required />
      </div>
      <div class="mb-3">
        <label for="servings" class="form-label">Servings</label>
        <input type="number" class="form-control" id="servings" v-model="servings" min="1" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Ingredients</label>
        <button type="button" class="btn btn-primary ms-2" @click="addIngredient">Add Ingredient</button>
        <div v-for="(ingredient, index) in ingredients" :key="index" class="input-group mb-2">
          <input
            type="text"
            class="form-control"
            v-model="ingredient.barcode"
            placeholder="Barcode"
            required
          />
          <input
            type="number"
            class="form-control"
            v-model="ingredient.servings"
            placeholder="Servings"
            min="0.01"
            step="0.01"
            required
          />
          <button type="button" class="btn btn-danger" @click="removeIngredient(index)">Remove</button>
        </div>
      </div>
      <button type="submit" class="btn btn-outline-primary">
        {{ isEditing ? 'Update Recipe' : 'Save Recipe' }}
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Recipe } from '@/models/Models';
import { addRecipe, updateRecipe } from '@/services/Recipes';

export default defineComponent({
  name: 'CreateRecipe',
  setup() {
    const recipeName = ref('');
    const servings = ref(1);
    const ingredients = ref<{ barcode: string; servings: number }[]>([]);
    const isEditing = ref(false);
    const router = useRouter();
    const route = useRoute();

    const userId = ref(12345); // Replace with actual user ID logic

    const loadRecipe = () => {
      const recipeId = route.query.id;
      if (recipeId) {
        isEditing.value = true;
        recipeName.value = (route.query.name as string) || '';
        servings.value = parseInt(route.query.servings as string, 10) || 1;

        try {
          const ingredientsParam = route.query.ingredients as string;
          const parsedIngredients = ingredientsParam ? JSON.parse(decodeURIComponent(ingredientsParam)) : {};
          ingredients.value = Object.entries(parsedIngredients).map(([barcode, servings]) => ({
            barcode,
            servings: Number(servings),
          }));
        } catch (error) {
          console.error('Error parsing ingredients:', error);
          ingredients.value = []; // Default to empty array on failure
        }
      }
    };

    const addIngredient = () => {
      ingredients.value.push({ barcode: '', servings: 1 });
    };

    const removeIngredient = (index: number) => {
      ingredients.value.splice(index, 1);
    };

    const saveRecipe = async () => {
      if (!recipeName.value.trim()) {
        alert('Recipe name is required.');
        return;
      }

      if (servings.value < 1) {
        alert('Servings must be at least 1.');
        return;
      }

      if (ingredients.value.length === 0) {
        alert('At least one ingredient is required.');
        return;
      }

      const recipeData: Recipe = {
        userid: userId.value,
        name: recipeName.value,
        ingredients: ingredients.value.reduce((acc, ingredient) => {
          acc[ingredient.barcode] = ingredient.servings;
          return acc;
        }, {} as { [barcode: string]: number }),
        servings: servings.value,
        dateadded: isEditing.value ? new Date() : new Date(),
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
        if (isEditing.value) {
          await updateRecipe({ ...recipeData, id: Number(route.query.id) });
          alert('Recipe updated successfully.');
        } else {
          await addRecipe(recipeData);
          alert('Recipe added successfully.');
        }
        router.push({ name: 'Search' });
      } catch (error) {
        console.error('Error saving recipe:', error);
        alert('Failed to save recipe.');
      }
    };

    onMounted(loadRecipe);

    return {
      recipeName,
      servings,
      ingredients,
      addIngredient,
      removeIngredient,
      saveRecipe,
      isEditing,
    };
  },
});
</script>
