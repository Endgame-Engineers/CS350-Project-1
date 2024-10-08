<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useUserStore } from '@/stores/User';
import { getUserStat, userStats } from '@/services/UserStats';
import { getMealLogs } from '@/services/MealLogs';
import { ExtendedMealLog, UserStat } from '@/models/Models';

export default defineComponent({
  name: 'HomePage',
  setup() {
    const userStore = useUserStore();
    const user = userStore.user;
    const totalCaloriesConsumed = ref(0);
    const totalCarbs = ref(0);
    const totalProteins = ref(0);
    const totalFats = ref(0);

    const fetchMealLogs = async () => {
      const mealLogs = await getMealLogs(new Date(), new Date()) as ExtendedMealLog[];
      totalCaloriesConsumed.value = Math.round(mealLogs.reduce((total, log) => total + log.foodItem.calories_per_serv * log.servingconsumed, 0));
      totalCarbs.value = mealLogs.reduce((total, log) => total + log.foodItem.carb_per_serv * log.servingconsumed, 0);
      totalProteins.value = mealLogs.reduce((total, log) => total + log.foodItem.protein_per_serv * log.servingconsumed, 0);
      totalFats.value = mealLogs.reduce((total, log) => total + log.foodItem.fat_per_serv * log.servingconsumed, 0);
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
      totalCaloriesConsumed,
      totalCarbs,
      totalProteins,
      totalFats,
    };
  },
});
</script>
<template>
  <div class="container">
    <div class="row d-flex justify-content-center">
      <h1 class="text-center">Welcome, {{ user.firstname }}!</h1>
      <div class="row">
        <h3>Today's Stats</h3>
        <div class="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center">
          <circle-percentage :progress="Math.round(totalCaloriesConsumed / userStats.caloriegoal * 100)" size="8"
            title="Calories" />
        </div>
        <div class="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center">
          <circle-percentage :progress="Math.round((totalCarbs / (totalCarbs + totalProteins + totalFats)) * 100)"
            size="8" title="Carbs" />
        </div>
        <div class="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center">
          <circle-percentage :progress="Math.round((totalProteins / (totalCarbs + totalProteins + totalFats)) * 100)"
            size="8" title="Proteins" />
        </div>
        <div class="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center">
          <circle-percentage :progress="Math.round((totalFats / (totalCarbs + totalProteins + totalFats)) * 100)"
            size="8" title="Fats" />
        </div>
      </div>
    </div>
  </div>
</template>