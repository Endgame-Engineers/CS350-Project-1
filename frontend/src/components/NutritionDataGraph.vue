<template>
    <div class="chart-container">
        <Bar v-if="data.length > 0 && type != 'Water Consumed'" :data="chartData" :options="chartOptions" />
        <Line v-if="data.length > 0 && type == 'Water Consumed'" :data="waterChartData" :options="waterChartOptions" />
    </div>
</template>
<script setup lang="ts">
import { defineProps, computed, onMounted } from 'vue';
import { Bar, Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ChartData, ChartOptions } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement);

const chartProps = defineProps<{
    type: string | null;
    goalType: string | null;
    labels: string [];
    data: number[];
    goalData: number[] | null;
}>();

onMounted(() => {
    console.log(chartProps);
});

const chartData = computed(() => ({
    labels: chartProps.labels,
    datasets: [
        {
            label: chartProps.type,
            data: chartProps.data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        },
        ...(chartProps.goalData ? [{
            label: chartProps.goalType,
            data: chartProps.goalData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }] : []),
    ],
}) as ChartData<'bar'>);

const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: 'category',
            stacked: true,
        },
        y: {
            type: 'linear',
            stacked: false,
            beginAtZero: true,
        },
    },
};

const waterChartData = computed(() => ({
    labels: chartProps.labels,
    datasets: [
        {
            label: chartProps.type,
            data: chartProps.data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        },
        {
            label: chartProps.goalType,
            data: chartProps.goalData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        },
    ],
}) as ChartData<'line'>);

const waterChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: 'category',
            stacked: true,
        },
        y: {
            max: 500,
            type: 'linear',
            stacked: false,
            beginAtZero: true,
        },
    },
};


</script>