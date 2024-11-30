<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { FoodItem, SearchResult, MealLog, MealType, Recipe } from '@/models/Models';
import { barcodeLookup, searchForProducts, } from '@/services/foodSearch';
import { getRecipes } from '@/services/Recipes';
import { useLogStore } from '@/stores/Log';
import router from '@/router';
import * as bootstrap from 'bootstrap';
import { logger } from '@/services/Logger';
import { useRecipeStore } from '@/stores/Recipe';

export default {
  name: 'SearchPage',
  setup() {
    const mealLog: MealLog = {
      barcode: '',
      mealtype: 'Breakfast' as MealType,
      servingconsumed: 0,
    };

    const route = useRoute();
    const searchBar = ref('');
    const requestQuery = ref(route.query.string || null);
    const barcode = ref(typeof requestQuery.value === 'string' && /^\d+$/.test(requestQuery.value) ? requestQuery.value : null);
    const searchTerm = ref(typeof requestQuery.value === 'string' && !/^\d+$/.test(requestQuery.value) ? requestQuery.value : null);
    const foodData = ref<FoodItem[] | null>(null);
    const page = ref(1);
    const selectedFoodItem = ref<FoodItem | null>(null);
    const servingConsumed = ref<number | null>(null);
    const isBarcode = ref(false);
    const invalidSearch = ref(false);
    const searchMode = ref<'food' | 'recipes'>('food');
    const recipeData = ref<Recipe[] | null>(null);
    const sourcePage = ref(route.query.source || null);
    const recipeToDelete = ref<Recipe | null>(null);

    logger.info('Checking if Mealog store container mealtype');
    const mealType = ref(useLogStore().getMealLog().mealtype);

    function containValidCharacters(str: string) {
      const alphanumericMatches = str.match(/[a-zA-Z0-9]/g) || [];
      const alphanumericRatio = alphanumericMatches.length / str.length;
      logger.info('Alphanumeric ratio:', alphanumericRatio);
      if (alphanumericRatio < .5) {
        invalidSearch.value = true;
        return true;
      }
      logger.info('No special characters found in search bar');
      return false;
    }

    const search = async () => {
      isBarcode.value = false;
      invalidSearch.value = false;
      if (searchBar.value) {
        logger.info('Searching for:', searchBar.value);
        logger.info('Testing for all digits');
        if (/^\d+$/.test(searchBar.value)) {
          logger.info('Found all digits in search bar');
          barcode.value = searchBar.value;
          isBarcode.value = true;
          barcodeNumSearch();
        } else {
          logger.info('Found non-digits in search bar');
          try {
            if (containValidCharacters(searchBar.value)) {
              throw new Error('Special characters found in search bar');
            }
            const data = await searchForProducts(searchBar.value, page.value) as SearchResult;
            if (data && Array.isArray(data.products)) {
              logger.info('Search results:', data.products);
              foodData.value = data.products.slice(0, 9);
            } else {
              foodData.value = [];
            }
          } catch (error) {
            logger.error('Error during search:', error);
            foodData.value = [];
          }
        }
      }
    };

    const clearSearchBar = () => {
      searchBar.value = '';
      foodData.value = null;
    };

    const loadMore = async () => {
      page.value += 1;
      if (searchBar.value) {
        if (/^\d+$/.test(searchBar.value)) {
          barcode.value = searchBar.value;
          barcodeNumSearch();
        } else {
          try {
            const data = await searchForProducts(searchBar.value, page.value);
            if (data && Array.isArray(data.products)) {
              foodData.value = [...(foodData.value || []), ...data.products.slice(0, 9)];
            }
          } catch (error) {
            console.error('Error during search:', error);
            foodData.value = [];
          }
        }
      }
    };

    const barcodeNumSearch = async () => {
      if (barcode.value) {
        logger.info('Searching for barcode:', barcode.value);
        const data = await barcodeLookup(barcode.value as string);

        if ('foodname' in data) {
          logger.info('Found food item:', data);
          foodData.value = [data];
        } else {
          foodData.value = [];
          logger.info('No food item found');
        }
      }
    };

    const addFoodItem = (item: FoodItem) => {
      selectedFoodItem.value = item;
      console.log('Selected food item:', selectedFoodItem.value);
      const modal = new bootstrap.Modal(document.getElementById('servingModal')!);
      modal.show();
    };

    const confirmAddFoodItem = () => {
      if (selectedFoodItem.value && servingConsumed.value !== null && servingConsumed.value > 0) {
        logger.info('Adding food item:', selectedFoodItem.value);

        // Check the source page
        if (sourcePage.value === 'createRecipe') {
          // Add the item to the Recipe store
          useRecipeStore().addIngredient({
            name: selectedFoodItem.value.foodname,
            barcode: selectedFoodItem.value.barcode,
            servings: servingConsumed.value,
            protein_per_serv: selectedFoodItem.value.protein_per_serv || 0,
            carb_per_serv: selectedFoodItem.value.carb_per_serv || 0,
            fat_per_serv: selectedFoodItem.value.fat_per_serv || 0,
            calories_per_serv: selectedFoodItem.value.calories_per_serv || 0,
          });

          // Navigate back to CreateRecipe.vue
          logger.info('Navigating back to CreateRecipe.vue');
          router.push({ name: 'CreateRecipe' });
        } else {
          // Adding to meal logs
          logger.info('Adding food item to meal logs');

          // Determine if the selected item is a recipe
          if (searchMode.value === 'recipes') {
            logger.info('Adding recipe to meal log:', selectedFoodItem.value);
            mealLog.barcode = 'Recipe';
            mealLog.mealtype = mealType.value || '';
            mealLog.recipeName = selectedFoodItem.value.recipeName || '';
            mealLog.recipeid = selectedFoodItem.value.recipeid || 0;
          } else {
            mealLog.barcode = selectedFoodItem.value.barcode;
            mealLog.mealtype = mealType.value || '';
          }

          mealLog.dateadded = useLogStore().getMealLog().dateadded;
          mealLog.servingconsumed = servingConsumed.value ?? 0;

          logger.info('Adding meal log to store:', mealLog);
          useLogStore().setMealLog(mealLog);

          logger.info('Navigating to meal logs page');
          router.push({ path: '/logs' });
        }

        // Close the modal if open
        const modal = bootstrap.Modal.getInstance(document.getElementById('servingModal')!);
        if (modal) {
          modal.hide();
        }
      } else {
        logger.error('No selected food item or invalid serving size');
        alert('Please select a valid food item and enter a serving size.');
      }
    };



    const toggleSearchMode = async () => {
      searchMode.value = searchMode.value === 'food' ? 'recipes' : 'food';
      searchBar.value = '';
      foodData.value = null;
      recipeData.value = null;

      if (searchMode.value === 'recipes') {
        try {
          const response = await getRecipes();
          recipeData.value = response;
          console.log('Fetched recipes:', recipeData.value);
        } catch (error) {
          console.error('Error fetching recipes:', error);
        }
      }
    };

    const convertRecipeToFoodItem = (recipe: Recipe): FoodItem => {
      console.log('Converting recipe to food item:', recipe);
      return {
        foodname: recipe.name,
        barcode: 'Recipe', // Placeholder for recipes
        image: 'img/No-Image-Placeholder.svg', // Placeholder image
        calories_per_serv: recipe.calories_per_serv,
        protein_per_serv: recipe.protein_per_serv,
        carb_per_serv: recipe.carb_per_serv,
        fat_per_serv: recipe.fat_per_serv,
        recipeid: recipe.id, // Add recipe ID for logging
        recipeName: recipe.name, // Add recipe name for logging
      };
    };

    const confirmRecipeDelete = async () => {
      if (recipeToDelete.value) {
        try {
          // Call the API to delete the recipe
          await axios.delete(`api/user/recipes/${recipeToDelete.value.id}`);
          // Remove the deleted recipe from the UI
          recipeData.value = recipeData.value?.filter((r) => r.id !== recipeToDelete.value?.id) || null;
          logger.info(`Recipe "${recipeToDelete.value.name}" deleted successfully.`);
        } catch (error) {
          logger.error('Error deleting recipe:', error);
          alert('Failed to delete the recipe. Please try again.');
        } finally {
          recipeToDelete.value = null;
        }
      }
    };

    const cancelRecipeDelete = () => {
      recipeToDelete.value = null;
    };

    const editRecipeHandler = (recipe: Recipe) => {
      router.push({
        name: 'CreateRecipe',
        query: {
          id: (recipe.id ?? '').toString(),
          name: recipe.name,
          servings: recipe.servings.toString(),
          ingredients: JSON.stringify(recipe.ingredients),
        },
      });
    };

    const removeRecipe = (recipe: Recipe) => {
      recipeToDelete.value = recipe;
      const modal = new bootstrap.Modal(document.getElementById('confirmDeleteRecipeModal')!);
      modal.show();
    };

    const navigateToCreateRecipe = () => {
      useRecipeStore().clearStore();
      router.push({ name: 'CreateRecipe' });
    };

    const handleInputChange = (event: Event) => {
      const value = (event.target as HTMLInputElement).value;

      if (value === '') {
        servingConsumed.value = null;
      } else {
        servingConsumed.value = Number(value);
      }
    };

    onMounted(() => {
      if (barcode.value) {
        logger.info('Barcode found in query:', barcode.value);
        barcodeNumSearch();
      }
      if (searchTerm.value) {
        logger.info('Search term found in query:', searchTerm.value);
        searchBar.value = searchTerm.value;
        search();
      }
    });

    return {
      searchBar,
      search,
      clearSearchBar,
      foodData,
      barcodeNumSearch,
      addFoodItem,
      loadMore,
      selectedFoodItem,
      servingConsumed,
      confirmAddFoodItem,
      isBarcode,
      invalidSearch,
      handleInputChange,
      setServingConsumedNull: () => servingConsumed.value = null,
      toggleSearchMode,
      searchMode,
      recipeData,
      convertRecipeToFoodItem,
      editRecipeHandler,
      navigateToCreateRecipe,
      confirmRecipeDelete,
      cancelRecipeDelete,
      recipeToDelete,
      removeRecipe,
    };
  },
};
</script>

