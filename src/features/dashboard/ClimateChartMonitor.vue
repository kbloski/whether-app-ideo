<template>
    <div>
        <div class="text-light">Your city: {{ cityData?.name }}</div>
        <div class="bg-light mt-2">
            <canvas ref="chartCanvas" width="400" height="400"></canvas>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {   computed, onMounted, ref, watch } from "vue";
import { createChart, destroyChart } from "@/utils/createChart";
import type { Chart } from "chart.js";
import { useSavedCitiesStore } from "@/stores/savedCitiesStore";

const props = defineProps<{ cityId: number }>();

const { getSavedCityById } = useSavedCitiesStore()

const savedCityData =  getSavedCityById(props.cityId)
const cityData = computed(() => savedCityData.value?.city) 
const historyData = computed(() => ({
    ...savedCityData.value?.historyData
}))

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;


function drawChart(){
    if (!historyData.value || !chartCanvas.value) return;

    if (chartInstance) {
        destroyChart(chartInstance);
    }

    chartInstance = createChart(chartCanvas.value, {
        labels: historyData.value.timestamps as string[] ?? [],
        datasets: [
            {
                label: "Temperatures (°C)",
                data: historyData.value.temperatures as number[] ?? [],
                fill: false,
                borderColor: "#2ca02c",
                tension: 0.1,
            },
            {
                label: "Humidity (%)",
                data: historyData.value.humidities as number[] ?? [],
                fill: false,
                borderColor: "#1f77b4",
                tension: 0.1,
            },
        ],
    });
}

onMounted(() => {
    drawChart()
})

watch([ historyData], () => {
    drawChart()
}   
, { immediate: true});


</script>

<style scoped>
canvas {
    width: 100%;
}
</style>
