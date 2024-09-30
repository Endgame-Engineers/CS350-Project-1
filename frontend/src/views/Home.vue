<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useUserStore } from '@/stores/User';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { getUserStat } from '@/services/UserStats';
import { getMealLogs } from '@/services/MealLogs';
import { ExtendedMealLog } from '@/models/Models';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default defineComponent({
  name: 'HomePage',
  components: {
    BarChart: Bar,
  },
  setup() {
    const userStore = useUserStore();
    const user = userStore.user;
    const userStats = ref({ caloriegoal: 0 });
    const totalCaloriesConsumed = ref(0);

    const fetchMealLogs = async () => {
      const mealLogs = await getMealLogs(new Date(), new Date()) as ExtendedMealLog[];
      totalCaloriesConsumed.value = mealLogs.reduce((total, log) => total + log.foodItem.calories_per_serv * log.servingconsumed, 0);
    };

    fetchMealLogs();

    const fetchUserStats = async () => {
      try {
        const stats = await getUserStat();

        if (stats) {
          userStats.value = {
            ...stats,
            caloriegoal: 'caloriegoal' in stats && stats.caloriegoal !== null ? stats.caloriegoal : 0,
          };
        } else {
          console.error('Failed to fetch user stats:', stats);
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
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

    const fetchChartData = async () => {
      const now = new Date();
      const pastThreeMonths = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const mealLogs = await getMealLogs(pastThreeMonths, now) as ExtendedMealLog[];

      const monthlyData = mealLogs.reduce((acc, log) => {
        const month = log.dateadded ? new Date(log.dateadded).toLocaleString('default', { month: 'long' }) : 'Unknown';
        if (!acc[month]) {
          acc[month] = { consumed: 0, goal: userStats.value.caloriegoal };
        }
        acc[month].consumed += log.foodItem.calories_per_serv * log.servingconsumed;
        return acc;
      }, {} as Record<string, { consumed: number, goal: number }>);

      chartData.value.labels = Object.keys(monthlyData);
      chartData.value.datasets[0].data = Object.values(monthlyData).map(data => data.consumed);
      chartData.value.datasets[1].data = Object.keys(monthlyData).map(() => userStats.value.caloriegoal);

      console.log('chartData:', chartData.value);
      console.log('monthlyData:', monthlyData);
      console.log('mealLogs:', mealLogs);
    };

    fetchChartData();

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
    };
  },
});
</script>

<template>
  <div class="row">
    <!-- Main Container -->
    <div class="col-12 col-md-8 mb-3">
      <!-- Welcome Row -->
      <div class="row mb-4">
        <div class="col text-center">
          <h1 class="display-4">Welcome, {{ user?.username || 'Guest' }}</h1>
        </div>
      </div>
      <!-- Calories Box -->
      <div class="row justify-content-center flex-grow-1">
        <div class="col-md-6">
          <div class="calories-box bg-dark p-4 rounded text-center shadow-sm">
            <h3 class="mb-4">Calories</h3>
            <div class="circle bg-primary text-white d-flex justify-content-center align-items-center mx-auto mb-3">
              <div>
                <p class="remaining display-4">{{ (userStats.caloriegoal - totalCaloriesConsumed).toFixed(1) }}</p>
                <p>Remaining</p>
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <div>
                <p class="display-6">{{ totalCaloriesConsumed.toFixed(1) }}</p>
                <p>Consumed</p>
              </div>
              <div>
                <p class="display-6">0</p>
                <p>Burned</p>
              </div>
              <div>
                <p class="display-6">{{ userStats.caloriegoal.toFixed(1) }}</p>
                <p>Goal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-4 mb-3">
      <!-- Chart Row -->
      <!-- Testing Charts -->
      <div class="row mt-4">
        <bar-chart :data="chartData" :options="chartOptions"></bar-chart>
      </div>
    </div>
  </div>
</template>