<template>
  <div class="row">
    <div class="col-12 mb-3">
      <div class="input-group mb-4">
        <!-- Search Bar and Barcode Scanner -->
        <router-link to="/barscanner">
          <button class="btn btn-primary">
            <font-awesome-icon :icon="['fas', 'barcode']" />
          </button>
        </router-link>
        <input type="text" v-model="searchBar" class="form-control" placeholder="Search for food or recipes"
          aria-label="Search for food or recipes" @keyup.enter="search" />
        <button @click="clearSearchBar" class="btn btn-secondary">
          <font-awesome-icon :icon="['fas', 'delete-left']" />
        </button>
        <button @click="search" class="btn btn-primary">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        </button>
      </div>
      <div class="d-flex justify-content-end mb-3">
        <button @click="toggleSearchMode" class="btn btn-outline-primary me-2">
          {{ searchMode === 'food' ? 'Search Recipes' : 'Search Food' }}
        </button>
        <button @click="navigateToCreateRecipe()" class="btn btn-outline-primary">
          <!-- TODO: this button will need to map to a CreateRecipes.vue that will have a UI to allow the user to enter all the ingredients with their recipe and give it a name and such -->
          Create Recipe
        </button>
      </div>
    </div>
  </div>
  <div class="col-12 mb-3">
    <!-- Error message -->
    <div v-if="invalidSearch" class="alert alert-danger" role="alert">
      Invalid Input
    </div>
    <div v-if="foodData && !foodData.length && !invalidSearch" class="alert alert-danger" role="alert">
      No results found
    </div>
    <!-- Food Data Display -->
    <div v-if="foodData && foodData.length">
      <div class="row">
        <div v-for="item in foodData" :key="item.barcode" class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="card h-100">
            <img :src="item.image" class="card-img-top food-image" alt="Food image" />
            <div class="card-body">
              <h5 class="card-title">{{ item.foodname }}</h5>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  Calories: {{ item.calories_per_serv.toFixed(2) }} kcal
                </li>
                <li class="list-group-item">
                  Protein: {{ item.protein_per_serv.toFixed(2) }} g
                </li>
                <li class="list-group-item">
                  Carbs: {{ item.carb_per_serv.toFixed(2) }} g
                </li>
                <li class="list-group-item">
                  Fat: {{ item.fat_per_serv.toFixed(2) }} g
                </li>
              </ul>
            </div>
            <div class="card-footer text-muted d-flex align-items-center">
              <div class="justify-content-center"><font-awesome-icon :icon="['fas', 'barcode']" /> {{ item.barcode }}
              </div>
              <button @click="addFoodItem(item)" class="btn btn-primary ms-auto" type="button"><font-awesome-icon
                  :icon="['fas', 'plus']" /></button>
            </div>
          </div>
        </div>
      </div>
      <button v-if="!isBarcode" @click="loadMore" class="btn btn-primary mt-3">Load More</button>
    </div>

    <div v-if="searchMode === 'recipes' && recipeData && recipeData.length">
      <div class="row">
        <div v-for="recipe in recipeData" :key="recipe.id" class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ recipe.name }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Servings in Recipe: {{ recipe.servings }}</h6>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  Calories per Serving: {{ recipe.calories_per_serv.toFixed(2) }} kcal
                </li>
                <li class="list-group-item">
                  Protein per Serving: {{ recipe.protein_per_serv.toFixed(2) }} g
                </li>
                <li class="list-group-item">
                  Carbs per Serving: {{ recipe.carb_per_serv.toFixed(2) }} g
                </li>
                <li class="list-group-item">
                  Fats per Serving: {{ recipe.fat_per_serv.toFixed(2) }} g
                </li>
              </ul>
            </div>
            <div class="card-footer text-muted d-flex align-items-center">
              <button class="btn btn-outline-primary btn-icon" @click="removeRecipe(recipe)">
                <font-awesome-icon :icon="['fas', 'trash']" />
              </button>
              <button class="btn btn-outline-primary btn-icon ms-2" @click="editRecipeHandler(recipe)">
                <font-awesome-icon :icon="['fas', 'pencil-alt']" />
              </button>
              <button class="btn btn-primary btn-icon ms-auto" @click="addFoodItem(convertRecipeToFoodItem(recipe))">
                <font-awesome-icon :icon="['fas', 'plus']" />
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>

  </div>


  <!-- Modal -->
  <div class="modal fade" id="servingModal" tabindex="-1" aria-labelledby="servingModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="servingModalLabel">Enter Grams Consumed</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
            @click="setServingConsumedNull"></button>
        </div>
        <div class="modal-body">
          <div v-if="selectedFoodItem">
            <div class="mb-3">
              <label for="servingConsumed" class="form-label">Grams Consumed</label>
              <input type="number" placeholder="Enter the amount in grams" v-model="servingConsumed"
                class="form-control" id="servingConsumed" @input="handleInputChange" />
            </div>
            <div v-if="servingConsumed && servingConsumed > 0">
              <p><strong>Calories:</strong> {{ (selectedFoodItem.calories_per_serv * servingConsumed).toFixed(2)
                }} kcal</p>
              <p><strong>Protein:</strong> {{ (selectedFoodItem.protein_per_serv * servingConsumed).toFixed(2) }}
                g</p>
              <p><strong>Carbs:</strong> {{ (selectedFoodItem.carb_per_serv * servingConsumed).toFixed(2) }} g</p>
              <p><strong>Fat:</strong> {{ (selectedFoodItem.fat_per_serv * servingConsumed).toFixed(2) }} g</p>
            </div>
            <div v-if="servingConsumed !== null && servingConsumed <= 0" class="alert alert-danger" role="alert">
              Must be greater than 0
            </div>
            <div v-if="servingConsumed !== null && servingConsumed > 1000" class="alert alert-danger" role="alert">
              Consumed amount must be less than or equal to 1000 grams
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
            @click="setServingConsumedNull">Close</button>
          <button @click="confirmAddFoodItem"
            :disabled="servingConsumed === null || servingConsumed <= 0 || servingConsumed > 1000" type="button"
            class="btn btn-primary">Add</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="confirmDeleteRecipeModal" tabindex="-1" aria-labelledby="confirmDeleteRecipeModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmDeleteRecipeModalLabel">Confirm Deletion</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
            @click="cancelRecipeDelete"></button>
        </div>
        <div class="modal-body">
          Are you sure you want to delete "{{ recipeToDelete?.name }}"?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="cancelRecipeDelete">
            Cancel
          </button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="confirmRecipeDelete">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>


</template>