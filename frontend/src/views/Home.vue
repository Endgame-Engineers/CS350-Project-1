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
                <p class="remaining display-4">0</p>
                <p>Remaining</p>
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <div>
                <p class="display-6">0</p>
                <p>Consumed</p>
              </div>
              <div>
                <p class="display-6">0</p>
                <p>Burned</p>
              </div>
              <div>
                <p class="display-6">{{ userStats.caloriegoal }}</p>
                <p>Goal</p>
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <div>
                <p class="display-6">0</p>
                <p>Consumed</p>
              </div>
              <div>
                <p class="display-6">0</p>
                <p>Burned</p>
              </div>
              <div>
                <p class="display-6">{{ userStats.caloriegoal }}</p>
                <p>Goal</p>
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <div>
                <p class="display-6">0</p>
                <p>Consumed</p>
              </div>
              <div>
                <p class="display-6">0</p>
                <p>Burned</p>
              </div>
              <div>
                <p class="display-6">{{ userStats.caloriegoal }}</p>
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

    <!-- Chart Row -->
    <!-- Testing Charts -->
    <div class="row mt-4">
      <bar-chart :data="chartData" :options="chartOptions"></bar-chart>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useUserStore } from '@/stores/User';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { getUserStat } from '@/services/UserStats';
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

    const chartData = ref({
      labels: ['January', 'February', 'March'],
      datasets: [
        {
          label: 'Calories Consumed',
          backgroundColor: '#f87979',
          data: [40, 20, 30],
        },
        {
          label: 'Calories Burned',
          backgroundColor: '#79f8f8',
          data: [10, 30, 40],
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
    };
  },
});
</script>