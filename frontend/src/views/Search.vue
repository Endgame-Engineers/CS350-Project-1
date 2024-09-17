<template>
  <div class="container">
    <div class="search-bar">
      <input type="text" v-model="searchBar" placeholder="Search" />
      <router-link to="/BarScanner">
        <button class="btn btn-primary">
          <i class="bi bi-upc-scan"></i>
        </button>
      </router-link>
    </div>
    <div class="button-container">
      <button @click="clearSearchBar">Clear</button>
      <button @click="search">Search</button>
    </div>
    <div v-if="foodData">
      <h2>{{ foodData.foodname }}</h2>
      <p>Protein per serving: {{ foodData.protein_per_serv }}g</p>
      <p>Carbs per serving: {{ foodData.carb_per_serv }}g</p>
      <p>Fat per serving: {{ foodData.fat_per_serv }}g</p>
      <p>Grams per serving: {{ foodData.grams_per_serv }}g</p>
      <p>Calories per serving: {{ foodData.calories_per_serv }} kcal</p>
      <img :src="foodData.image" />
    </div>
  </div>
  <footer class="footer bg-light mt-auto py-3">
    <router-link to="/">
      <button class="btn btn-secondary">Home</button>
    </router-link>
    <router-link to="/Diary">
      <button class="btn btn-secondary">Diary</button>
    </router-link>
    <router-link to="/History">
      <button class="btn btn-secondary">History</button>
    </router-link>
    <router-link to="/Search">
      <button class="btn btn-secondary">Barcode Scan</button>
    </router-link>
  </footer>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { foodSearch } from '@/services/foodSearch';
import { barcodeReader } from '@/services/BarcodeScanner';

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
    const searchBar = ref('');
    const barcode = ref(useRoute().query.barcode || null);
    const foodData = ref<FoodItem | null>(null);
    const router = useRouter();

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

<style scoped></style>