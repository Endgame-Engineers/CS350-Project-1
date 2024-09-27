<script setup lang="ts">
import { updateUserStat, userStats } from '@/services/UserStats';
import { reactive, watch } from 'vue';

type ProfileStats = {
    proteinpercentage: number;
    fatpercentage: number;
    carbpercentage: number;
};

const adjustPercentages = (changedStat: keyof ProfileStats, newValue: number) => {
    // Update the changed stat first
    (userStats.value as ProfileStats)[changedStat] = newValue;

    // Calculate total and excess
    const total = userStats.value.proteinpercentage + userStats.value.fatpercentage + userStats.value.carbpercentage;
    let excess = total - 100;

    // If there's excess, adjust other percentages
    if (excess > 0) {
        const stats: (keyof ProfileStats)[] = ['proteinpercentage', 'fatpercentage', 'carbpercentage'];
        const otherStats = stats.filter(stat => stat !== changedStat);

        for (let stat of otherStats) {
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
</script>
<template>
    <div class="row">
        <div class="col-12 col-md-4 mb-3">
            <label for="proteinPercentage" class="form-label">Protein Percentage</label>
            <div class="d-flex justify-content-between">
                <span>1%</span>
                <span>{{ userStats.proteinpercentage }}%</span>
                <span>100%</span>
            </div>
            <input type="range" step="5" min="1" max="100" class="form-control" id="proteinPercentage"
                v-model.number="userStats.proteinpercentage" @change="updateUserStat('proteinpercentage', $event)">
        </div>
        <div class="col-12 col-md-4 mb-3">
            <label for="fatPercentage" class="form-label">Fat Percentage</label>
            <div class="d-flex justify-content-between">
                <span>1%</span>
                <span>{{ userStats.fatpercentage }}%</span>
                <span>100%</span>
            </div>
            <input type="range" step="5" min="1" max="100" class="form-control" id="fatPercentage"
                v-model.number="userStats.fatpercentage" @change="updateUserStat('fatpercentage', $event)">
        </div>
        <div class="col-12 col-md-4 mb-3">
            <label for="carbPercentage" class="form-label">Carb Percentage</label>
            <div class="d-flex justify-content-between">
                <span>1%</span>
                <span>{{ userStats.carbpercentage }}%</span>
                <span>100%</span>
            </div>
            <input type="range" step="5" min="1" max="100" class="form-control" id="carbPercentage"
                v-model.number="userStats.carbpercentage" @change="updateUserStat('carbpercentage', $event)">
        </div>
    </div>
</template>