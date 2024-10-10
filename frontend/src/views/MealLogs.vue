<!--
    set the button that is selected to primaryx 
    add quotes around the delete messagex
    remove date scrolling and make it date picker
    add snacks to the meal type switcherx
    add water to the meal type switcher
    -->
<template>
<!-- Water Consumption Tracker -->
    <div>
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h3 class="mb-0">
            <font-awesome-icon icon="tint" class="me-2" /> Water Consumption
          </h3>
        </div>
        <div class="card-body">
          <div class="input-group mb-3">
            <input type="number" class="form-control" v-model="water" placeholder="Enter amount in Oz" />
          </div>
          <ul class="list-group">
            <!-- <li v-for="log in waterLogs" :key="log.id" class="list-group-item">
              {{ log.amount }} ml - {{ log.dateadded }}
            </li> -->
          </ul>
        </div>
      </div>
    </div>


  <div class="container-fluid">
    <!-- Meal Type Switcher -->
    <div class="row mb-4">
      <div class="col-12 text-center">
        <div class="btn-group" role="group" aria-label="Meal Type Switcher">
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
            :class="selectedMealType === 'Snacks' ? 'btn-primary' : 'btn-outline-primary'"
            @click="selectedMealType = 'Snacks'">
            <font-awesome-icon icon="cookie-bite" class="me-2" /> Snacks
          </button>          
        </div>
      </div>
    </div>

    <!-- Date Range Selection -->
    <div class="row mb-4">
      <div class="input-group">
        <button type="button" class="btn btn-outline-primary" @click="adjustDates(-1)">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </button>
          <input type="date" class="form-control" id="selectedDate" v-model="formattedEndDate" />
        <button type="button" class="btn btn-outline-primary" @click="adjustDates(1)">
          <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </button>
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
                : 'drumstick-bite'
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
                    <button class="btn btn-outline-primary mb-2" @click="removeItem(item)">
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
                    <h5 class="modal-title" id="confirmDeleteModalLabel">
                      Confirm Deletion
                    </h5>
                    <button type="button" class="btn-close" @click="cancelDelete" data-bs-dismiss="modal"
                      aria-label="Close"></button>
                  </div>
                  <div v-if="itemToDelete?.foodItem" class="modal-body">
                    <p>Are you sure you want to remove "{{ itemToDelete?.foodItem.foodname }}" from your meal log?</p>
                    <img :src="itemToDelete?.foodItem.image" alt="{{ itemToDelete?.foodItem.foodname }}"
                      style="height: 200px; object-fit: cover;" />
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                      @click="cancelDelete">Cancel</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                      @click="confirmDelete()">Confirm</button>
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
import { ExtendedMealLog, MealType } from '@/models/Models';
import router from '@/router';
import { useMealLogStore } from '@/stores/MealLog';
import { getMealLogs, addMealLog, deleteMealLog } from '@/services/MealLogs';
import { logger } from '@/services/Logger';
import { Modal } from 'bootstrap';

export default defineComponent({
  name: 'MealLogs',
  methods: {
    computeTotals(mealType: string) {
      const totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };

      this.mealLogs.forEach((item) => {
        if (item.foodItem && item.mealtype.toLowerCase() === mealType.toLowerCase()) {
          totals.calories +=
            item.foodItem.calories_per_serv * item.servingconsumed;
          totals.protein +=
            item.foodItem.protein_per_serv * item.servingconsumed;
          totals.carbs += item.foodItem.carb_per_serv * item.servingconsumed;
          totals.fat += item.foodItem.fat_per_serv * item.servingconsumed;
        }
      });

      return totals;
    },
  },
  setup() {
    const mealLogs = ref<ExtendedMealLog[]>([]);
    const water = ref<number>(0);
    const startDate = ref(new Date());
    const endDate = ref(new Date());
    const selectedMealType = ref<MealType>('Breakfast');
    const itemToDelete = ref<ExtendedMealLog | null>(null);

    const routeToSearch = (mealType: MealType) => {
      logger.info('Adding Meal Type to meal log store');
      const mealLogStore = useMealLogStore();
      mealLogStore.setMealLog({
        barcode: '',
        mealtype: mealType,
        servingconsumed: 0,
      });
      logger.info('Routing to search page with meal type:', mealType);
      router.push({ path: '/search' });
    };

    const updateMealLogs = async (start: Date, end: Date) => {
      const response = (await getMealLogs(start, end)) as ExtendedMealLog[];
      mealLogs.value = response.map((item) => ({
        ...item,
        dateadded: item.dateadded ? new Date(item.dateadded) : undefined,
      }));
    };

    const adjustDates = (days: number) => {
      logger.info('Adjusting dates by', days, 'days');
      const newStartDate = new Date(startDate.value);
      const newEndDate = new Date(endDate.value);
      newStartDate.setDate(newStartDate.getDate() + days);
      newEndDate.setDate(newEndDate.getDate() + days);
      startDate.value = newStartDate;
      endDate.value = newEndDate;
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
      await updateMealLogs(startDate.value, endDate.value);
    });

    const prettyDate = (date: Date) => {
      return new Date(date).toLocaleString();
    };

    const formattedStartDate = computed({
      get() {
        if (!startDate.value) {
          return '';
        }
        const date = new Date(startDate.value);
        return date.toISOString().split('T')[0];
      },
      set(value: string) {
        startDate.value = new Date(value);
      },
    });

    const formattedEndDate = computed({
      get() {
        if (!endDate.value) {
          return '';
        }
        const date = new Date(endDate.value);
        return date.toISOString().split('T')[0];
      },
      set(value: string) {
        endDate.value = new Date(value);
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
      return sortedMealLogs.value.filter(
        (item) => item.mealtype === selectedMealType.value
      );
    });

    watch([startDate, endDate], ([newStartDate, newEndDate]) => {
      if (newStartDate && newEndDate) {
        updateMealLogs(newStartDate, newEndDate);
      }
    });

    const computeTotals = (mealType: MealType) => {
      const totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };

      mealLogs.value.forEach((item) => {
        if (item.mealtype === mealType) {
          totals.calories +=
            item.foodItem.calories_per_serv * item.servingconsumed;
          totals.protein +=
            item.foodItem.protein_per_serv * item.servingconsumed;
          totals.carbs += item.foodItem.carb_per_serv * item.servingconsumed;
          totals.fat += item.foodItem.fat_per_serv * item.servingconsumed;
        }
      });

      return totals;
    };

    const removeItem = (item: ExtendedMealLog) => {
      const modal = new Modal(document.getElementById('confirmDeleteModal')!);
      itemToDelete.value = item;
      modal.show();
    };

    const confirmDelete = async () => {
      if (itemToDelete.value) {
        await deleteMealLog(itemToDelete.value.id);
        mealLogs.value = mealLogs.value.filter(
          (log) => log.id !== itemToDelete.value!.id
        );
        itemToDelete.value = null;
      }
    };

    const cancelDelete = () => {
      itemToDelete.value = null;
    };

    return {
      mealLogs,
      routeToSearch,
      prettyDate,
      updateMealLogs,
      startDate,
      endDate,
      formattedStartDate,
      formattedEndDate,
      sortedMealLogs,
      filteredMealLogs,
      selectedMealType,
      removeItem,
      confirmDelete,
      cancelDelete,
      adjustDates,
      itemToDelete,
      water,
    };
  },
});
</script>
