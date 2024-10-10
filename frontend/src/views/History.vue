<template>
  <div class="container">
    <!-- Date Range Selection -->
    <div class="row mb-4 d-grid grid-template-columns-small1-3 gap-1">
      <button class="btn btn-primary" @click="resetDates">
        <font-awesome-icon :icon="['fas', 'rotate-right']" />
      </button>
      <div class="input-group">
        <button type="button" class="btn btn-primary" @click="adjustDates(-1)">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </button>
        <input type="date" class="form-control" id="startDate" :value="startDateFormatted"
          @input="updateStartDate($event)" />
      </div>
      <div class="input-group">
        <input type="date" class="form-control" id="endDate" :value="endDateFormatted" @input="updateEndDate($event)" />
        <button type="button" class="btn btn-primary" @click="adjustDates(1)">
          <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </button>
      </div>
    </div>

    <!-- Chart -->
    <div class="row">
      <div class="col cal-chart">
        <h2 class="pb-1 pt-1">Calories Consumed vs Calorie Goal</h2>
        <Bar v-if="mealLogs.length > 0" :data="chartData" :options="chartOptions" />
        <div v-else class="alert alert-warning" role="alert">
          No meal logs found for the selected date range.
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartData, ChartOptions } from 'chart.js';
import { ExtendedMealLog, UserStat } from '@/models/Models';
import { getMealLogs } from '@/services/MealLogs';
import { getUserStats } from '@/services/UserStats';
import { logger } from '@/services/Logger';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default defineComponent({
  name: 'HistoryPage',
  components: {
    Bar,
  },

  data() {
    return {
      chartData: {
        labels: [] as string[],
        datasets: [
          {
            label: 'Calories Consumed',
            data: [] as number[],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Calorie Goal',
            data: [] as number[],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      } as ChartData<'bar'>,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'category',
            stacked: true,
          },
          y: {
            stacked: false,
            beginAtZero: true,
          },
        },
      } as ChartOptions<'bar'>,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1) as Date,
      endDate: new Date() as Date,
      mealLogs: ref([] as ExtendedMealLog[]),
      userStats: ref([] as UserStat[]),
    };
  },

  computed: {
    startDateFormatted(): string {
      return this.startDate.toISOString().split('T')[0];
    },
    endDateFormatted(): string {
      return this.endDate.toISOString().split('T')[0];
    },
  },

  async mounted() {
    await this.fetchUserStats();
    await this.fetchMealLogs(this.startDate, this.endDate);
    this.updateChartData();

    watch([() => this.startDate, () => this.endDate], async () => {
      logger.info('Date Range Updated');
      await this.fetchMealLogs(this.startDate, this.endDate);
      await this.fetchUserStats();
      this.updateChartData();
    },
      { deep: true });
  },

  methods: {
    async fetchUserStats() {
      const stats = await getUserStats() as UserStat[];
      this.userStats = stats;
      logger.info('User stats fetched');
    },

    async fetchMealLogs(startDate: Date, endDate: Date) {
      const logs = await getMealLogs(startDate, endDate) as ExtendedMealLog[];
      this.mealLogs = logs;
      logger.info('Meal logs fetched');
    },

    updateChartData() {
      const labels: string[] = [];
      const caloriesConsumed: number[] = [];
      const calorieGoals: number[] = [];
      const sortedStats = [...this.userStats].sort((a, b) => new Date(a.updatedon).getTime() - new Date(b.updatedon).getTime());
      let currentIndex = 0;
      let currentGoal = 0;

      // Populate labels and calories consumed
      const dailyCalories: { [key: string]: number } = {};

      this.mealLogs.forEach((log: ExtendedMealLog) => {
        if (log.dateadded) {
          const date = new Date(log.dateadded).toISOString().split('T')[0];
          if (!dailyCalories[date]) {
            dailyCalories[date] = 0;
          }
          if (log.foodItem && log.foodItem.calories_per_serv) {
            dailyCalories[date] += log.servingconsumed * log.foodItem.calories_per_serv;
          }
        }
      });

      Object.keys(dailyCalories).forEach((date) => {
        labels.push(date);
        caloriesConsumed.push(dailyCalories[date]);
      });

      logger.info('Calories Consumed Calculated');

      labels.forEach((labelDate) => {
        const labelDateTime = new Date(labelDate).getTime();

        while (currentIndex < sortedStats.length && new Date(sortedStats[currentIndex].updatedon).getTime() <= labelDateTime) {
          currentGoal = sortedStats[currentIndex].caloriegoal ?? 0;
          currentIndex++;
        }

        calorieGoals.push(currentGoal);
      });

      // Replace the chartData object to trigger reactivity
      this.chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Calories Consumed',
            data: caloriesConsumed,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Calorie Goal',
            data: calorieGoals,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      };
    },

    resetDates() {
      logger.debug('Resetting Dates');
      this.startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      this.endDate = new Date();
    },

    adjustDates(days: number) {
      if (days < 0) {
        this.startDate = new Date(this.startDate.setDate(this.startDate.getDate() + days));
        logger.debug('Adjusted Start Date:', this.startDate);
      } else {
        this.endDate = new Date(this.endDate.setDate(this.endDate.getDate() + days));
        logger.debug('Adjusted End Date:', this.endDate);
      }
    },

    updateStartDate(event: Event) {
      const input = event.target as HTMLInputElement;
      this.startDate = new Date(input.value);
    },

    updateEndDate(event: Event) {
      const input = event.target as HTMLInputElement;
      this.endDate = new Date(input.value);
    },
  },
});
</script>
