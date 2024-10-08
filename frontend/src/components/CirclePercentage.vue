<template>
    <div class="circle-container" :style="{ width: props.size + 'em', height: props.size + 'em' }">
        <svg class="progress-circle" viewBox="0 0 36 36">
            <!-- Background circle -->
            <path class="circle-bg" d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831" />
            <!-- Progress circle -->
            <path class="circle" :stroke-dasharray="props.progress + ', 100'" d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831" />
            <text x="18" y="20.35" class="percentage">{{ props.progress }}%</text>
        </svg>
    </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
    progress: number;
    size: number;
}>();
</script>