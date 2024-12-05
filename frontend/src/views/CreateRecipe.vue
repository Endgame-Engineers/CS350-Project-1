<template>
  <div class="container">
    <h1>{{ isEditing ? 'Edit Recipe' : 'Create Recipe' }}</h1>
    <form @submit.prevent="saveRecipe">
      <!-- Recipe Name -->
      <div class="mb-3">
        <label for="recipeName" class="form-label">Recipe Name</label>
        <input type="text" class="form-control" id="recipeName" v-model="recipeStore.currentRecipe.name" required />
      </div>

      <!-- Servings -->
      <div class="mb-3">
        <label for="servings" class="form-label">Servings</label>
        <input type="number" class="form-control" id="servings" v-model="recipeStore.currentRecipe.servings" min="1"
          required />
      </div>

      <!-- Ingredients -->
      <div class="mb-3">
        <label class="form-label">Ingredients</label>
        <button type="button" class="btn btn-primary ms-2" @click="navigateToSearch">Add Ingredient</button>
        <div v-for="(ingredient, index) in recipeStore.ingredients" :key="index" class="input-group mb-2">
          <input type="text" class="form-control" v-model="ingredient.name" placeholder="Ingredient Name" readonly />
          <input type="number" class="form-control" v-model="ingredient.servings" placeholder="Servings" min="0.01"
            step="0.01" required @change="calculateMacronutrients" />
          <button type="button" class="btn btn-danger"
            @click="recipeStore.ingredients = recipeStore.ingredients.filter((_, i) => i !== index)">
            Remove
          </button>

        </div>
      </div>

      <!-- Macronutrient Summary -->
      <div class="mb-3">
        <h3>Macronutrient Summary</h3>
        <ul>
          <li><strong>Calories per serving:</strong> {{ macronutrientSummary.caloriesPerServing.toFixed(2) }} kcal</li>
          <li><strong>Protein per serving:</strong> {{ macronutrientSummary.proteinPerServing.toFixed(2) }} g</li>
          <li><strong>Carbs per serving:</strong> {{ macronutrientSummary.carbsPerServing.toFixed(2) }} g</li>
          <li><strong>Fat per serving:</strong> {{ macronutrientSummary.fatPerServing.toFixed(2) }} g</li>
        </ul>
      </div>

      <!-- Save Button -->
      <button type="submit" class="btn btn-outline-primary">
        {{ isEditing ? 'Update Recipe' : 'Save Recipe' }}
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { addRecipe, updateRecipe } from '@/services/Recipes';
import { useRecipeStore } from '@/stores/Recipe';
import { useUserStore } from '@/stores/User';
import { FoodItem, Recipe } from '@/models/Models';
import axios from 'axios';

