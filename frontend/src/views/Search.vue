<template>
  <div class="row">
    <div class="col-12 col-md-4 mb-3">
      <!-- Search Bar and Barcode Scanner -->
      <router-link to="/BarScanner">
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
    <!-- Food Data Display -->
    <div v-if="foodData && foodData.length">
      <div v-for="item in foodData" :key="item.id" class="card mb-3">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-12 col-md-4 mb-3">
    <h1>Coming Soonish</h1>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { barcodeLookup, searchForProducts, FoodItem, SearchResult } from '@/services/foodSearch';

export default {
  name: 'SearchPage',
  setup() {
    const route = useRoute();
    const searchBar = ref('');
    const requestQuery = ref(route.query.string || null);
    const barcode = ref(typeof requestQuery.value === 'string' && /^\d+$/.test(requestQuery.value) ? requestQuery.value : null);
    const searchTerm = ref(typeof requestQuery.value === 'string' && !/^\d+$/.test(requestQuery.value) ? requestQuery.value : null);
    const foodData = ref<FoodItem[] | null>(null);

    const search = async () => {
      if (searchBar.value) {
        if (/^\d+$/.test(searchBar.value)) {
          barcode.value = searchBar.value;
          barcodeNumSearch();
        } else {
          try {
            const data = await searchForProducts(searchBar.value);
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

    const barcodeNumSearch = async () => {
      if (barcode.value) {
        try {
          const data = await barcodeLookup(barcode.value as string);
          foodData.value = [data];
        } catch (error) {
          foodData.value = [];
          console.error('Error during barcode lookup:', error);
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
    };
  },
};
</script>
