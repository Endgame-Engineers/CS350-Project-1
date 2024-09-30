<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { FoodItem, SearchResult, MealLog } from '@/models/Models';
import { barcodeLookup, searchForProducts, } from '@/services/foodSearch';
import { useMealLogStore } from '@/stores/MealLog';
import router from '@/router';
import * as bootstrap from 'bootstrap';

export default {
  name: 'SearchPage',
  setup() {
    const mealLog: MealLog = {
      barcode: '',
      mealtype: '',
      servingconsumed: 0,
    };

    const route = useRoute();
    const mealType = ref<string | null>(route.query.mealType as string || null);
    const searchBar = ref('');
    const requestQuery = ref(route.query.string || null);
    const barcode = ref(typeof requestQuery.value === 'string' && /^\d+$/.test(requestQuery.value) ? requestQuery.value : null);
    const searchTerm = ref(typeof requestQuery.value === 'string' && !/^\d+$/.test(requestQuery.value) ? requestQuery.value : null);
    const foodData = ref<FoodItem[] | null>(null);
    const page = ref(1);
    const selectedFoodItem = ref<FoodItem | null>(null);
    const servingConsumed = ref<number>(0);

    const search = async () => {
      if (searchBar.value) {
        if (/^\d+$/.test(searchBar.value)) {
          barcode.value = searchBar.value;
          barcodeNumSearch();
        } else {
          try {
            const data = await searchForProducts(searchBar.value, page.value) as SearchResult;
            if (data && Array.isArray(data.products)) {
              foodData.value = data.products;
            } else {
              foodData.value = [];
            }
          } catch (error) {
            console.error('Error during search:', error);
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
        const data = await barcodeLookup(barcode.value as string);

        if ('foodname' in data) {
          foodData.value = [data];
        } else {
          foodData.value = [];
          console.log('Error during barcode lookup:', data.message);
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
        mealLog.barcode = selectedFoodItem.value.barcode;
        mealLog.mealtype = mealType.value || '';
        mealLog.dateadded = new Date();
        mealLog.servingconsumed = servingConsumed.value;
        useMealLogStore().setMealLog(mealLog);
        router.push({ path: '/history' });

        const modal = bootstrap.Modal.getInstance(document.getElementById('servingModal')!);
        if (modal) {
          modal.hide();
        }
      }
    };

    onMounted(() => {
      if (barcode.value) {
        barcodeNumSearch();
      }
      if (searchTerm.value) {
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
    <div class="col-12 col-md-4 mb-3">
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
    <div class="col-12 col-md-4 mb-3">
      <!-- Error message -->
      <div v-if="foodData && !foodData.length" class="alert alert-danger" role="alert">
        No results found
      </div>
      <!-- Food Data Display -->
      <div v-if="foodData && foodData.length" style="max-height: 80%; overflow-y: auto;">
        <div v-for="item in foodData" :key="item.barcode" class="card mb-3">
          <div class="row g-0">
            <div class="col-md-4">
              <img :src="item.image" class="img-fluid rounded-start" alt="Food image">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">{{ item.foodname }}</h5>
                <p class="card-text"><strong>Protein:</strong> {{ item.protein_per_serv }}g</p>
                <p class="card-text"><strong>Carbs:</strong> {{ item.carb_per_serv }}g</p>
                <p class="card-text"><strong>Fat:</strong> {{ item.fat_per_serv }}g</p>
                <p class="card-text"><strong>Calories:</strong> {{ item.calories_per_serv }} kcal</p>
                <p class="card-text"><strong>Barcode:</strong> {{ item.barcode }}</p>
              </div>
              <div class="mt-auto text-end pb-2 pe-2">
                <button @click="addFoodItem(item)" class="btn btn-primary" type="button">Add</button>
              </div>
            </div>
          </div>
        </div>
        <button @click="loadMore" class="btn btn-primary mt-3">Load More</button>
      </div>
    </div>
    <div class="col-12 col-md-4 mb-3">
      <h1>Coming Soonish</h1>
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