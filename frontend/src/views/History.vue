<template>
  <h1>Meal Logs</h1>
  <div class="row">
    <div class="col-12 col-md-4 mb-3">
      <h2 class="text-center">Breakfast</h2>
      <template v-for="item in mealLogs" :key="item.barcode + item.dateadded">
        <div v-if="item.mealtype.toLowerCase().includes('breakfast')" class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">
              {{ item.dateadded }}
            </h5>
            <p class="card-text">
              {{ item.servingconsumed }} servings of {{ item.barcode }}
            </p>
          </div>
        </div>
      </template>
    </div>
    <div class="col-12 col-md-4 mb-3">
      <h2 class="text-center">Lunch</h2>
      <template v-for="item in mealLogs" :key="item.barcode + item.dateadded">
        <div v-if="item.mealtype.toLowerCase().includes('lunch')" class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">
              {{ item.dateadded }}
            </h5>
            <p class="card-text">
              {{ item.servingconsumed }} servings of {{ item.barcode }}
            </p>
          </div>
        </div>
      </template>
    </div>
    <div class="col-12 col-md-4 mb-3">
      <h2 class="text-center">Dinner</h2>
      <template v-for="item in mealLogs" :key="item.barcode + item.dateadded">
        <div v-if="item.mealtype.toLowerCase().includes('dinner')" class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">
              {{ item.dateadded }}
            </h5>
            <p class="card-text">
              {{ item.servingconsumed }} servings of {{ item.barcode }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { FoodItem, MealLog } from '@/models/Models';

export default defineComponent({
  name: 'HistoryPage',
  data() {
    return {
      mealLogs: [] as MealLog[]
    };
  },
  async created() {
    const response = await axios.get('/api/user/logs?all=true');
    this.mealLogs = response.data;
    this.mealLogs = this.mealLogs.map((log: MealLog) => {
      log.dateadded = new Date(log.dateadded).toLocaleString();
      return log;
    });
  }
});
</script>