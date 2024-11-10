<!--
    set the button that is selected to primaryx 
    add quotes around the delete messagex
    remove date scrolling and make it date picker
    add snacks to the meal type switcherx
    add water to the meal type switcher
    -->
<template>
  <div class="container-fluid">
    <!-- Meal Type Switcher -->
    <div class="card mb-2">
      <div class="card-header d-flex flex-column flex-lg-row justify-content-between align-items-center gap-3">
        <div class="input-group">
          <button type="button" class="btn btn-outline-primary" @click="adjustDates(-1)">
            <font-awesome-icon :icon="['fas', 'arrow-left']" />
          </button>
          <input type="date" class="form-control" id="selectedDate" v-model="formattedCurrentDate" />
          <button type="button" class="btn btn-outline-primary" @click="adjustDates(1)">
            <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </button>
        </div>
        <div class="d-flex gap-2 justify-content-center flex-wrap flex-md-nowrap">
          <button type="button" class="btn"
            :class="selectedMealType === 'Breakfast' ? 'btn-primary' : 'btn-outline-primary'"
            @click="selectedMealType = 'Breakfast'">
            <font-awesome-icon icon="coffee" class="me-2" /> Breakfast
          </button>
          <button type="button" class="btn"
            :class="selectedMealType === 'Lunch' ? 'btn-primary' : 'btn-outline-primary'"
            @click="selectedMealType = 'Lunch'">
            <font-awesome-icon icon="hamburger" class="me-2" /> Lunch
          </button>
          <button type="button" class="btn"
            :class="selectedMealType === 'Dinner' ? 'btn-primary' : 'btn-outline-primary'"
            @click="selectedMealType = 'Dinner'">
            <font-awesome-icon icon="drumstick-bite" class="me-2" /> Dinner
          </button>
          <button type="button" class="btn"
            :class="selectedMealType === 'Snack' ? 'btn-primary' : 'btn-outline-primary'"
            @click="selectedMealType = 'Snack'">
            <font-awesome-icon icon="cookie-bite" class="me-2" /> Snacks
          </button>
        </div>
        <div class="input-group">
          <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"
            aria-expanded="false">
            <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
          </button>
          <ul class="dropdown-menu">
            <template v-if="filteredWaterLogs.length === 0">
              <li class="dropdown-item text-muted">No water logs available</li>
            </template>
            <template v-else v-for="item in filteredWaterLogs"
              :key="item.servingconsumed + (item.dateadded ? item.dateadded.toISOString() : '')">
              <li>
                <button class="dropdown-item" id="removeWaterItem" @click="removeItem(item)">
                  <font-awesome-icon :icon="['fas', 'trash']" class="me-2" />
                  {{ item.servingconsumed }} oz
                </button>
              </li>
            </template>
          </ul>
          <input type="meallogs" class="form-control" placeholder="Water Consumed (oz)" v-model="water" />
          <button class="btn btn-primary" @click="addWaterLog" @keydown.enter="addWaterLog">
            <font-awesome-icon :icon="['fas', 'plus']" />
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="d-grid todays-stats">
          <!-- Days Stats -->
          <circle-percentage :progress="(((computeTotals('all').day.water) / 128) * (100)).toFixed(0)" size="8"
            title="Water" />
          <circle-percentage :progress="(((computeTotals('all').day.calories) / (stats.caloriegoal ?? stats.recommendedcaloriegoal ?? 1)) * (100)).toFixed(0)" size="8"
            title="Calories" />
          <circle-percentage :progress="(((computeTotals('all').day.carbs) / stats.carbgrams) * (100)).toFixed(0)" size="8"
            title="Carbs" />
          <circle-percentage :progress="(((computeTotals('all').day.protein) / stats.proteingrams) * (100)).toFixed(0)" size="8"
            title="Proteins" />
          <circle-percentage :progress="(((computeTotals('all').day.fat) / stats.fatgrams) * (100)).toFixed(0)" size="8"
            title="Fats" />
        </div>
      </div>
    </div>

    <!-- Selected Meal Type Section -->
    <div class="mb-5">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h3 class="mb-0">
            <font-awesome-icon :icon="selectedMealType === 'Breakfast'
              ? 'coffee'
              : selectedMealType === 'Lunch'
                ? 'hamburger'
                : selectedMealType === 'Dinner'
                  ? 'drumstick-bite'
                  : selectedMealType === 'Snack'
                    ? 'cookie-bite'
                    : 'ban'
              " class="me-2" />
            {{ selectedMealType }}
          </h3>
          <button @click="routeToSearch(selectedMealType)" class="btn btn-primary">
            <font-awesome-icon :icon="['fas', 'plus']" /> Add Meal
          </button>
        </div>

        <!-- Totals -->
        <div class="card-body">
          <div class="row text-center mb-3">
            <div class="col-6 col-md-3">
              <h5>Total Calories</h5>
              <p>{{ computeTotals(selectedMealType).calories.toFixed(1) }} kcal</p>
            </div>
            <div class="col-6 col-md-3">
              <h5>Total Protein</h5>
              <p>{{ computeTotals(selectedMealType).protein.toFixed(1) }} g</p>
            </div>
            <div class="col-6 col-md-3">
              <h5>Total Carbs</h5>
              <p>{{ computeTotals(selectedMealType).carbs.toFixed(1) }} g</p>
            </div>
            <div class="col-6 col-md-3">
              <h5>Total Fat</h5>
              <p>{{ computeTotals(selectedMealType).fat.toFixed(1) }} g</p>
            </div>
          </div>

          <!-- Meal Logs -->
          <div class="row">
            <div v-for="item in filteredMealLogs" :key="item.barcode + item.dateadded"
              class="col-12 col-md-6 col-lg-4 mb-4">
              <div v-if="item.foodItem" class="card h-100">
                <img :src="item.foodItem.image" class="card-img-top" alt="{{ item.foodItem.foodname }}"
                  style="height: 200px; object-fit: cover;" />
                <div class="card-body">
                  <h5 class="card-title">{{ item.foodItem.foodname }}</h5>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                      Calories: {{ (item.foodItem.calories_per_serv * item.servingconsumed).toFixed(1) }} kcal
                    </li>
                    <li class="list-group-item">
                      Protein: {{ (item.foodItem.protein_per_serv * item.servingconsumed).toFixed(1) }} g
                    </li>
                    <li class="list-group-item">
                      Carbs: {{ (item.foodItem.carb_per_serv * item.servingconsumed).toFixed(1) }} g
                    </li>
                    <li class="list-group-item">
                      Fat: {{ (item.foodItem.fat_per_serv * item.servingconsumed).toFixed(1) }} g
                    </li>
                    <li class="list-group-item">
                      Serving Consumed: {{ item.servingconsumed }}
                    </li>
                  </ul>
                </div>
                <div class="card-footer text-muted d-grid grid-template-columns-1-2 align-items-center">
                  <div class="text-start">
                    <button class="btn btn-outline-primary mb-2" id="removeFoodItem" @click="removeItem(item)">
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </button>
                  </div>
                  <div class="text-end">
                    <font-awesome-icon :icon="['fas', 'calendar-alt']" class="me-2" />
                    <small>{{ prettyDate(item.dateadded ?? new Date()) }}</small>
                  </div>
                </div>

              </div>
            </div>

            <!-- No Meals Message -->
            <div v-if="filteredMealLogs.length === 0" class="col-12 text-center my-3">
              <p>No meals logged for {{ selectedMealType }} during this period.</p>
            </div>

            <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-labelledby="confirmDeleteModalLabel"
              aria-hidden="true" ref="confirmDeleteModal">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="confirmDeleteModalLabel">Confirm Deletion</h5>
                    <button type="button" class="btn-close" @click="cancelDelete" data-bs-dismiss="modal"
                      aria-label="Close">
                    </button>
                  </div>
                  <div class="modal-body">
                    <template v-if="itemToDelete?.foodItem">
                      <p>Are you sure you want to remove "{{ itemToDelete.foodItem.foodname }}" from your meal log?</p>
                      <img :src="itemToDelete.foodItem.image" :alt="itemToDelete.foodItem.foodname"
                        style="height: 200px; object-fit: cover;" />
                    </template>
                    <template v-else>
                      <p>Are you sure you want to remove this water log from your meal log?</p>
                    </template>
                  </div>

                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="cancelDelete">
                      Cancel
                    </button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="confirmDelete">
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import { ExtendedMealLog, MealType, UserStat } from '@/models/Models';
import router from '@/router';
import { useMealLogStore } from '@/stores/MealLog';
import { getMealLogs, addMealLog, deleteMealLog } from '@/services/MealLogs';
import { logger } from '@/services/Logger';
import { Modal } from 'bootstrap';
import { getUserStat, ProfileStats } from '@/services/UserStats';

