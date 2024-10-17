<template>
    <div class="circle-container p-2" :style="{ width: props.size + 'em', height: props.size + 'em' }">
        <svg class="progress-circle" viewBox="0 0 36 36">
            <!-- Background circle -->
            <path class="circle-bg" d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831" />
            <!-- Progress circle -->
            <path v-if="props.progress > 0" class="circle" :stroke-dasharray="props.progress + ', 100'" d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831" />
            <text x="18" y="18" class="percentage">{{ props.progress || 0 }}%</text>
            <text v-if="props.title" x="18" y="22" class="circle-title">{{ props.title }}</text>
        </svg> 
    </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
    progress: number | 0;
    size: number;
    title?: string;
}>();

</script>