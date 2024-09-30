<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import { FoodItem, MealLog } from '@/models/Models';
import router from '@/router';
import { useMealLogStore } from '@/stores/MealLog';
import { getMealLogs, addMealLog } from '@/services/MealLogs';

interface ExtendedMealLog extends MealLog {
  foodItem: FoodItem;
}

export default defineComponent({
  name: 'HistoryPage',
  methods: {
    computeTotals(mealType: string) {
      const totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      };

      this.mealLogs.forEach(item => {
        if (item.mealtype.toLowerCase().includes(mealType.toLowerCase())) {
          totals.calories += item.foodItem.calories_per_serv * item.servingconsumed;
          totals.protein += item.foodItem.protein_per_serv * item.servingconsumed;
          totals.carbs += item.foodItem.carb_per_serv * item.servingconsumed;
          totals.fat += item.foodItem.fat_per_serv * item.servingconsumed;
        }
      });

      return totals;
    }
  },
  setup() {
    const mealLogs = ref<ExtendedMealLog[]>([]);
    const startDate = ref(new Date());
    const endDate = ref(new Date());

    const routeToSearch = (mealType: string) => {
      router.push({ path: '/search', query: { mealType: mealType } });
    }
    const updateMealLogs = async (start: Date, end: Date) => {
      const response = await getMealLogs(start, end) as ExtendedMealLog[];
      mealLogs.value = await response;
    }

    onMounted(async () => {
      const mealLogStore = useMealLogStore();
      const existingMealLogs = mealLogStore.getMealLog();
      if (existingMealLogs.barcode !== '' && existingMealLogs.mealtype !== '' && existingMealLogs.dateadded !== undefined && existingMealLogs.servingconsumed !== 0) {
        addMealLog(existingMealLogs);
        mealLogStore.clearMealLog();
      }
      await updateMealLogs(new Date(), new Date());
    });

    const prettyDate = (date: Date) => {
      return new Date(date).toLocaleString();
    }

    const newMeal = ref<MealLog>({
      barcode: '',
      mealtype: '',
      servingconsumed: 0
    });

    const formattedStartDate = computed({
      get() {
        if (!startDate.value) {
          return '';
        }
        const date = new Date(startDate.value);
        return date.toISOString().split('T')[0];
      },
      set(value: string) {
        startDate.value = new Date(value);
      }
    });

    const formattedEndDate = computed({
      get() {
        if (!endDate.value) {
          return '';
        }
        const date = new Date(endDate.value);
        return date.toISOString().split('T')[0];
      },
      set(value: string) {
        endDate.value = new Date(value);
      }
    });

    watch([startDate, endDate], async ([newStart, newEnd]: [Date, Date]) => {
      await updateMealLogs(newStart, newEnd);
    });

    return {
      mealLogs,
      newMeal,
      routeToSearch,
      prettyDate,
      updateMealLogs,
      startDate: new Date(),
      endDate: new Date(),
      formattedStartDate,
      formattedEndDate,
    };
  }
});
</script>

<template>
  <div class="row">
    <div class="p-3 row">
      <div class="col">
        <label for="startDate" class="form-label">Start Date</label>
        <input type="date" class="form-control" v-model="formattedStartDate">
      </div>
      <div class="col">
        <label for="endDate" class="form-label">End Date</label>
        <input type="date" class="form-control" v-model="formattedEndDate">
      </div>
    </div>
    <template v-for="mealType in ['Breakfast', 'Lunch', 'Dinner']" :key="mealType">
      <div class="col-12 col-md mb-3 d-flex">
        <div class="p-3">
          <div class="d-flex flex-row justify-content-between">
            <div class="d-flex align-items-center">
              <h3>
                <font-awesome-icon
                  :icon="mealType === 'Breakfast' ? ['fas', 'coffee'] : mealType === 'Lunch' ? ['fas', 'utensils'] : ['fas', 'drumstick-bite']" />
                {{ mealType }}
              </h3>
            </div>
            <div class="d-flex align-items-center">
              <button @click="routeToSearch(mealType)" class="btn btn-primary">
                <font-awesome-icon :icon="['fas', 'plus']" />
              </button>
            </div>
          </div>
          <div class="d-flex flex-row justify-content-between">
            <div class="d-flex align-items-center">
              <h5>Total Calories: {{ computeTotals(mealType).calories.toFixed(1) }}g</h5>
            </div>
            <div class="d-flex align-items-center">
              <h5>Total Protein: {{ computeTotals(mealType).protein.toFixed(1) }}g</h5>
            </div>
            <div class="d-flex align-items-center">
              <h5>Total Carbs: {{ computeTotals(mealType).carbs.toFixed(1) }}g</h5>
            </div>
            <div class="d-flex align-items-center">
              <h5>Total Fat: {{ computeTotals(mealType).fat.toFixed(1) }}g</h5>
            </div>
          </div>
          <div class="row row-cols-1 row-cols-md-1 g-4">
            <template
              v-for="item in mealLogs.slice().sort((a, b) => new Date(b.dateadded ?? 0).getTime() - new Date(a.dateadded ?? 0).getTime())"
              :key="item.barcode + item.dateadded">
              <div class="col" v-if="item.mealtype.toLowerCase().includes(mealType.toLowerCase())">
                <div class="card h-100">
                  <h5 class="card-header">{{ item.foodItem.foodname }}</h5>
                  <div class="card-body d-flex flex-row">
                    <img :src="item.foodItem.image" class="card-img-left"
                      style="width: 150px; height: 150px; object-fit: cover;" alt="{{ item.foodItem.foodname }}">
                    <ul class="card-text">
                      <li>Calories: {{ (item.foodItem.calories_per_serv * item.servingconsumed).toFixed(2) }}g</li>
                      <li>Protein: {{ (item.foodItem.protein_per_serv * item.servingconsumed).toFixed(2) }}g</li>
                      <li>Carbs: {{ (item.foodItem.carb_per_serv * item.servingconsumed).toFixed(2) }}g</li>
                      <li>Fat: {{ (item.foodItem.fat_per_serv * item.servingconsumed).toFixed(2) }}g</li>
                      <li>Serving Consumed: {{ item.servingconsumed }}g</li>
                    </ul>
                  </div>
                  <div class="card-footer text-end">
                    <small class="text-muted">{{ prettyDate(item.dateadded ?? new Date()) }}</small>
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