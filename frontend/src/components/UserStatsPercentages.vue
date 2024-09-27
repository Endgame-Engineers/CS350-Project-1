<script setup lang="ts">
import { updateUserStat, userStats } from '@/services/UserStats';
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