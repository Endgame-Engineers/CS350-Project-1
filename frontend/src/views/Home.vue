<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useUserStore } from '@/stores/User';
import { getUserStat, userStats } from '@/services/UserStats';
import { getActivityLogs } from '@/services/ActivityLogs';
import { getMealLogs } from '@/services/MealLogs';
import { ExtendedMealLog, UserStat, ActivityLog } from '@/models/Models';

export default defineComponent({
  name: 'HomePage',
  setup() {
    const userStore = useUserStore();
    const user = userStore.user;
    const mealLogs = ref<ExtendedMealLog[]>([]);
    const totals = ref({
      calories: 0,
      carbs: 0,
      proteins: 0,
      fats: 0,
      water: 0,
      caloriesburned: 0,
    });

    const fetchMealLogs = async () => {
      const logs = await getMealLogs(new Date(), new Date()) as ExtendedMealLog[];
      mealLogs.value = logs;
      mealLogs.value = mealLogs.value.sort((a, b) => new Date(b.dateadded ?? 0).getTime() - new Date(a.dateadded ?? 0).getTime());

      logs.forEach((log) => {
        if (log.foodItem && log.mealtype.toLowerCase() !== 'water') {
          totals.value.calories += log.foodItem.calories_per_serv * log.servingconsumed;
          totals.value.carbs += log.foodItem.carb_per_serv * log.servingconsumed;
          totals.value.proteins += log.foodItem.protein_per_serv * log.servingconsumed;
          totals.value.fats += log.foodItem.fat_per_serv * log.servingconsumed;
        } else if (log.mealtype.toLowerCase() === 'water') {
          totals.value.water += log.servingconsumed;
        }
      });
    };

    fetchMealLogs();

    const fetchUserStats = async () => {
      try {
        const stats = await getUserStat() as UserStat;

        if (stats) {
          userStats.value = stats;
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserStats();


    const fetchActivityLogs = async () => {
      try {
        const logs = await getActivityLogs(new Date(), new Date()) as ActivityLog[];

        logs.forEach((log) => {
          if (log.caloriesburned !== undefined) {
            totals.value.caloriesburned += log.caloriesburned;
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchActivityLogs();

    const chartData = ref<{
      labels: string[];
      datasets: { label: string; backgroundColor: string; data: number[] }[];
    }>({
      labels: [],
      datasets: [
        {
          label: 'Calories Consumed',
          backgroundColor: '#f87979',
          data: [],
        },
        {
          label: 'Calorie Goal',
          backgroundColor: '#79f8f8',
          data: [],
        },
      ],
    });


    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
    });


    return {
      user,
      userStats,
      chartData,
      chartOptions,
      totals,
      mealLogs,
    };
  },
});
</script>
<template>
    <div class="container">
      <h1 class="text-center">Welcome, {{ user.firstname }}!</h1>
      <div class="d-flex flex-column justify-content-center align-items-center">
        <div v-if="userStats.caloriegoal !== null && totals.calories > userStats.caloriegoal" class="alert alert-danger"
          role="alert">
          You have consumed <i>{{ Math.round(totals.calories) }}</i> calories today, which is more than your daily goal of
          <i>{{ Math.round(userStats.caloriegoal) }}</i> calories.
        </div>
        <div v-else-if="userStats.caloriegoal !== null && totals.calories === userStats.caloriegoal"
          class="alert alert-success" role="alert">
          You have consumed <i>{{ Math.round(totals.calories) }}</i> calories today, which is exactly your daily goal of
          <i>{{ Math.round(userStats.caloriegoal) }}</i> calories.
        </div>
        <div v-else class="alert alert-info" role="alert">
          You have consumed <i>{{ Math.round(totals.calories) }}</i> calories today and have <i>{{ userStats.caloriegoal ?
            Math.round(userStats.caloriegoal - totals.calories) : 0 }}</i> calories left to consume.
        </div>
        <div v-if="totals.caloriesburned > 0" class="alert alert-info" role="alert">
          You have burned <i>{{ Math.round(totals.caloriesburned) }}</i> calories today.
        </div>
      </div>
    <h2 class="text-center">Today's Progress</h2>
    <div class="d-grid todays-stats">
      <circle-percentage :progress="((totals.water / 128) * 100).toFixed(0)" size=8 title="Water" :subtitle="`${totals.water.toFixed(0)}/${userStats.watergoal}oz`" />
      <circle-percentage
        :progress="(totals.calories / (userStats.caloriegoal ?? userStats.recommendedcaloriegoal ?? 1) * 100).toFixed(0)"
        size=8 title="Calories" :subtitle="`${Math.round(totals.calories)}/${Math.round(userStats.caloriegoal ?? userStats.recommendedcaloriegoal ?? 1)}kcal`" />
      <circle-percentage :progress="((totals.carbs / userStats.carbgrams) * 100).toFixed(0)" size=8 title="Carbs" :subtitle="`${Math.round(totals.carbs)}/${Math.round(userStats.carbgrams)}g`" />
      <circle-percentage :progress="((totals.proteins / userStats.proteingrams) * 100).toFixed(0)" size=8 title="Proteins" :subtitle="`${Math.round(totals.proteins)}/${Math.round(userStats.proteingrams)}g`" />
      <circle-percentage :progress="((totals.fats / userStats.fatgrams) * 100).toFixed(0)" size=8 title="Fats" :subtitle="`${Math.round(totals.fats)}/${Math.round(userStats.fatgrams)}g`" />
    </div>
    <template v-if="mealLogs.filter((log, index) =>  log.mealtype.toLowerCase() !== 'water').length > 0">
      <h2 class="text-center">Recently Consumed Food Items</h2>
      <div id="mealCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div v-for="(log, index) in mealLogs.filter((log, index) =>  log.mealtype.toLowerCase() !== 'water')" :key="index">
            <img :src="log.foodItem?.image" class="d-block w-100" alt="Food Image" style="height: 300px; object-fit: cover;" />
            <div class="carousel-caption d-none d-md-block text-white">
              <h5>{{ log.foodItem?.foodname }}</h5>
              <p>{{ log.mealtype }}</p>
              <p>Comsumed at: {{ new Date(log.dateadded ?? 0).toLocaleString() }}</p>
            </div>
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#mealCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#mealCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </template>
  </div>
</template>