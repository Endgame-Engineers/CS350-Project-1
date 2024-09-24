<template>
  <h1>Meal Logs</h1>
  <div>
    <form @submit.prevent="addMealLog">   
      <div>
    <h1>Meal Logs</h1>
    <form @submit.prevent="addMealLog">
      <div class="form-group">
        <label for="barcode">Barcode</label>
        <input
          type="text"
          v-model="newMeal.barcode"
          class="form-control"
          id="barcode"
          placeholder="Enter food barcode"
        />
      </div>   
      <div class="form-group">
        <label for="serving">Serving Consumed</label>
        <input
          type="number"
          v-model="newMeal.servingconsumed"
          class="form-control"
          id="serving"
          placeholder="Enter number of servings"
        />
      </div>

      <div class="form-group">
        <label for="mealtype">Meal Type</label>
        <select v-model="newMeal.mealtype" class="form-control" id="mealtype">
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary">Add Meal</button>
    </form>
  </div>
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
      mealLogs: [] as MealLog[],
      newMeal: {
        barcode: '',
        servingconsumed: 1,
        mealtype: 'Breakfast',
        dateadded: ''
      }
    };
  },
  async created() {
    const response = await axios.get('/api/user/logs?all=true');
    this.mealLogs = response.data.map((log: MealLog) => ({
      ...log,
      dateadded: new Date(log.dateadded).toLocaleString()
    }));
  },
  methods: {
    async addMealLog() {
      try {
        this.newMeal.dateadded = new Date().toISOString();

        const response = await axios.post('/api/user/logs', {
          barcode: this.newMeal.barcode,
          servingconsumed: this.newMeal.servingconsumed,
          mealtype: this.newMeal.mealtype,
        });

        this.mealLogs.push({
          ...this.newMeal,
          dateadded: new Date(this.newMeal.dateadded).toLocaleString(),
        });

        this.newMeal = {
          barcode: '',
          servingconsumed: 1,
          mealtype: 'Breakfast',
          dateadded: ''
        };
      } catch (error) {
        console.error('Error adding meal log:', error);
      }
    }
  }
});
</script>
