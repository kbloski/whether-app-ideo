<template>
        <div>
            <div class="text-light">Your city: {{ savedCityData.city.name }}</div>
            <div class="bg-light mt-2">
                <canvas ref="chartCanvas" width="400" height="400"></canvas>
            </div>
        </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { createChart, destroyChart } from "@/utils/createChart";
import type { Chart } from "chart.js";
import { useSavedCitiesStore } from "@/stores/savedCitiesStore";

const props = defineProps<{ cityId: number }>();

const { getSavedCityById } = useSavedCitiesStore()

const savedCityData =  getSavedCityById(props.cityId)


const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

function drawChart(){
    if (!savedCityData.historyData || !chartCanvas.value) return;

    if (chartInstance) {
        destroyChart(chartInstance);
    }

    chartInstance = createChart(chartCanvas.value, {
        labels: savedCityData.historyData.timestamps?.map(data => String(data)) ?? [],
        datasets: [
            {
                label: "Temperatures (°C)",
                data: savedCityData.historyData.temperatures?.map(data => Number(data)) ?? [],
                fill: false,
                borderColor: "#2ca02c",
                tension: 0.1,
            },
            {
                label: "Humidity (%)",
                data: savedCityData.historyData.humidities?.map(data => Number(data)) ?? [],
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

watch([ savedCityData], () => {
    drawChart()
}   
, { immediate: true});


</script>

<style scoped lang="scss">



canvas {
    width: 100%;
}
</style>
