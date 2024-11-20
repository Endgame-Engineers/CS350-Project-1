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
        <div class="d-flex gap-2 justify-content-center flex-wrap flex-md-nowrap w-100">
          <button type="button" class="btn flex-fill d-flex align-items-center justify-content-center"
            :class="selectedLogType === 'Breakfast' ? 'btn-primary' : 'btn-outline-primary'"
            @click="selectedLogType = 'Breakfast'">
            <font-awesome-icon icon="coffee" class="me-2" alt="Breakfast" />
            <span class="d-none d-md-inline">Breakfast</span>
          </button>
          <button type="button" class="btn flex-fill d-flex align-items-center justify-content-center"
            :class="selectedLogType === 'Lunch' ? 'btn-primary' : 'btn-outline-primary'"
            @click="selectedLogType = 'Lunch'">
            <font-awesome-icon icon="hamburger" class="me-2" alt="Lunch" />
            <span class="d-none d-md-inline">Lunch</span>
          </button>
          <button type="button" class="btn flex-fill d-flex align-items-center justify-content-center"
            :class="selectedLogType === 'Dinner' ? 'btn-primary' : 'btn-outline-primary'"
            @click="selectedLogType = 'Dinner'">
            <font-awesome-icon icon="drumstick-bite" class="me-2" alt="Dinner" />
            <span class="d-none d-md-inline">Dinner</span>
          </button>
          <button type="button" class="btn flex-fill d-flex align-items-center justify-content-center"
            :class="selectedLogType === 'Snack' ? 'btn-primary' : 'btn-outline-primary'"
            @click="selectedLogType = 'Snack'">
            <font-awesome-icon icon="cookie-bite" class="me-2" alt="Snacks" />
            <span class="d-none d-md-inline">Snacks</span>
          </button>
          <button type="button" class="btn flex-fill d-flex align-items-center justify-content-center"
            :class="selectedLogType === 'Activity' ? 'btn-primary' : 'btn-outline-primary'"
            @click="selectedLogType = 'Activity'">
            <font-awesome-icon icon="line-chart" class="me-2" alt="Activity" />
            <span class="d-none d-md-inline">Activity</span>
          </button>
        </div>
        <div class="input-group">
          <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"
            aria-expanded="false">
            <font-awesome-icon :icon="['fas', 'droplet']" />
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
            title="Water" :subtitle="`${computeTotals('all').day.water.toFixed(0)}/${userStatValue?.watergoal}oz`" />
          <circle-percentage
            :progress="(((computeTotals('all').day.calories)) / (userStatValue?.caloriegoal ?? 1) * 100).toFixed(0)"
            size="8" title="Calories"
            :subtitle="`${Math.round(computeTotals('all').day.calories)}/${Math.round(userStatValue?.caloriegoal ?? 1)}kcal`" />
          <circle-percentage
            :progress="(((computeTotals('all').day.carbs) / (userStatValue?.carbgrams ?? 1)) * (100)).toFixed(0)"
            size="8" title="Carbs"
            :subtitle="`${Math.round(computeTotals('all').day.carbs)}/${Math.round(userStatValue?.carbgrams ?? 1)}g`" />
          <circle-percentage
            :progress="(((computeTotals('all').day.protein) / (userStatValue?.proteingrams ?? 1)) * (100)).toFixed(0)"
            size="8" title="Proteins"
            :subtitle="`${Math.round(computeTotals('all').day.protein)}/${Math.round(userStatValue?.proteingrams ?? 1)}g`" />
          <circle-percentage
            :progress="(((computeTotals('all').day.fat) / (userStatValue?.fatgrams ?? 1)) * (100)).toFixed(0)" size="8"
            title="Fats"
            :subtitle="`${Math.round(computeTotals('all').day.fat)}/${Math.round(userStatValue?.fatgrams ?? 1)}g`" />
        </div>
      </div>
    </div>

    <!-- Selected Meal Type Section -->
    <div class="mb-5">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h3 class="mb-0">
            <font-awesome-icon :icon="selectedLogType === 'Breakfast'
              ? 'coffee'
              : selectedLogType === 'Lunch'
                ? 'hamburger'
                : selectedLogType === 'Dinner'
                  ? 'drumstick-bite'
                  : selectedLogType === 'Snack'
                    ? 'cookie-bite'
                    : selectedLogType === 'Activity'
                      ? 'line-chart'
                      : 'ban'
              " class="me-2" />
            {{ selectedLogType }}
          </h3>
          <button @click="routeToSearch(selectedLogType, currentDate)" class="btn btn-primary"
            v-if="selectedLogType !== 'Activity'">
            <font-awesome-icon :icon="['fas', 'plus']" /> Add Meal
          </button>
          <button @click="logActivity()" class="btn btn-primary" v-else>
            <font-awesome-icon :icon="['fas', 'plus']" /> Add Activity
          </button>
        </div>

        <!-- Totals -->
        <div class="card-body">
          <template v-if="selectedLogType !== 'Activity'">
            <div class="row text-center mb-3">
              <div class="col-6 col-md-3">
                <h5>Total Calories</h5>
                <p>{{ computeTotals(selectedLogType).calories.toFixed(1) }} kcal</p>
              </div>
              <div class="col-6 col-md-3">
                <h5>Total Protein</h5>
                <p>{{ computeTotals(selectedLogType).protein.toFixed(1) }} g</p>
              </div>
              <div class="col-6 col-md-3">
                <h5>Total Carbs</h5>
                <p>{{ computeTotals(selectedLogType).carbs.toFixed(1) }} g</p>
              </div>
              <div class="col-6 col-md-3">
                <h5>Total Fat</h5>
                <p>{{ computeTotals(selectedLogType).fat.toFixed(1) }} g</p>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="row text-center mb-3">
              <div class="col-6 col-md-3">
                <h5>Total Duration</h5>
                <p>{{ computeTotals('Activity').durationminutes.toFixed(1) }} minutes</p>
              </div>
              <div class="col-6 col-md-3">
                <h5>Total Calories Burned</h5>
                <p>{{ computeTotals('Activity').caloriesburned.toFixed(1) }} kcal</p>
              </div>
            </div>
          </template>

          <!-- Logs -->
          <template v-if="isExtendedMealLogArray(filteredLogs)">
            <div v-for="item in filteredLogs" :key="item.id" class="col-12 col-md-6 col-lg-4 mb-3">
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
          </template>
          <template v-else>
            <div v-for="item in filteredLogs" :key="item.id" class="col-12 col-md-6 col-lg-4 mb-3">
              <div class="card h-100">
                <div class="card-body">
                  <h5 class="card-title" v-if="item.activity">{{ item.activity.activity }}</h5>
                  <ul class="list-group">
                    <li class="list-group">
                      Duration: {{ item.durationminutes }} minutes
                    </li>
                    <li class="list-group">
                      Description: {{ item.activity?.description }}
                    </li>
                    <li class="list-group">
                      Calories Burned: {{ item.caloriesburned }} kcal
                    </li>
                    <li class="list-group">
                      <small>{{ prettyDate(item.dateadded ?? new Date()) }}</small>
                    </li>
                  </ul>
                  <button class="btn btn-outline-primary mb-2" id="removeFoodItem" @click="removeItem(item)">
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </button>
                </div>
              </div>
            </div>
          </template>
        </div>
        <!-- No Meals Message -->
        <div v-if="filteredLogs.length === 0" class="col-12">
          <div class="text-center mb-3">
            No {{ selectedLogType }} logs available.
          </div>
        </div>

        <!-- Confirm Delete Modal -->
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
                <template v-if="itemToDelete && 'foodItem' in itemToDelete">
                  <p>Are you sure you want to remove "{{ itemToDelete.foodItem?.foodname }}" from your meal log?
                  </p>
                  <img :src="itemToDelete.foodItem?.image" :alt="itemToDelete.foodItem?.foodname"
                    style="height: 200px; object-fit: cover;" />
                </template>
                <template v-else-if="itemToDelete && 'activityid' in itemToDelete">
                  <p>Are you sure you want to remove "{{itemToDelete.activity?.activity + " - " + itemToDelete.activity?.description }}" from your activity log? </p>
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

        <!-- Add Activity Modal -->
        <div class="modal fade" id="addActivityModal" tabindex="-1" aria-labelledby="addActivityModalLabel"
          aria-hidden="true" ref="addActivityModal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="addActivityModalLabel">Add Activity</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                </button>
              </div>
              <div class="modal-body" id="addActivityModalBody">
                <!-- Dropdown with activities.activities -->
                <div class="input-group mb-3">
                  <label class="input-group-text" for="activity">Activity</label>
                  <select class="form-select" id="activity" v-model="newActivity.activityName">
                    <option value="" disabled>Select Activity</option>
                    <option v-for="activity in uniqueActivities" :key="activity" :value="activity">
                      {{ activity }}
                    </option>
                  </select>
                </div>
                <!-- Dropdown with activities.subActivities -->
                <div v-if="newActivity.activityName" class="input-group mb-3">
                  <label class="input-group-text" for="subActivity">Sub-Activity</label>
                  <select class="form-select" id="subActivity" v-model="newActivity.subActivity">
                    <option value="" disabled>Select Sub-Activity</option>
                    <option v-for="activity in subActivities" :key="activity.id" :value="activity">
                      {{ activity.description }}
                    </option>
                  </select>
                </div>

                <!-- Duration -->
                <div v-if="newActivity.subActivity" class="input-group mb-3">
                  <label class="input-group-text" for="duration">Duration (minutes)</label>
                  <input type="number" class="form-control" id="duration" v-model="newActivity.duration" />
                </div>

              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="addActivity">Add
                  Activity</button>
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
import { ExtendedMealLog, MealType, ActivityLog, UserStat, Activity } from '@/models/Models';
import router from '@/router';
import { useLogStore } from '@/stores/Log';
import { getMealLogs, addMealLog, deleteMealLog } from '@/services/MealLogs';
import { getUserStat } from '@/services/UserStats';
import { logger } from '@/services/Logger';
import { Modal } from 'bootstrap';
import { getActivityLogs, addActivityLog, deleteActivityLog, getActivities, ExtendedActivityLog } from '@/services/ActivityLogs';

