<template>
    <div class="container">
      <div class="search-bar">
        <input type="text" v-model="searchBar" placeholder="Search">
        <button class="camera-btn">
          <!---<img src="@/assets/camera-icon.png" alt="Camera">-->
        </button>
      </div>
      <div class="button-container">
        <button @click="clearSearchBar">Clear</button>
        <button @click="search">Search</button>
      </div>
      <div v-if="foodData">
        <h2>{{ foodData?.foodname }}</h2>
        <p>Protein per serving: {{ foodData?.protein_per_serv }}g</p>
        <p>Carbs per serving: {{ foodData?.carb_per_serv }}g</p>
        <p>Fat per serving: {{ foodData?.fat_per_serv }}g</p>
        <p>Grams per serving: {{ foodData?.grams_per_serv }}g</p>
        <p>Calories per serving: {{ foodData?.calories_per_serv }} kcal</p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  interface FoodItem {
    id: number;
    foodname: string;
    barcode: string;
    protein_per_serv: number;
    carb_per_serv: number;
    fat_per_serv: number;
    grams_per_serv: number;
    calories_per_serv: number;
  }
  
  export default defineComponent({
    name: 'App',
    data() {
      return{
        searchBar: '',
        foodData: null as FoodItem | null,
        foodList: [] as FoodItem[],
      };
    },
    methods: {
      async search(){
        try {
          const resp = await fetch(`https://carbio.fit/api/food-items/${this.searchBar}`);
          
          if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
          }
  
          const data = await resp.json();
          this.foodData = data;
        } catch (error) {
          console.error('Error fetching the API:', error);
          this.foodData = null;
        }
        //const resp : FoodItem = 
          // {
          //   id: 8,
          //   foodname: "Peach",
          //   barcode: "382538093985",
          //   protein_per_serv: 1.67,
          //   carb_per_serv: 40.4,
          //   fat_per_serv: 27.15,
          //   grams_per_serv: 286.78,
          //   calories_per_serv: 148.93
          // };
      },
      clearSearchBar(){
        this.searchBar = '';
        this.foodData = null;
      }
    },
    components: {
  }
  });
  </script>
  
  <style>
  
  </style>