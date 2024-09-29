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

    return {
      mealLogs,
      newMeal,
      routeToSearch,
    };
  }
});
</script>

<template>
  <div class="row">
    <template v-for="mealType in ['Breakfast', 'Lunch', 'Dinner']" :key="mealType">
      <div class="col-12 col-md-4 mb-3 d-flex">
        <div class="p-3">
          <div class="d-flex flex-row justify-content-end">
            <div class="p-2">
              <h3>{{ mealType }}</h3>
            </div>
            <div class="p-2">
              <button @click="routeToSearch(mealType)" class="btn btn-primary mt-2">
                <font-awesome-icon :icon="['fas', 'plus']" size="2x" />
              </button>
            </div>
          </div>
            <template v-for="item in mealLogs.slice().sort((a, b) => new Date(b.dateadded).getTime() - new Date(a.dateadded).getTime())" :key="item.barcode + item.dateadded">
            <div v-if="item.mealtype.toLowerCase().includes(mealType.toLowerCase())"
              class="card card-body mb-3 flex-fill">
              <img :src="item.foodItem.image" alt="food image" class="img-thumbnail">
              <h5 class="card-title">
                {{ item.foodItem.foodname }}
              </h5>
              <p class="card-text">
                {{ item.dateadded }}
                {{ item.servingconsumed }} servings of {{ item.foodItem.barcode }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>