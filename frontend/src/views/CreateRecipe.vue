<template>
  <div class="container">
    <h1>{{ isEditing ? 'Edit Recipe' : 'Create Recipe' }}</h1>
    <form @submit.prevent="saveRecipe">
      <!-- Recipe Name -->
      <div class="mb-3">
        <label for="recipeName" class="form-label">Recipe Name</label>
        <input
          type="text"
          class="form-control"
          id="recipeName"
          v-model="recipeStore.currentRecipe.name"
          required
        />
      </div>

      <!-- Servings -->
      <div class="mb-3">
        <label for="servings" class="form-label">Servings</label>
        <input
          type="number"
          class="form-control"
          id="servings"
          v-model="recipeStore.currentRecipe.servings"
          min="1"
          required
        />
      </div>

      <!-- Ingredients -->
      <div class="mb-3">
        <label class="form-label">Ingredients</label>
        <button type="button" class="btn btn-primary ms-2" @click="navigateToSearch">Add Ingredient</button>
        <div v-for="(ingredient, index) in recipeStore.ingredients" :key="index" class="input-group mb-2">
          <input
            type="text"
            class="form-control"
            v-model="ingredient.name"
            placeholder="Ingredient Name"
            readonly
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
          <button type="button" class="btn btn-danger" @click="recipeStore.ingredients.splice(index, 1)">
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
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { addRecipe, updateRecipe } from '@/services/Recipes';
import { useRecipeStore } from '@/stores/Recipe';
import { useUserStore } from '@/stores/User';
import { Recipe } from '@/models/Models';

export default defineComponent({
  name: 'CreateRecipe',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const recipeStore = useRecipeStore();
    const userStore = useUserStore();
    const isEditing = ref(false);

    // Macronutrient summary
    const macronutrientSummary = ref({
      caloriesPerServing: 0,
      proteinPerServing: 0,
      carbsPerServing: 0,
      fatPerServing: 0,
    });

    // Navigate to Search.vue
    const navigateToSearch = () => {
      recipeStore.saveCurrentRecipeState();
      router.push({ name: 'Search', query: { source: 'createRecipe' } });
    };

    // Calculate macronutrients
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

    await calculateMacronutrients(); // Ensure macronutrients are up-to-date

    const newRecipe: Recipe = {
        id: isEditing.value ? Number(route.query.id) : undefined, // Include `id` if editing
        userid: userStore.user.id ?? 0, // Ensure `userid` is set
        name: recipeStore.currentRecipe.name.trim(), // Recipe name
        servings: recipeStore.currentRecipe.servings, // Number of servings
        ingredients: recipeStore.ingredients.reduce((acc, ingredient) => {
            acc[ingredient.barcode] = ingredient.servings;
            return acc;
        }, {} as { [barcode: string]: number }), // Barcode-to-servings map
        dateadded: isEditing.value ? new Date(route.query.dateadded as string) : new Date(), // Date added
        lastupdated: new Date(), // Last updated timestamp
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
            await updateRecipe(newRecipe); // Update existing recipe
        } else {
            await addRecipe(newRecipe); // Add new recipe
        }
        recipeStore.clearIngredients(); // Clear ingredients from store after saving
        router.push({ name: 'Search' }); // Navigate to the recipe list page
    } catch (error) {
        console.error('Error saving recipe:', error);
        alert('Failed to save recipe.');
    }
};


    onMounted(() => {
      const { id, name, servings } = route.query;
      if (id) {
        isEditing.value = true;
        recipeStore.setCurrentRecipe(name as string, Number(servings));
      }
    });

    watch(
      () => recipeStore.ingredients,
      calculateMacronutrients,
      { deep: true }
    );

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
