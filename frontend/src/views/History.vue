<template>
  <div class="row">
    <div class="col-12 col-md-4 mb-3">
      <h2 class="text-center">Breakfast</h2>
      <template v-for="item in mealLogs" :key="item.barcode + item.dateadded">
        <div v-if="item.mealtype.toLowerCase().includes('breakfast')" class="card mb-3">
          <div class="card-body">
            <img :src="item.image" alt="food image" class="img-thumbnail">
            <h5 class="card-title">
              {{ item.foodname }}
            </h5>
            <h5 class="card-title">
              {{ item.dateadded }}
            </h5>
            <p class="card-text">
              {{ item.servingconsumed }} servings of {{ item.foodname }}
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
              {{ item.foodname }}
              <img :src="item.image" alt="food image" class="img-thumbnail">
              {{ item.dateadded }}
            </h5>
            <p class="card-text">
              {{ item.servingconsumed }} servings of {{ item.foodname }}
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
              {{ item.foodname }}
              <img :src="item.image" alt="food image" class="img-thumbnail">
              {{ item.dateadded }}
            </h5>
            <p class="card-text">
              {{ item.servingconsumed }} servings of {{ item.foodname }}
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
import { barcodeLookup } from '@/services/foodSearch';

export default defineComponent({
  name: 'HistoryPage',
  data() {
    interface HistoryData extends MealLog {
      foodname: string;
      image: string;
    }
    return {
      mealLogs: [] as HistoryData[],
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
    this.mealLogs = await Promise.all(
        response.data.map(async (log: MealLog) => {
          const foodDetails = await barcodeLookup(log.barcode) as FoodItem;
          return {
            ...log,
            dateadded: new Date(log.dateadded).toLocaleString(),
            foodname: foodDetails.foodname,
            image: foodDetails.image
          };
        })
      );
    console.log(this.mealLogs);
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
          foodname: '',
          image: ''
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