export default defineComponent({
  name: 'CreateRecipe',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const recipeStore = useRecipeStore();
    const userStore = useUserStore();
    const isEditing = ref(false);
    const leavingPageTemporarily = ref(false);

    const macronutrientSummary = ref({
      caloriesPerServing: 0,
      proteinPerServing: 0,
      carbsPerServing: 0,
      fatPerServing: 0,
    });

    const navigateToSearch = () => {
      leavingPageTemporarily.value = true;
      const recipe = recipeStore.currentRecipe;
      const ingredientsMap = recipeStore.ingredients.reduce((map, ingredient) => {
        map[ingredient.barcode] = ingredient.servings;
        return map;
      }, {} as { [barcode: string]: number });

      router.push({
        name: 'Search',
        query: {
          source: 'createRecipe',
          id: route.query.id as string,
          name: recipe.name,
          servings: recipe.servings.toString(),
          ingredients: encodeURIComponent(JSON.stringify(ingredientsMap)),
        },
      });
    };

    const calculateMacronutrients = () => {
      let totalCalories = 0,
        totalProtein = 0,
        totalCarbs = 0,
        totalFat = 0;

      recipeStore.ingredients.forEach((ingredient) => {
        totalCalories += ingredient.calories_per_serv * ingredient.servings;
        totalProtein += ingredient.protein_per_serv * ingredient.servings;
        totalCarbs += ingredient.carb_per_serv * ingredient.servings;
        totalFat += ingredient.fat_per_serv * ingredient.servings;
      });

      const servings = recipeStore.currentRecipe.servings || 1;

      macronutrientSummary.value = {
        caloriesPerServing: totalCalories / servings || 0,
        proteinPerServing: totalProtein / servings || 0,
        carbsPerServing: totalCarbs / servings || 0,
        fatPerServing: totalFat / servings || 0,
      };

      // mark that the recipe has unsaved changes if they have edited servings or ingredient servings
      recipeStore.hasUnSavedChanges = true;
    };

    const saveRecipe = async () => {
      if (!recipeStore.currentRecipe.name.trim()) {
        alert('Recipe name is required.');
        return;
      }

      if (recipeStore.currentRecipe.servings < 1) {
        alert('Servings must be at least 1.');
        return;
      }

      if (recipeStore.ingredients.length === 0) {
        alert('At least one ingredient is required.');
        return;
      }

      await calculateMacronutrients();

      const newRecipe: Recipe = {
        id: isEditing.value ? Number(route.query.id) : undefined,
        userid: userStore.user.id ?? 0,
        name: recipeStore.currentRecipe.name.trim(),
        servings: recipeStore.currentRecipe.servings,
        ingredients: recipeStore.ingredients.reduce((acc, ingredient) => {
          acc[ingredient.barcode] = ingredient.servings;
          return acc;
        }, {} as { [barcode: string]: number }),
        dateadded: isEditing.value ? new Date(route.query.dateadded as string) : new Date(),
        lastupdated: new Date(),
        protein_per_serv: macronutrientSummary.value.proteinPerServing,
        carb_per_serv: macronutrientSummary.value.carbsPerServing,
        fat_per_serv: macronutrientSummary.value.fatPerServing,
        calories_per_serv: macronutrientSummary.value.caloriesPerServing,
        total_protein: macronutrientSummary.value.proteinPerServing * recipeStore.currentRecipe.servings,
        total_carbs: macronutrientSummary.value.carbsPerServing * recipeStore.currentRecipe.servings,
        total_fat: macronutrientSummary.value.fatPerServing * recipeStore.currentRecipe.servings,
        total_calories: macronutrientSummary.value.caloriesPerServing * recipeStore.currentRecipe.servings,
      };

      try {
        if (isEditing.value) {
          await updateRecipe(newRecipe);
        } else {
          await addRecipe(newRecipe);
        }
        recipeStore.clearStore(); // clear store on successful save
        router.push({ name: 'Search' });
      } catch (error) {
        console.error('Error saving recipe:', error);
        alert('Failed to save recipe.');
      }
    };

    // this is used to get the names of the ingredients from the barcodes (they are in barcode: servings format)
    const fetchIngredientDetails = async (barcodes: string[]) => {
      try {
        const response = await axios.post('/api/food-items', { barcodes });
        return response.data;
      } catch (error) {
        console.error('Error fetching ingredient details:', error);
        return [];
      }
    };

    watch(
      () => recipeStore.ingredients,
      () => calculateMacronutrients(),
      { deep: true }
    );

    watch(
      () => recipeStore.currentRecipe.servings,
      () => calculateMacronutrients()
    );

    onMounted(async () => {
      leavingPageTemporarily.value = false;

      const { id, name, servings, ingredients } = route.query;

      if (id) {
        isEditing.value = true;

        recipeStore.setCurrentRecipe(name as string, Number(servings));

        const parsedIngredients = ingredients
          ? JSON.parse(decodeURIComponent(ingredients as string))
          : {};

        const barcodes = Object.keys(parsedIngredients);
        const servingsMap = parsedIngredients;

        const ingredientDetails = await fetchIngredientDetails(barcodes);

        const newIngredients = ingredientDetails.map((item: FoodItem) => ({
          name: item.foodname,
          barcode: item.barcode,
          servings: servingsMap[item.barcode] || 0,
          protein_per_serv: item.protein_per_serv,
          carb_per_serv: item.carb_per_serv,
          fat_per_serv: item.fat_per_serv,
          calories_per_serv: item.calories_per_serv,
        }));

        recipeStore.ingredients = newIngredients;
      }

      calculateMacronutrients();
    });

    onBeforeUnmount(() => {
      if (leavingPageTemporarily.value) {
        return;
      }

      if (!recipeStore.hasUnSavedChanges) {
        recipeStore.clearStore();
      }
    });

    return {
      recipeStore,
      isEditing,
      macronutrientSummary,
      navigateToSearch,
      saveRecipe,
      calculateMacronutrients,
    };
  },
});
</script>
