<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useUserStore } from '@/stores/User';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { getUserStat, userStats } from '@/services/UserStats';
import { getMealLogs } from '@/services/MealLogs';
import { ExtendedMealLog, UserStat } from '@/models/Models';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default defineComponent({
  name: 'HomePage',
  components: {
    BarChart: Bar,
  },
  setup() {
    const userStore = useUserStore();
    const user = userStore.user;
    const totalCaloriesConsumed = ref(0);

    const fetchMealLogs = async () => {
      const mealLogs = await getMealLogs(new Date(), new Date()) as ExtendedMealLog[];
      totalCaloriesConsumed.value = mealLogs.reduce((total, log) => total + log.foodItem.calories_per_serv * log.servingconsumed, 0);
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
      totalCaloriesConsumed
    };
  },
});
</script>
<template>
  <div class="container">
    <div class="row">
      <h1 class="text-center">Welcome, {{ user.firstname }}!</h1>
      <div class="col">
        <div class="card">
          <div class="card-body">
            <circle-percentage :progress="useStats.caloriegoal ? totalCaloriesConsumed / userStats.caloriegoal * 100 : 0" size="10" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>