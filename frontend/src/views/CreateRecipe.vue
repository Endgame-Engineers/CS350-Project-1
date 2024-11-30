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
            @change="calculateMacronutrients"
          />
          <button type="button" class="btn btn-danger" @click="removeIngredient(index)">Remove</button>
        </div>
      </div>
      <div class="mb-3">
        <h3>Macronutrient Summary</h3>
        <ul>
          <li><strong>Calories per serving:</strong> {{ macronutrientSummary.caloriesPerServing.toFixed(2) }} kcal</li>
          <li><strong>Protein per serving:</strong> {{ macronutrientSummary.proteinPerServing.toFixed(2) }} g</li>
          <li><strong>Carbs per serving:</strong> {{ macronutrientSummary.carbsPerServing.toFixed(2) }} g</li>
          <li><strong>Fat per serving:</strong> {{ macronutrientSummary.fatPerServing.toFixed(2) }} g</li>
        </ul>
        <h3>Total Macronutrients</h3>
        <ul>
          <li><strong>Total Calories:</strong> {{ Number(macronutrientSummary.caloriesPerServing.toFixed(2)) * servings }} kcal</li>
          <li><strong>Total Protein:</strong> {{ Number(macronutrientSummary.proteinPerServing.toFixed(2)) * servings }} g</li>
          <li><strong>Total Carbs:</strong> {{ Number(macronutrientSummary.carbsPerServing.toFixed(2)) * servings }} g</li>
          <li><strong>Total Fat:</strong> {{ Number(macronutrientSummary.fatPerServing.toFixed(2)) * servings }} g</li>
        </ul>
      </div>
      <button type="submit" class="btn btn-outline-primary">
        {{ isEditing ? 'Update Recipe' : 'Save Recipe' }}
      </button>
    </form>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { FoodItem, Recipe } from '@/models/Models';
import { addRecipe, updateRecipe } from '@/services/Recipes';
import { useUserStore } from '@/stores/User';
import axios from 'axios'; // Axios for making API requests

export default defineComponent({
  name: 'CreateRecipe',
  setup() {
    const recipeName = ref('');
    const servings = ref(1);
    const ingredients = ref<{ barcode: string; servings: number }[]>([]);
    const macronutrientSummary = ref({
      caloriesPerServing: 0,
      proteinPerServing: 0,
      carbsPerServing: 0,
      fatPerServing: 0,
    });
    const isEditing = ref(false);
    const router = useRouter();
    const route = useRoute();
    const userStore = useUserStore();
    const user = userStore.user;

    const loadRecipe = () => {
      const recipeId = route.query.id;
      if (recipeId) {
        isEditing.value = true;
        recipeName.value = (route.query.name as string) || '';
        servings.value = parseInt(route.query.servings as string, 10) || 1;

        try {
          const ingredientsParam = route.query.ingredients as string;
          const parsedIngredients = ingredientsParam
            ? JSON.parse(decodeURIComponent(ingredientsParam))
            : {};
          ingredients.value = Object.entries(parsedIngredients).map(([barcode, servings]) => ({
            barcode,
            servings: Number(servings),
          }));
        } catch (error) {
          console.error('Error parsing ingredients:', error);
          ingredients.value = [];
        }
      }
    };

    const addIngredient = () => {
      ingredients.value.push({ barcode: '', servings: 1 });
    };

    const removeIngredient = (index: number) => {
      ingredients.value.splice(index, 1);
    };

    const fetchFoodItems = async (barcodes: string[]) => {
      try {
        const response = await axios.post('/api/food-items', { barcodes });
        return response.data; // An array of food items
      } catch (error) {
        console.error('Error fetching food items:', error);
        return [];
      }
    };

    const calculateMacronutrients = async () => {
      const barcodes = ingredients.value.map((ingredient) => ingredient.barcode);
      const foodItems = await fetchFoodItems(barcodes);

      let totalCalories = 0,
        totalProtein = 0,
        totalCarbs = 0,
        totalFat = 0;

      for (const ingredient of ingredients.value) {
        const foodItem = foodItems.find((item: FoodItem) => item.barcode === ingredient.barcode);
        if (foodItem) {
          const servings = ingredient.servings;
          totalCalories += foodItem.calories_per_serv * servings;
          totalProtein += foodItem.protein_per_serv * servings;
          totalCarbs += foodItem.carb_per_serv * servings;
          totalFat += foodItem.fat_per_serv * servings;
        }
      }

      macronutrientSummary.value.caloriesPerServing = totalCalories / servings.value || 0;
      macronutrientSummary.value.proteinPerServing = totalProtein / servings.value || 0;
      macronutrientSummary.value.carbsPerServing = totalCarbs / servings.value || 0;
      macronutrientSummary.value.fatPerServing = totalFat / servings.value || 0;
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

      await calculateMacronutrients(); // Ensure macronutrients are up-to-date before saving

      const newRecipe: Recipe = {
        userid: user.id ?? 0,
        name: recipeName.value,
        ingredients: ingredients.value.reduce((acc, ingredient) => {
          acc[ingredient.barcode] = ingredient.servings;
          return acc;
        }, {} as { [barcode: string]: number }),
        servings: servings.value,
        dateadded: isEditing.value ? new Date() : new Date(),
        lastupdated: new Date(),
        protein_per_serv: macronutrientSummary.value.proteinPerServing,
        carb_per_serv: macronutrientSummary.value.carbsPerServing,
        fat_per_serv: macronutrientSummary.value.fatPerServing,
        calories_per_serv: macronutrientSummary.value.caloriesPerServing,
        total_protein: macronutrientSummary.value.proteinPerServing * servings.value,
        total_carbs: macronutrientSummary.value.carbsPerServing * servings.value,
        total_fat: macronutrientSummary.value.fatPerServing * servings.value,
        total_calories: macronutrientSummary.value.caloriesPerServing * servings.value,
        ...(isEditing.value && { id: Number(route.query.id) }), // Include `id` when editing
      };

      try {
        if (isEditing.value) {
          await updateRecipe(newRecipe);
        } else {
          await addRecipe(newRecipe);
        }
        router.push({ name: 'Search' });
      } catch (error) {
        console.error('Error saving recipe:', error);
        alert('Failed to save recipe.');
      }
    };

    onMounted(() => {
      loadRecipe();
    });

    // Recalculate macronutrients dynamically on ingredients or servings change
    watch([ingredients, servings], calculateMacronutrients, { deep: true });

    return {
      recipeName,
      servings,
      ingredients,
      macronutrientSummary,
      addIngredient,
      removeIngredient,
      saveRecipe,
      isEditing,
      calculateMacronutrients,
    };
  },
});
</script>