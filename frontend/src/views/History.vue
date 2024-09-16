<template>
  <div>
    <h2>Food Item History</h2>
    <div v-for="item in foodItems" :key="item.name + item.date" class="card mb-3">
      <div class="card-header">{{ item.date }}</div>
      <div class="card-body">
        <strong>{{ item.name }}</strong>
        <p>Date added: {{ item.date }}</p>
        <p>Calories: {{ item.calories }}</p>
        <p>Protein: {{ item.protein }}g</p>
        <p>Carbs: {{ item.carbs }}g</p>
        <p>Fat: {{ item.fat }}g</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface FoodItem {
  date: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default defineComponent({
  name: 'HistoryPage',
  data() {
    return {
      foodItems: [] as FoodItem[],
    };
  },
  created() {
    // Mock data for now, replace with API call if needed
    this.foodItems = [
      {
        date: '2024-09-10',
        name: 'Chicken Salad',
        calories: 300,
        protein: 25,
        carbs: 10,
        fat: 15,
      },
      {
        date: '2024-09-10',
        name: 'Apple',
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
      },
      {
        date: '2024-09-11',
        name: 'Omelette',
        calories: 200,
        protein: 15,
        carbs: 2,
        fat: 14,
      },
    ];
  },
});
</script>
  <style scoped>
  h1 {
    color: #42b983;
  }
  </style>