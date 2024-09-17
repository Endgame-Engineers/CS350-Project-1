<template>
  <div class="container">
    <div class="search-bar">
      <input type="text" v-model="searchBar" placeholder="Search">
      <router-link to="/BarScanner">
      <button class="btn btn-primary">
        <font-awesome-icon :icon="['fas', 'barcode']" />
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
      <img :src="foodData.image">
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
import { defineComponent } from 'vue';
import { foodSearch } from '@/services/foodSearch';
import { useRoute } from 'vue-router';
import { ref } from 'vue';

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

export default defineComponent({
  name: 'App',
  data() {
    return{
      searchBar: '',
      foodData: null as FoodItem | null,
    };
  },
  methods: {
    async search(): Promise<void>{
      const data = await foodSearch(this.searchBar);
      this.foodData = data
    },
    clearSearchBar(){
      this.searchBar = '';
      this.foodData = null;
    }
  },
  setup() {
    const route = useRoute();
    const scannerInfo = ref<FoodItem | null>(null);
    scannerInfo.value = route.query.code as FoodItem | null;
    return{
      scannerInfo,
    }
  }
});
</script>

<style scoped>
</style>