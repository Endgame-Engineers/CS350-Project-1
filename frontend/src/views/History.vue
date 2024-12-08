<template>
  <div class="container-fluid">
    <!-- Date Range Selection -->
    <div class="card mb-2">
      <div class="card-header d-flex flex-column flex-lg-row justify-content-between align-items-center gap-3">
        <div class="input-group">
          <button type="button" class="btn btn-outline-primary" @click="adjustDates(-1)">
            <font-awesome-icon :icon="['fas', 'arrow-left']" />
          </button>
          <input type="date" class="form-control" id="startDate" :value="startDateFormatted"
            @input="updateStartDate($event)" />
          <input type="date" class="form-control" id="endDate" :value="endDateFormatted"
            @input="updateEndDate($event)" />
          <button type="button" class="btn btn-outline-primary" @click="adjustDates(1)">
            <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </button>
        </div>
        <button class="btn btn-outline-secondary d-flex gap-1" @click="resetDates">
          <font-awesome-icon :icon="['fas', 'rotate-right']" />Reset
        </button>
      </div>
    </div>

    <!-- Chart Type Selection -->
    <div class="card mb-2">
      <div class="card-header d-flex gap-2 justify-content-center flex-wrap">
        <button type="button" class="btn flex-fill d-flex align-items-center justify-content-center"
          :class="selectedChart === 'calories' ? 'btn-primary' : 'btn-outline-primary'"
          @click="selectedChart = 'calories'">
          <font-awesome-icon icon="hamburger" class="me-2" alt="Calories" />
          <span class="d-none d-md-inline">Calories</span>
        </button>
        <button type="button" class="btn flex-fill d-flex align-items-center justify-content-center"
          :class="selectedChart === 'protein' ? 'btn-primary' : 'btn-outline-primary'"
          @click="selectedChart = 'protein'">
          <font-awesome-icon icon="drumstick-bite" class="me-2" alt="Protein" />
          <span class="d-none d-md-inline">Protein</span>
        </button>
        <button type="button" class="btn flex-fill d-flex align-items-center justify-content-center"
          :class="selectedChart === 'carbs' ? 'btn-primary' : 'btn-outline-primary'" @click="selectedChart = 'carbs'">
          <font-awesome-icon icon="bread-slice" class="me-2" alt="Carbohydrates" />
          <span class="d-none d-md-inline">Carbohydrates</span>
        </button>
        <button type="button" class="btn flex-fill d-flex align-items-center justify-content-center"
          :class="selectedChart === 'fats' ? 'btn-primary' : 'btn-outline-primary'" @click="selectedChart = 'fats'">
          <font-awesome-icon icon="bacon" class="me-2" alt="Fats" />
          <span class="d-none d-md-inline">Fats</span>
        </button>
        <button type="button" class="btn flex-fill d-flex align-items-center justify-content-center"
          :class="selectedChart === 'water' ? 'btn-primary' : 'btn-outline-primary'" @click="selectedChart = 'water'">
          <font-awesome-icon icon="glass-water-droplet" class="me-2" alt="Water" />
          <span class="d-none d-md-inline">Water</span>
        </button>
        <button type="button" class="btn flex-fill d-flex align-items-center justify-content-center"
          :class="selectedChart === 'calburned' ? 'btn-primary' : 'btn-outline-primary'" @click="selectedChart = 'calburned'">
          <font-awesome-icon icon="fire" class="me-2" alt="Calories Burned" />
          <span class="d-none d-md-inline">Calories Burned</span>
        </button>
      </div>
    </div>

    <!-- Chart Display -->
    <div class="card">
      <div class="card-body">
        <div v-if="mealLogs.length > 0">
          <div v-if="selectedChart === 'calories'">
            <div class="d-flex justify-content-center">
              <h2 class="pb-1">Calories Consumed vs Calorie Goal</h2>
            </div>
            <nutrition-data :type="'Calories Consumed'" :goalType="'Calorie Goal'" :labels="labels"
              :data="caloriesConsumed" :goalData="calorieGoals" />
          </div>
          <div v-else-if="selectedChart === 'protein'">
            <div class="d-flex justify-content-center">
              <h2 class="pb-1">Protein Consumed vs Protein Goal</h2>
            </div>
            <nutrition-data :type="'Protein Consumed'" :goalType="'Protein Goal'" :labels="labels"
              :data="proteinConsumed" :goalData="proteinGoals" />
          </div>
          <div v-else-if="selectedChart === 'carbs'">
            <div class="d-flex justify-content-center">
              <h2 class="pb-1">Carbohydrates Consumed vs Carbohydrate Goal</h2>
            </div>
            <nutrition-data :type="'Carbohydrates Consumed'" :goalType="'Carbohydrate Goal'" :labels="labels"
              :data="carbsConsumed" :goalData="carbsGoals" />
          </div>
          <div v-else-if="selectedChart === 'fats'">
            <div class="d-flex justify-content-center">
              <h2 class="pb-1">Fat Consumed vs Fat Goal</h2>
            </div>
            <nutrition-data :type="'Fats Consumed'" :goalType="'Fat Goal'" :labels="labels" :data="fatsConsumed"
              :goalData="fatGoals" />
          </div>
          <div v-else-if="selectedChart === 'water'">
            <div class="d-flex justify-content-center">
              <h2 class="pb-1">Water Consumed vs Water Goal</h2>
            </div>
            <nutrition-data :type="'Water Consumed'" :goalType="'Water Goal'" :labels="labels" :data="waterConsumed"
              :goalData="waterGoals" />
          </div>
        </div>
        <div v-else-if="selectedChart!=='calburned'" class="alert alert-warning text-center">
            No meal logs found for the selected date range.
        </div>
        <div v-if="selectedChart === 'calburned' && activityLogs.length > 0">
          <div v-if="selectedChart === 'calburned'">
            <div class="d-flex justify-content-center"><h2 class="pb-1">Calories Burned</h2></div>
            <nutrition-data :type="'Calories Burned'" :goalType="null" :labels="calBurnedLabels"
              :data="caloriesBurned" :goalData="null" />
          </div>
        </div>
        <div v-else-if="selectedChart === 'calburned'" class="alert alert-warning text-center">
            No activity logs found for the selected date range.
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { ExtendedMealLog, UserStat, ActivityLog } from '@/models/Models';
import { getMealLogs } from '@/services/MealLogs';
import { getActivityLogs } from '@/services/ActivityLogs';
import { getUserStats } from '@/services/UserStats';
import { logger } from '@/services/Logger';
import { useLogStore } from '@/stores/Log';

