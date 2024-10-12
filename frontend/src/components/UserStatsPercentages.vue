<script setup lang="ts">
import { userStats } from '@/services/UserStats';
import { watch, defineProps, ref, computed, defineEmits } from 'vue';

const props = defineProps<{
  isEditing: boolean;
}>();

type ProfileStats = {
  proteinpercentage: number;
  fatpercentage: number;
  carbpercentage: number;
};

const emit = defineEmits(['update-validity', 'reset-warning']);

const totalPercentage = ref(0);
const isValid = computed(() => totalPercentage.value === 100);
const showWarning = ref(false);

const adjustPercentages = (changedStat: keyof ProfileStats, newValue: number) => {
  // Update the changed stat first
  (userStats.value as ProfileStats)[changedStat] = newValue;

  // Calculate total and excess
  const total = userStats.value.proteinpercentage + userStats.value.fatpercentage + userStats.value.carbpercentage;
  totalPercentage.value = total;
  showWarning.value = total !== 100;

  // Emit the validity state
  emit('update-validity', isValid.value);

  let excess = total - 100;

  // If there's excess, adjust other percentages
  if (excess > 0) {
    const stats: (keyof ProfileStats)[] = ['proteinpercentage', 'fatpercentage', 'carbpercentage'];
    const otherStats = stats.filter(stat => stat !== changedStat);

    for (const stat of otherStats) {
      if (userStats.value[stat] > excess) {
        userStats.value[stat] -= excess;
        break;
      } else {
        excess -= userStats.value[stat];
        userStats.value[stat] = 0;
      }
    }
  }
};

// Watchers for changes in percentages
watch(() => userStats.value.proteinpercentage, (newValue) => {
  adjustPercentages('proteinpercentage', newValue);
});

watch(() => userStats.value.fatpercentage, (newValue) => {
  adjustPercentages('fatpercentage', newValue);
});

watch(() => userStats.value.carbpercentage, (newValue) => {
  adjustPercentages('carbpercentage', newValue);
});

// Listen for reset-warning event
const resetWarning = () => {
  showWarning.value = false;
};

watch(() => props.isEditing, (newVal) => {
  if (!newVal) {
    resetWarning();
  }
});
</script>

<template>
  <div class="row">
    <!-- Protein Percentage -->
    <div class="col-12 col-md-4 mb-3">
      <label for="proteinPercentage" class="form-label"><strong>Protein Percentage</strong></label>
      <div class="d-flex justify-content-between">
        <span v-if="props.isEditing">1%</span>
        <span v-if="props.isEditing">{{ userStats.proteinpercentage }}%</span>
        <span v-if="!props.isEditing" class="display-6 text-center">{{ userStats.proteinpercentage }}%</span>
        <span v-if="props.isEditing">100%</span>
      </div>
      <input
        v-if="props.isEditing"
        type="range"
        step="5"
        min="1"
        max="100"
        class="form-control"
        id="proteinPercentage"
        v-model.number="userStats.proteinpercentage"
      />
    </div>

    <!-- Fat Percentage -->
    <div class="col-12 col-md-4 mb-3">
      <label for="fatPercentage" class="form-label"><strong>Fat Percentage</strong></label>
      <div class="d-flex justify-content-between">
        <span v-if="props.isEditing">1%</span>
        <span v-if="props.isEditing">{{ userStats.fatpercentage }}%</span>
        <span v-if="!props.isEditing" class="display-6 text-center">{{ userStats.fatpercentage }}%</span>
        <span v-if="props.isEditing">100%</span>
      </div>
      <input
        v-if="props.isEditing"
        type="range"
        step="5"
        min="1"
        max="100"
        class="form-control"
        id="fatPercentage"
        v-model.number="userStats.fatpercentage"
      />
    </div>

    <!-- Carb Percentage -->
    <div class="col-12 col-md-4 mb-3">
      <label for="carbPercentage" class="form-label"><strong>Carb Percentage</strong></label>
      <div class="d-flex justify-content-between">
        <span v-if="props.isEditing">1%</span>
        <span v-if="props.isEditing">{{ userStats.carbpercentage }}%</span>
        <span v-if="!props.isEditing" class="display-6 text-center">{{ userStats.carbpercentage }}%</span>
        <span v-if="props.isEditing">100%</span>
      </div>
      <input
        v-if="props.isEditing"
        type="range"
        step="5"
        min="1"
        max="100"
        class="form-control"
        id="carbPercentage"
        v-model.number="userStats.carbpercentage"
      />
    </div>
  </div>

  <!-- Warning Popup -->
  <div v-if="showWarning" class="alert alert-warning" role="alert">
    The total percentage must add up to 100%.
  </div>
</template>