export default defineComponent({
  name: 'UserLogs',
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
        },
        caloriesburned: 0,
        durationminutes: 0.0,
      };

      if (mealType !== 'Activity') {
        logger.info('Computing totals for meal logs');

        this.mealLogs.forEach((item: ExtendedMealLog) => {
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

        if (mealType === 'all') {
          totals.caloriesburned = this.computeTotals('Activity').caloriesburned;
          totals.durationminutes = this.computeTotals('Activity').durationminutes;
        }

        return totals;
      } else {
        logger.info('Computing totals for activity logs');

        this.activityLogs.forEach((item) => {
          if (item.caloriesburned !== undefined) {
            totals.caloriesburned += item.caloriesburned;
          }
          totals.durationminutes += item.durationminutes;
        });

        return totals;
      }
    },
  },
  setup() {
    const mealLogs = ref<ExtendedMealLog[]>([]);
    const userStatValue = ref<UserStat | null>(null);
    const activityLogs = ref<ActivityLog[]>([]);
    const currentDate = ref(new Date());
    const userLogStore = useLogStore();
    const selectedLogType = ref<string>(userLogStore.getSelectedLogType());
    const itemToDelete = ref<ExtendedMealLog | ActivityLog | null>(null);
    const water = ref<number | null>(null);
    const activities = ref<Activity[]>([]);
    const newActivity = ref<ExtendedActivityLog>(
      {
        activityName: '',
      }
    )

    const routeToSearch = (logType: string, start: Date) => {
      logger.info('Adding Meal Type to meal log store');
      userLogStore.setMealLog({
        barcode: '',
        mealtype: logType as MealType,
        servingconsumed: 0,
        dateadded: start,
      });
      logger.info('Routing to search page with meal type:', logType);
      router.push({ path: '/search' });
    };

    const updateLogs = async (start: Date) => {
      logger.info('Updating logs for date:', start);
      const mealLogsResponse = (await getMealLogs(start, start)) as ExtendedMealLog[];
      mealLogs.value = mealLogsResponse.map((item: ExtendedMealLog) => ({
        ...item,
        dateadded: item.dateadded ? new Date(item.dateadded) : undefined,
      }));

      const activityLogsResponse = (await getActivityLogs(start, start)) as ActivityLog[];
      activityLogs.value = activityLogsResponse;
    };

    const updateUserStat = async () => {
      logger.info('Fetching user stats');
      userStatValue.value = await getUserStat() as UserStat;
    };

    const adjustDates = (days: number) => {
      logger.info('Adjusting dates by', days, 'days');
      logger.info('Current date:', currentDate.value);

      const newcurrentDate = new Date(currentDate.value);
      newcurrentDate.setDate(newcurrentDate.getDate() + days);
      currentDate.value = newcurrentDate;

      logger.info('New date:', currentDate.value);
    };

    const isExtendedMealLogArray = (item: ExtendedMealLog[] | ActivityLog[]): item is ExtendedMealLog[] => {
      return (item as ExtendedMealLog[]).every((log) => log.foodItem !== undefined);
    };

    onMounted(async () => {
      const userLogStore = useLogStore();
      const existingMealLog = userLogStore.getMealLog();
      if (
        existingMealLog.barcode !== '' &&
        existingMealLog.dateadded !== undefined &&
        existingMealLog.servingconsumed !== 0
      ) {
        await addMealLog(existingMealLog);
        logger.info('Added existing meal log to meal logs');
        logger.info('Clearing existing meal log');

        userLogStore.clearMealLog();
      }

      await updateLogs(currentDate.value);

      logger.info('Fetching user stats');
      await updateUserStat();
    });

    const prettyDate = (date: Date) => {
      return new Date(date).toLocaleString();
    };

    const formattedCurrentDate = computed({
      get() {
        if (!currentDate.value) {
          return '';
        }
        const date = new Date(currentDate.value);
        return date.toISOString().split('T')[0];
      },
      set(value: string) {
        currentDate.value = new Date(value);
      },
    });

    const filteredWaterLogs = computed(() => {
      return mealLogs.value.filter(
        (item: ExtendedMealLog) => item.mealtype.toLowerCase() === 'water'
      );
    });

    const filteredLogs = computed(() => {
      userLogStore.setSelectedLogType(selectedLogType.value);
      logger.info('Filtering logs by selected log type:', selectedLogType.value);
      if (selectedLogType.value === 'Activity') {
        return activityLogs.value as ActivityLog[];
      }
      return mealLogs.value.filter(
        (item: ExtendedMealLog) => item.mealtype.toLowerCase() === selectedLogType.value.toLowerCase()
      ) as ExtendedMealLog[];
    });

    watch([currentDate], ([newcurrentDate]) => {
      if (newcurrentDate) {
        updateLogs(newcurrentDate);
      }
    });

    const removeItem = async (item: ExtendedMealLog | ActivityLog) => {
      const modal = new Modal(document.getElementById('confirmDeleteModal')!);
      itemToDelete.value = item;
      if(itemToDelete.value && 'foodItem' in itemToDelete.value) {
        logger.info('Removing meal log');
      } else if (itemToDelete.value && 'activity' in itemToDelete.value) {
        logger.info('Removing activity log');
        itemToDelete.value.activity = await getActivity(itemToDelete.value.activity?.id ?? 0);
      }
      modal.show();
    };

    const confirmDelete = async () => {
      if (itemToDelete.value && 'foodItem' in itemToDelete.value) {
        logger.info('Deleting meal log');
        await deleteMealLog(itemToDelete.value.id);
        updateLogs(currentDate.value);
        itemToDelete.value = null;
      } else if (itemToDelete.value && 'activity' in itemToDelete.value) {
        logger.info('Deleting activity log');
        if (itemToDelete.value.id !== undefined) {
          await deleteActivityLog(itemToDelete.value.id);
        }
        updateLogs(currentDate.value);
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
          dateadded: currentDate.value,
        }
      );

      water.value = null;
      updateLogs(currentDate.value);

    };

    const logActivity = () => {
      const modal = new Modal(document.getElementById('addActivityModal')!);
      modal.show();
    };

    const fetchActivities = async () => {
      activities.value = await getActivities();
    };

    const getActivity = async (id: number) => {
      return activities.value.find(activity => activity.id === id);
    };

    const uniqueActivities = computed(() => {
      const activityNames = new Set<string>();
      activities.value.forEach(activity => {
        activityNames.add(activity.activity);
      });
      return Array.from(activityNames);
    });

    const subActivities = computed(() => {
      return activities.value.filter(activity => activity.activity === newActivity.value?.activityName);
    });

    const addActivity = () => {
      if (!newActivity.value.activityName || !newActivity.value.subActivity || newActivity.value.duration === 0 || newActivity.value.duration === undefined) {
        logger.warn('No activity or sub-activity selected');
        return;
      }

      logger.info('Adding activity');

      const tempLog = {
        durationminutes: newActivity.value.duration,
        dateadded: currentDate.value,
        activityid: newActivity.value.subActivity.id,
      } as ActivityLog;
      addActivityLog(tempLog);

      logger.info('Activity added');
      updateLogs(currentDate.value);

      newActivity.value = {
        activityName: '',
      };
    };

    onMounted(async () => {
      await fetchActivities();

      logger.info('Fetching activities');

      const userLogStore = useLogStore();
      const existingMealLog = userLogStore.getMealLog();
      if (
        existingMealLog.barcode !== '' &&
        existingMealLog.dateadded !== undefined &&
        existingMealLog.servingconsumed !== 0
      ) {
        logger.info('Adding existing meal log to meal logs');

        await addMealLog(existingMealLog);
        logger.info('Added existing meal log to meal logs');
        logger.info('Clearing existing meal log');

        userLogStore.clearMealLog();
      }

      await updateLogs(currentDate.value);

      logger.info('Fetching user stats');
      await updateUserStat();
    });

    return {
      mealLogs,
      activityLogs,
      routeToSearch,
      prettyDate,
      updateLogs,
      currentDate,
      formattedCurrentDate,
      filteredLogs,
      selectedLogType,
      removeItem,
      adjustDates,
      itemToDelete,
      water,
      addWaterLog,
      filteredWaterLogs,
      deleteMealLog,
      cancelDelete,
      confirmDelete,
      logActivity,
      userStatValue,
      isExtendedMealLogArray,
      newActivity,
      addActivity,
      activities,
      uniqueActivities,
      subActivities,
      getActivity,
    };
  },
});
</script>
