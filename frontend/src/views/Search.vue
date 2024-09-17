<template>
  <div class="container py-5">
    <!-- Search Bar and Barcode Scanner -->
    <div class="input-group mb-3">
      <input 
        type="text" 
        v-model="searchBar" 
        class="form-control" 
        placeholder="Search for food" 
        aria-label="Search for food"
      />
      <router-link to="/BarScanner">
        <button class="btn btn-outline-primary" type="button">
          <i class="bi bi-upc-scan"></i> Scan
        </button>
      </router-link>
    </div>

    <!-- Action Buttons -->
    <div class="d-flex justify-content-between mb-3">
      <button @click="clearSearchBar" class="btn btn-secondary">Clear</button>
      <button @click="search" class="btn btn-primary">Search</button>
    </div>

    <!-- Food Data Display -->
    <div v-if="foodData" class="card mb-3">
      <div class="row g-0">
        <div class="col-md-4">
          <img :src="foodData.image" class="img-fluid rounded-start" alt="Food image">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">{{ foodData.foodname }}</h5>
            <p class="card-text"><strong>Protein:</strong> {{ foodData.protein_per_serv }}g</p>
            <p class="card-text"><strong>Carbs:</strong> {{ foodData.carb_per_serv }}g</p>
            <p class="card-text"><strong>Fat:</strong> {{ foodData.fat_per_serv }}g</p>
            <p class="card-text"><strong>Serving Size:</strong> {{ foodData.grams_per_serv }}g</p>
            <p class="card-text"><strong>Calories:</strong> {{ foodData.calories_per_serv }} kcal</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Navigation -->
    <footer class="footer bg-light mt-auto py-3">
      <div class="btn-group d-flex justify-content-between" role="group">
        <router-link to="/">
          <button class="btn btn-outline-secondary">Home</button>
        </router-link>
        <router-link to="/Diary">
          <button class="btn btn-outline-secondary">Diary</button>
        </router-link>
        <router-link to="/History">
          <button class="btn btn-outline-secondary">History</button>
        </router-link>
        <router-link to="/Search">
          <button class="btn btn-outline-secondary">Barcode Scan</button>
        </router-link>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { foodSearch } from '@/services/foodSearch';

interface FoodItem {
  id: number;
  foodname: string;
  barcode: string;
  protein_per_serv: number;
  carb_per_serv: number;
  fat_per_serv: number;
  grams_per_serv: number;
  calories_per_serv: number;
  image: string;
}

export default {
  name: 'SearchPage',
  setup() {
    const route = useRoute();
    const searchBar = ref('');
    const barcode = ref(route.query.string || null);
    const foodData = ref<FoodItem | null>(null);

    const search = async () => {
      if (searchBar.value) {
        const data = await foodSearch(searchBar.value);
        foodData.value = data;
      }
    };

    const clearSearchBar = () => {
      searchBar.value = '';
      foodData.value = null;
    };

    const barcodeNumSearch = async () => {
      if (barcode.value) {
        const data = await foodSearch(barcode.value as string);
        foodData.value = data;
      }
    };

    onMounted(() => {
      if (barcode.value) {
        barcodeNumSearch();
      }
    });

    return {
      searchBar,
      search,
      clearSearchBar,
      foodData,
      barcodeNumSearch,
    };
  },
};
</script>

