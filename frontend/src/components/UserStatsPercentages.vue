<script setup lang="ts">
import { watch, defineProps, ref, computed, defineEmits } from 'vue';

const props = defineProps<{
  isEditing: boolean;
  userStats: ProfileStats;
  editUserStats: ProfileStats;
}>();


type ProfileStats = {
  proteinpercentage: number;
  fatpercentage: number;
  carbpercentage: number;
};

type PercentageKeys = keyof ProfileStats;

const currentStats = computed<ProfileStats>(() => {
  return props.isEditing ? props.editUserStats : props.userStats;
});

const emit = defineEmits(['update-validity', 'reset-warning']);

const totalPercentage = ref(0);
const isValid = computed(() => totalPercentage.value === 100);
const showWarning = ref(false);

const adjustPercentages = (changedStat: PercentageKeys, newValue: number) => {
  currentStats.value[changedStat] = newValue;

  const total =
    currentStats.value.proteinpercentage +
    currentStats.value.fatpercentage +
    currentStats.value.carbpercentage;

  totalPercentage.value = total;
  showWarning.value = total !== 100;
  // Emit the validity state
  emit('update-validity', isValid.value);
};

// Watchers for changes in percentages
watch(
  () => currentStats.value.proteinpercentage,
  (newValue) => {
    adjustPercentages('proteinpercentage', newValue);
  }
);

watch(
  () => currentStats.value.fatpercentage,
  (newValue) => {
    adjustPercentages('fatpercentage', newValue);
  }
);

watch(
  () => currentStats.value.carbpercentage,
  (newValue) => {
    adjustPercentages('carbpercentage', newValue);
  }
);
</script>

<template>
  <div class="row">
    <!-- Protein Percentage -->
    <div class="col-12 col-md-4 mb-3">
      <label for="proteinPercentage" class="form-label"><strong>Protein Percentage</strong></label>
      <div class="d-flex justify-content-between">
        <span v-if="isEditing">1%</span>
        <span v-if="isEditing">{{ currentStats.proteinpercentage }}%</span>
        <span v-if="!isEditing" class="display-6 text-center">
          {{ currentStats.proteinpercentage }}%
        </span>
        <span v-if="isEditing">100%</span>
      </div>
      <input v-if="isEditing" type="range" step="5" min="0" max="100" class="form-control" id="proteinPercentage"
        v-model.number="currentStats.proteinpercentage" />
    </div>

    <!-- Fat Percentage -->
    <div class="col-12 col-md-4 mb-3">
      <label for="fatPercentage" class="form-label"><strong>Fat Percentage</strong></label>
      <div class="d-flex justify-content-between">
        <span v-if="isEditing">1%</span>
        <span v-if="isEditing">{{ currentStats.fatpercentage }}%</span>
        <span v-if="!isEditing" class="display-6 text-center">
          {{ currentStats.fatpercentage }}%
        </span>
        <span v-if="isEditing">100%</span>
      </div>
      <input v-if="isEditing" type="range" step="5" min="0" max="100" class="form-control" id="fatPercentage"
        v-model.number="currentStats.fatpercentage" />
    </div>

    <!-- Carb Percentage -->
    <div class="col-12 col-md-4 mb-3">
      <label for="carbPercentage" class="form-label"><strong>Carb Percentage</strong></label>
      <div class="d-flex justify-content-between">
        <span v-if="isEditing">1%</span>
        <span v-if="isEditing">{{ currentStats.carbpercentage }}%</span>
        <span v-if="!isEditing" class="display-6 text-center">
          {{ currentStats.carbpercentage }}%
        </span>
        <span v-if="isEditing">100%</span>
      </div>
      <input v-if="isEditing" type="range" step="5" min="0" max="100" class="form-control" id="carbPercentage"
        v-model.number="currentStats.carbpercentage" />
    </div>
  </div>


  <div class="p-4">
    <div v-if="showWarning" class="alert alert-warning" role="alert">
      The total percentage must add up to 100%.
    </div>
  </div>
</template>
