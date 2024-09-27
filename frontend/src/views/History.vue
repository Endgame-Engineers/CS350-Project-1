
<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { FoodItem, MealLog } from '@/models/Models';

export default defineComponent({
  name: 'HistoryPage',
  data() {
    interface ExtendedMealLog extends MealLog {
      foodItem: FoodItem;
    }
    return {
      mealLogs: [] as ExtendedMealLog[],
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
    this.mealLogs = await Promise.all(response.data);
    console.log(this.mealLogs);
  },
  methods: {
  }
});
</script>

<template>
  <div class="row">
    <div v-for="mealType in ['Breakfast', 'Lunch', 'Dinner']" :key="mealType" class="col-12 col-md-4 mb-3">
      <h2 class="text-center">{{ mealType }}</h2>
      <template v-for="item in mealLogs" :key="item.barcode + item.dateadded">
        <div v-if="item.mealtype.toLowerCase().includes(mealType.toLowerCase())" class="card mb-3">
          <div class="card-body">
            <img :src="item.foodItem.image" alt="food image" class="img-thumbnail">
            <h5 class="card-title">
              {{ item.foodItem.foodname }}
            </h5>
            <h5 class="card-title">
              {{ item.dateadded }}
            </h5>
            <p class="card-text">
              {{ item.servingconsumed }} servings of {{ item.foodItem.barcode }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>