export default defineComponent({
  name: 'HistoryPage',
  components: {
  },


  data() {
    const logStore = useLogStore();


    return {
      selectedChart: logStore.getSelectedGraphType(),
      startDate: logStore.getSelectedGraphStartDate(),
      endDate: logStore.getSelectedGraphEndDate(),
      mealLogs: ref([] as ExtendedMealLog[]),
      activityLogs: ref([] as ActivityLog[]),
      userStats: ref([] as UserStat[]),
      labels: [] as string[],
      calBurnedLabels: [] as string[],
      caloriesConsumed: [] as number[],
      proteinConsumed: [] as number[],
      carbsConsumed: [] as number[],
      fatsConsumed: [] as number[],
      waterConsumed: [] as number[],
      calorieGoals: [] as number[],
      proteinGoals: [] as number[],
      carbsGoals: [] as number[],
      fatGoals: [] as number[],
      waterGoals: [] as number[],
      caloriesBurned: [] as number[],
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

  watch: {
    selectedChart(newVal: string) {
      logger.info('Selected Chart Updated:', newVal);
      const logStore = useLogStore();
      logStore.setSelectedGraphType(newVal);
    },
    startDate(newVal: Date) {
      logger.info('Start Date Updated:', newVal);
      const logStore = useLogStore();
      logStore.setSelectedGraphStartDate(newVal);
    },
    endDate(newVal: Date) {
      logger.info('End Date Updated:', newVal);
      const logStore = useLogStore();
      logStore.setSelectedGraphEndDate(newVal);
    },
  },

  async mounted() {
    await this.fetchUserStats();
    await this.fetchMealLogs(this.startDate, this.endDate);
    await this.fetchActivityLogs(this.startDate, this.endDate);
    await this.updateChartData();

    watch([() => this.startDate, () => this.endDate], async () => {
      logger.info('Date Range Updated');
      await this.fetchMealLogs(this.startDate, this.endDate);
      await this.fetchActivityLogs(this.startDate, this.endDate);
      await this.fetchUserStats();
      await this.updateChartData();
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

    async fetchActivityLogs(startDate: Date, endDate: Date) {
      const logs = await getActivityLogs(startDate, endDate) as ActivityLog[];
      this.activityLogs = logs;
      logger.info('Activity logs fetched');
    },

    updateChartData() {
      this.labels = [];
      this.calBurnedLabels = [];
      this.caloriesConsumed = [];
      this.calorieGoals = [];
      this.proteinGoals = [];
      this.carbsGoals = [];
      this.fatGoals = [];
      this.waterGoals = [];
      this.proteinConsumed = [];
      this.carbsConsumed = [];
      this.fatsConsumed = [];
      this.waterConsumed = [];
      this.caloriesBurned = [];
      const sortedStats = [...this.userStats].sort((a, b) => new Date(a.updatedon).getTime() - new Date(b.updatedon).getTime());
      let currentIndex = 0;
      let currentCalorieGoal = 0;
      let currentProteinGoal = 0;
      let currentCarbsGoal = 0;
      let currentFatsGoal = 0;
      let currentWaterGoal = 0;

      const dailyCalories: { [key: string]: number } = {};
      const dailyProtein: { [key: string]: number } = {};
      const dailyCarbs: { [key: string]: number } = {};
      const dailyFats: { [key: string]: number } = {};
      const dailyWater: { [key: string]: number } = {};
      const dailyCaloriesBurned: { [key: string]: number } = {};

      this.mealLogs.forEach((log: ExtendedMealLog) => {
        if (log.dateadded) {
          const date = new Date(log.dateadded).toISOString().split('T')[0];
          if (!dailyCalories[date]) {
            dailyCalories[date] = 0;
          }
          if (!dailyProtein[date]) {
            dailyProtein[date] = 0;
          }
          if (!dailyCarbs[date]) {
            dailyCarbs[date] = 0;
          }
          if (!dailyFats[date]) {
            dailyFats[date] = 0;
          }
          if (!dailyWater[date]) {
            dailyWater[date] = 0;
          }
          if (log.foodItem && log.foodItem.calories_per_serv) {
            dailyCalories[date] += Math.round(log.servingconsumed * log.foodItem.calories_per_serv);
            dailyProtein[date] += Math.round(log.servingconsumed * log.foodItem.protein_per_serv);
            dailyCarbs[date] += Math.round(log.servingconsumed * log.foodItem.carb_per_serv);
            dailyFats[date] += Math.round(log.servingconsumed * log.foodItem.fat_per_serv);
          }
          if (log.mealtype.toLocaleLowerCase() === 'water' && log.servingconsumed !== 0) {
            dailyWater[date] += Math.round(log.servingconsumed);
          }
        }
      });

      this.activityLogs.forEach((logs: ActivityLog) => {
        if (logs.dateadded) {
          const date = new Date(logs.dateadded).toISOString().split('T')[0];
          if (!dailyCaloriesBurned[date]) {
            dailyCaloriesBurned[date] = 0;
          }
          if (logs.caloriesburned) {
            dailyCaloriesBurned[date] += Math.round(logs.caloriesburned);
          }
        }
      });

      Object.keys(dailyCalories).forEach((date) => {
        this.labels.push(date);
        this.caloriesConsumed.push(dailyCalories[date]);
        this.proteinConsumed.push(dailyProtein[date]);
        this.carbsConsumed.push(dailyCarbs[date]);
        this.fatsConsumed.push(dailyFats[date]);
        this.waterConsumed.push(dailyWater[date]);
      });

      Object.keys(dailyCaloriesBurned).forEach((date) => {
        this.calBurnedLabels.push(date);
        this.caloriesBurned.push(dailyCaloriesBurned[date]);
      });

      logger.info('Calories Consumed Calculated');
      logger.info('Protein Consumed Calculated');
      logger.info('Carbs Consumed Calculated');
      logger.info('Fats Consumed Calculated');
      logger.info('Water Consumed Calculated');
      logger.info('Calories Burned Calculated');

      this.labels.forEach(() => {
        while (currentIndex < sortedStats.length) {
          currentCalorieGoal = sortedStats[currentIndex].caloriegoal ?? 0;
          currentProteinGoal = sortedStats[currentIndex].proteingrams ?? 0;
          currentCarbsGoal = sortedStats[currentIndex].carbgrams ?? 0;
          currentFatsGoal = sortedStats[currentIndex].fatgrams ?? 0;
          currentWaterGoal = sortedStats[currentIndex].watergoal ?? 0;
          currentIndex++;
        }
        this.calorieGoals.push(currentCalorieGoal);
        this.proteinGoals.push(currentProteinGoal);
        this.carbsGoals.push(currentCarbsGoal);
        this.fatGoals.push(currentFatsGoal);
        this.waterGoals.push(currentWaterGoal);
      });


      const sortedData = this.labels
        .map((label, index) => ({
          label,
          calories: this.caloriesConsumed[index],
          goal: this.calorieGoals[index],
          protein: this.proteinConsumed[index],
          carbs: this.carbsConsumed[index],
          fats: this.fatsConsumed[index],
          water: this.waterConsumed[index],
        }))
        .sort((a, b) => new Date(a.label).getTime() - new Date(b.label).getTime());

        const sortedCalBurnedData = this.calBurnedLabels
        .map((label, index) => ({
          label,
          calBurned: this.caloriesBurned[index],
        }))
        .sort((a, b) => new Date(a.label).getTime() - new Date(b.label).getTime());

      logger.info('Chart data sorted and updated');

      this.labels = sortedData.map((item) => item.label);
      this.caloriesConsumed = sortedData.map((item) => item.calories);
      this.calorieGoals = sortedData.map((item) => item.goal);
      this.proteinConsumed = sortedData.map((item) => item.protein);
      this.carbsConsumed = sortedData.map((item) => item.carbs);
      this.fatsConsumed = sortedData.map((item) => item.fats);
      this.waterConsumed = sortedData.map((item) => item.water);
      this.calBurnedLabels = sortedCalBurnedData.map((item) => item.label);

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
