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
      totalCarbs.value = Math.round(mealLogs.reduce((total, log) => total + log.foodItem.carb_per_serv * log.servingconsumed, 0));
      totalProteins.value = Math.round(mealLogs.reduce((total, log) => total + log.foodItem.protein_per_serv * log.servingconsumed, 0));
      totalFats.value = Math.round(mealLogs.reduce((total, log) => total + log.foodItem.fat_per_serv * log.servingconsumed, 0));
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
    <h1 class="text-center">Welcome, {{ user.firstname }}!</h1>
    <div class="d-flex justify-content-center">
      <div v-if="totalCaloriesConsumed > userStats.caloriegoal" class="alert alert-danger" role="alert">
        You have consumed <i>{{ totalCaloriesConsumed }}</i> calories today, which is more than your daily goal of
        <i>{{ userStats.caloriegoal }}</i> calories.
      </div>
      <div v-else-if="totalCaloriesConsumed === userStats.caloriegoal" class="alert alert-success" role="alert">
        You have consumed <i>{{ totalCaloriesConsumed }}</i> calories today, which is exactly your daily goal of
        <i>{{ userStats.caloriegoal }}</i> calories.
      </div>
      <div v-else class="alert alert-info" role="alert">
        You have consumed <i>{{ totalCaloriesConsumed }}</i> calories today and have <i>{{ userStats.caloriegoal -
          totalCaloriesConsumed }}</i> calories left to consume.
      </div>
    </div>
    <h2 class="text-center">Today's Progress</h2>
    <div class="d-grid todays-stats">
      <circle-percentage :progress="Math.round(totalCaloriesConsumed / userStats.caloriegoal * 100)" size=8
        title="Calories" />
      <circle-percentage :progress="Math.round((totalCarbs / (totalCarbs + totalProteins + totalFats)) * 100)" size=8
        title="Carbs" />
      <circle-percentage :progress="Math.round((totalProteins / (totalCarbs + totalProteins + totalFats)) * 100)"
        size="8" title="Proteins" />
      <circle-percentage :progress="Math.round((totalFats / (totalCarbs + totalProteins + totalFats)) * 100)" size=8
        title="Fats" />
    </div>
  </div>
</template>