export default defineComponent({
  name: 'MealLogs',
  methods: {
    computeTotals(mealType: string) {
      const totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        day: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          water: 0,
        }
      };

      this.mealLogs.forEach((item) => {
        if (item.mealtype.toLowerCase() === 'water') {
          totals.day.water += item.servingconsumed;
        }

        if (item.foodItem && item.mealtype.toLowerCase() !== 'water') {
          totals.day.calories += item.foodItem.calories_per_serv * item.servingconsumed;
          totals.day.protein += item.foodItem.protein_per_serv * item.servingconsumed;
          totals.day.carbs += item.foodItem.carb_per_serv * item.servingconsumed;
          totals.day.fat += item.foodItem.fat_per_serv * item.servingconsumed;
        }

        if (item.foodItem && item.mealtype.toLowerCase() === mealType.toLowerCase()) {
          totals.calories += item.foodItem.calories_per_serv * item.servingconsumed;
          totals.protein += item.foodItem.protein_per_serv * item.servingconsumed;
          totals.carbs += item.foodItem.carb_per_serv * item.servingconsumed;
          totals.fat += item.foodItem.fat_per_serv * item.servingconsumed;
        }
      });

      return totals;
    },
  },
   setup() {
    const mealLogs = ref<ExtendedMealLog[]>([]);
    const mealLogStore = useMealLogStore();
    const selectedMealType = ref<MealType>(mealLogStore.getSelectedMealType());
    const itemToDelete = ref<ExtendedMealLog | null>(null);
    const water = ref<number | null>(null);
    const stats = ref<ProfileStats>({
      caloriegoal: 0,
      proteingrams: 0,
      carbgrams: 0,
      fatgrams: 0,
      height: 0,
      weight: 0,
      goal: 0,
      activitylevel: 0,
      sex: 0,
      proteinpercentage: 0,
      fatpercentage: 0,
      carbpercentage: 0,
      dateofbirth: new Date(),
      updatedon: new Date(),
    });

    const routeToSearch = (mealType: MealType) => {
      logger.info('Adding Meal Type to meal log store');
      mealLogStore.setMealLog({
        barcode: '',
        mealtype: mealType,
        servingconsumed: 0,
      });
      logger.info('Routing to search page with meal type:', mealType);
      router.push({ path: '/search' });
    };

    const updateMealLogs = async (start: Date) => {
      const response = (await getMealLogs(start, start)) as ExtendedMealLog[];
      mealLogs.value = response.map((item) => ({
        ...item,
        dateadded: item.dateadded ? new Date(item.dateadded) : undefined,
      }));
    };

    const adjustDates = (days: number) => {
      logger.info('Adjusting dates by', days, 'days');
      logger.info('Current date:', );

      const newcurrentDate = new Date(mealLogStore.currentDateMealLog);
      newcurrentDate.setDate(newcurrentDate.getDate() + days);
      mealLogStore.currentDateMealLog = newcurrentDate;

      logger.info('New date:', mealLogStore.currentDateMealLog);
    };

    onMounted(async () => {
      const mealLogStore = useMealLogStore();
      const existingMealLog = mealLogStore.getMealLog();
      if (
        existingMealLog.barcode !== '' &&
        existingMealLog.dateadded !== undefined &&
        existingMealLog.servingconsumed !== 0
      ) {
        logger.info('Adding existing meal log to meal logs:', existingMealLog);
        await addMealLog(existingMealLog);
        logger.info('Added existing meal log to meal logs');
        logger.info('Clearing existing meal log');
        mealLogStore.clearMealLog();
      }

      logger.info('Fetching meal logs');
      await updateMealLogs(mealLogStore.currentDateMealLog);
    });

    const prettyDate = (date: Date) => {
      return new Date(date).toLocaleString();
    };

    const formattedCurrentDate = computed({
      get() {
        if (!mealLogStore.currentDateMealLog) {
          return '';
        }
        const date = new Date(mealLogStore.currentDateMealLog);
        return date.toISOString().split('T')[0];
      },
      set(value: string) {
        mealLogStore.currentDateMealLog = new Date(value);
      },
    });

    const sortedMealLogs = computed(() => {
      return mealLogs.value
        .slice()
        .sort(
          (a, b) =>
            new Date(b.dateadded ?? 0).getTime() -
            new Date(a.dateadded ?? 0).getTime()
        );
    });

    const filteredMealLogs = computed(() => {
      mealLogStore.setSelectedMealType(selectedMealType.value);
      return sortedMealLogs.value.filter(
        (item) => item.mealtype === selectedMealType.value
      );
    });

    const filteredWaterLogs = computed(() => {
      return sortedMealLogs.value.filter(
        (item) => item.mealtype.toLowerCase() === 'water'
      );
    });

    watch(() => mealLogStore.currentDateMealLog,
    (newDate) => {
      if (newDate) {
        updateMealLogs(newDate);
      }
    });

    const removeItem = (item: ExtendedMealLog) => {
      const modal = new Modal(document.getElementById('confirmDeleteModal')!);
      itemToDelete.value = item;
      modal.show();
    };

    const confirmDelete = async () => {
      if (itemToDelete.value) {
        await deleteMealLog(itemToDelete.value.id);
        updateMealLogs(mealLogStore.currentDateMealLog);
        itemToDelete.value = null;
      }
    };

    const cancelDelete = () => {
      itemToDelete.value = null;
    };

    const addWaterLog = async () => {
      if (!water.value) {
        logger.warn('No water value provided');
        return;
      }

      await addMealLog(
        {
          barcode: 'water',
          mealtype: 'Water',
          servingconsumed: water.value ?? 0,
          dateadded: mealLogStore.currentDateMealLog,
        }
      );

      water.value = null;
      updateMealLogs(mealLogStore.currentDateMealLog);

    };

    const statistics = async () => {
      getUserStat().then((response) => {
        if ('caloriegoal' in response) {
          stats.value = response as UserStat;
        } else {
          logger.error('Failed to fetch user stats:', response);
        }
      });
    };

    statistics();

    return {
      mealLogs,
      routeToSearch,
      prettyDate,
      updateMealLogs,
      formattedCurrentDate,
      sortedMealLogs,
      filteredMealLogs,
      selectedMealType,
      removeItem,
      adjustDates,
      itemToDelete,
      water,
      addWaterLog,
      filteredWaterLogs,
      deleteMealLog,
      cancelDelete,
      confirmDelete,
      stats,
    };
  },
});
</script>
