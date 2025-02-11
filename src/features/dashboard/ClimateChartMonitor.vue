<template>
    <div v-if="isLoading">Loading...</div>
    <TheError v-if="isError">Oh no, error, please contact support...</TheError>
    <div v-else>
        <div class="text-light">City: {{ data?.city.name }}</div>
        <div class="bg-light mt-2">
            <canvas ref="chartCanvas" width="400" height="400"></canvas>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";
import { useHourlyWeatherApiByCityId } from "@/services/useWeatherApi";
import { createChart, destroyChart } from "@/utils/createChart";
import type { Chart } from "chart.js";

const props = defineProps<{ cityId: number }>();
const { data, isLoading, isError } = useHourlyWeatherApiByCityId(props.cityId);


const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

watch([data], () => {
    if (!data.value || !chartCanvas.value) {
        return;
    };

    const labels: string[] = [];
    const temperatures: number[] = [];
    const humidity: number[] = [];

    data.value.list.forEach((el, index) => {
        if (index > 8) return;
        labels.push(el.dt_txt);
        temperatures.push(el.main.temp);
        humidity.push(el.main.humidity);
    });


    if (chartInstance) {
        destroyChart(chartInstance);
    }

    chartInstance = createChart(chartCanvas.value, {
        labels,
        datasets: [
            {
                label: "Temperatures (°C)",
                data: temperatures,
                fill: false,
                borderColor: "#2ca02c",
                tension: 0.1,
            },
            {
                label: "Humidity (%)",
                data: humidity,
                fill: false,
                borderColor: "#1f77b4",
                tension: 0.1,
            },
        ],
    });
}   
, { immediate: true, flush: 'post'});


</script>

<style scoped>
canvas {
    width: 100%;
}
</style>
