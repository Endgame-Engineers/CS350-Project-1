<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { FoodItem, MealLog } from '@/models/Models';
import router from '@/router';
import { useMealLogStore } from '@/stores/MealLog';
import { getMealLogs, addMealLog } from '@/services/MealLogs';

interface ExtendedMealLog extends MealLog {
  foodItem: FoodItem;
}

export default defineComponent({
  name: 'HistoryPage',
  setup() {
    const mealLogs = ref<ExtendedMealLog[]>([]);
    const newMeal = reactive<MealLog>({
      barcode: '',
      mealtype: '',
      dateadded: '',
      servingconsumed: 0,
    });

    const routeToSearch = (mealType: string) => {
      router.push({ path: '/search', query: { mealType: mealType } });
    }

    onMounted(async () => {
      const mealLogStore = useMealLogStore();
      const existingMealLogs = mealLogStore.getMealLog();
      if (existingMealLogs.barcode !== '' && existingMealLogs.mealtype !== '' && existingMealLogs.dateadded !== '' && existingMealLogs.servingconsumed !== 0) {
        addMealLog(existingMealLogs);
        mealLogStore.clearMealLog();
      }
      const response = await getMealLogs() as ExtendedMealLog[];
      mealLogs.value = await response;
    });

    const prettyDate = (date: string) => {
      return new Date(date).toLocaleString();
    }

    return {
      mealLogs,
      newMeal,
      routeToSearch,
      prettyDate,
    };
  }
});
</script>

<template>
  <div class="row">
    <template v-for="mealType in ['Breakfast', 'Lunch', 'Dinner']" :key="mealType">
      <div class="col-12 col-md-4 mb-3 d-flex">
        <div class="p-3">
          <div class="d-flex flex-row justify-content-between">
            <div class="d-flex align-items-center">
              <h3>{{ mealType }}</h3>
            </div>
            <div class="d-flex align-items-center">
              <button @click="routeToSearch(mealType)" class="btn btn-primary">
                <font-awesome-icon :icon="['fas', 'plus']" />
              </button>
            </div>
          </div>
          <div class="row row-cols-1 row-cols-md-1 g-4">
            <template
              v-for="item in mealLogs.slice().sort((a, b) => new Date(b.dateadded).getTime() - new Date(a.dateadded).getTime())"
              :key="item.barcode + item.dateadded">
              <div class="col" v-if="item.mealtype.toLowerCase().includes(mealType.toLowerCase())">
                <div class="card h-100">
                  <h5 class="card-header">{{ item.foodItem.foodname }}</h5>
                  <div class="card-body d-flex flex-row">
                    <img :src="item.foodItem.image" class="card-img-left"
                      style="width: 150px; height: 150px; object-fit: cover;" alt="{{ item.foodItem.foodname }}">
                    <p class="card-text">
                    <ul>
                      <li>Calories: {{ (item.foodItem.calories_per_serv * item.servingconsumed).toFixed(2) }}g</li>
                      <li>Protein: {{ (item.foodItem.protein_per_serv * item.servingconsumed).toFixed(2) }}g</li>
                      <li>Carbs: {{ (item.foodItem.carb_per_serv * item.servingconsumed).toFixed(2) }}g</li>
                      <li>Fat: {{ (item.foodItem.fat_per_serv * item.servingconsumed).toFixed(2) }}g</li>
                      <li>Serving Consumed: {{ item.servingconsumed }}g</li>
                    </ul>
                    </p>
                  </div>
                  <div class="card-footer text-end">
                    <small class="text-muted">{{ prettyDate(item.dateadded) }}</small>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>