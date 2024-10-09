<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { FoodItem, SearchResult, MealLog } from '@/models/Models';
import { barcodeLookup, searchForProducts, } from '@/services/foodSearch';
import { useMealLogStore } from '@/stores/MealLog';
import router from '@/router';
import * as bootstrap from 'bootstrap';
import { logger } from '@/services/Logger';

export default {
  name: 'SearchPage',
  setup() {
    const mealLog: MealLog = {
      barcode: '',
      mealtype: '',
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
    const servingConsumed = ref<number>(0);

    logger.info('Checking if Mealog store container mealtype');
    const mealType = ref(useMealLogStore().getMealLog().mealtype);

    const search = async () => {
      if (searchBar.value) {
        logger.info('Searching for:', searchBar.value);
        logger.info('Testing for all digits');
        if (/^\d+$/.test(searchBar.value)) {
          logger.info('Found all digits in search bar');
          barcode.value = searchBar.value;
          barcodeNumSearch();
        } else {
          logger.info('Found non-digits in search bar');
          try {
            const data = await searchForProducts(searchBar.value, page.value) as SearchResult;
            if (data && Array.isArray(data.products)) {
              logger.info('Search results:', data.products);
              foodData.value = data.products;
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
              foodData.value = [...(foodData.value || []), ...data.products];
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
      const modal = new bootstrap.Modal(document.getElementById('servingModal')!);
      modal.show();
    };

    const confirmAddFoodItem = () => {
      if (selectedFoodItem.value) {
        logger.info('Adding food item:', selectedFoodItem.value);
        mealLog.barcode = selectedFoodItem.value.barcode;
        mealLog.mealtype = mealType.value || '';
        mealLog.dateadded = new Date();
        mealLog.servingconsumed = servingConsumed.value;
        logger.info('Adding meal log to store:', mealLog);
        useMealLogStore().setMealLog(mealLog);

        logger.info('Navigating to meal logs page');
        router.push({ path: '/meallogs' });

        const modal = bootstrap.Modal.getInstance(document.getElementById('servingModal')!);
        if (modal) {
          modal.hide();
        }
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
        <input type="text" v-model="searchBar" class="form-control" placeholder="Search for food"
          aria-label="Search for food" @keyup.enter="search" />
        <button @click="clearSearchBar" class="btn btn-secondary">
          <font-awesome-icon :icon="['fas', 'delete-left']" />
        </button>
        <button @click="search" class="btn btn-primary">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        </button>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-12 mb-3">
      <!-- Error message -->
      <div v-if="foodData && !foodData.length" class="alert alert-danger" role="alert">
        No results found
      </div>
      <!-- Food Data Display -->
      <div v-if="foodData && foodData.length">
        <div class="row row-cols-1 row-cols-md-2 g-4 h-auto">
          <div v-for="item in foodData" :key="item.barcode" class="col">
            <div class="card h-100 border rounded shadow-sm p-2">
              <div class="row g-0">
                <div class="col-md-4 d-flex align-items-center">
                  <img :src="item.image" class="img-fluid rounded-start" alt="Food image" style="max-height: 150px; object-fit: cover;">
                </div>
                <div class="col-md-8 d-flex flex-column">
                  <div class="card-body">
                    <h5 class="card-title">{{ item.foodname }}</h5>
                    <p class="card-text mb-1"><strong>Protein:</strong> {{ item.protein_per_serv.toFixed(2) }}g</p>
                    <p class="card-text mb-1"><strong>Carbs:</strong> {{ item.carb_per_serv.toFixed(2) }}g</p>
                    <p class="card-text mb-1"><strong>Fat:</strong> {{ item.fat_per_serv.toFixed(2) }}g</p>
                    <p class="card-text mb-1"><strong>Calories:</strong> {{ item.calories_per_serv.toFixed(2) }} kcal</p>
                    <p class="card-text"><strong>Barcode:</strong> {{ item.barcode }}</p>
                  </div>
                  <div class="mt-auto d-flex justify-content-end p-2">
                    <button @click="addFoodItem(item)" class="btn btn-primary w-100" type="button">Add</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button @click="loadMore" class="btn btn-primary mt-3">Load More</button>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="servingModal" tabindex="-1" aria-labelledby="servingModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="servingModalLabel">Enter Serving Consumed</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="selectedFoodItem">
            <div class="mb-3">
              <label for="servingConsumed" class="form-label">Serving Consumed (grams)</label>
              <input type="number" v-model="servingConsumed" class="form-control" id="servingConsumed" />
            </div>
            <div v-if="servingConsumed">
              <p><strong>Calories:</strong> {{ (selectedFoodItem.calories_per_serv * servingConsumed).toFixed(2)
                }} kcal</p>
              <p><strong>Protein:</strong> {{ (selectedFoodItem.protein_per_serv * servingConsumed).toFixed(2) }}
                g</p>
              <p><strong>Carbs:</strong> {{ (selectedFoodItem.carb_per_serv * servingConsumed).toFixed(2) }} g</p>
              <p><strong>Fat:</strong> {{ (selectedFoodItem.fat_per_serv * servingConsumed).toFixed(2) }} g</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button @click="confirmAddFoodItem" type="button" class="btn btn-primary">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>